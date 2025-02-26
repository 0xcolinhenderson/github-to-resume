import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

const getImportantFiles = (files) => {
  const importantKeywords = ["main", "index", "app", "server", "api", "router", "controller", "service"];
  const codingFileExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".rb", ".go", ".php", ".cpp", ".c", ".cs"];

  const importantFiles = files.filter(file => 
    importantKeywords.some(keyword => file.path.toLowerCase().includes(keyword)) &&
    codingFileExtensions.some(ext => file.path.toLowerCase().endsWith(ext))
  );

  if (importantFiles.length >= 10) {
    return importantFiles.slice(0, 10);
  }

  const additionalFiles = files.filter(file => 
    codingFileExtensions.some(ext => file.path.toLowerCase().endsWith(ext)) &&
    !importantFiles.includes(file)
  );
  return [...importantFiles, ...additionalFiles.slice(0, 10 - importantFiles.length)];
};

const fetchAllFiles = async (owner, repo, path = "") => {
  const { data: contents } = await octokit.repos.getContent({ owner, repo, path });
  let files = [];

  for (const item of contents) {
    if (item.type === "file") {
      files.push(item);
    } else if (item.type === "dir") {
      const subFiles = await fetchAllFiles(owner, repo, item.path);
      files = files.concat(subFiles);
    }
  }

  return files;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

export async function POST(request) {
  try {
    const { repoUrl } = await request.json();
    const [owner, repo] = repoUrl.split("github.com/")[1].split("/");
    
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const { data: languages } = await octokit.repos.listLanguages({ owner, repo });

    const files = await fetchAllFiles(owner, repo);
    const importantFiles = getImportantFiles(files);

    const fileContents = await Promise.all(
      importantFiles.map(async (file) => {
        const { data: fileData } = await octokit.repos.getContent({ owner, repo, path: file.path });
        const content = Buffer.from(fileData.content, "base64").toString("utf-8");
        return { [file.path]: content.split("\n").slice(0, 100).join("\n") };
      })
    );

    const response = {
      name: repoData.name,
      description: repoData.description,
      languages: Object.keys(languages).join(", "),
      created_at: formatDate(repoData.created_at),
      updated_at: formatDate(repoData.updated_at),
      files: fileContents,
    };

    return new Response(JSON.stringify(response), { status: 200, success: true });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch repository data", error: error.message }), { status: 500 });
  }
}