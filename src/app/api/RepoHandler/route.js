import dotenv from 'dotenv';
dotenv.config();

export async function POST(request) {
  try {
    const { repoUrl } = await request.json();

    const regex = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/;
    const match = repoUrl.match(regex);

    if (!match) {
      return new Response(JSON.stringify({ message: "Invalid GitHub repository URL" }), {
        status: 400,
      });
    }

    const owner = match[1];
    const repo = match[2];

    const fetchRepoData = async (owner, repo) => {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
        },
      });
      return response.json();
    };

    const repoResponse = await fetchRepoData(owner, repo);
    console.log("GitHub API response status:", repoResponse.status);

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      console.error("Failed to fetch repo from GitHub:", repoResponse.status, repoResponse.statusText, errorText);
      return new Response(JSON.stringify({ message: "Failure to fetch repo from GitHub" }), { status: 400 });
    }

    const repoData = await repoResponse.json();

    if (repoData.private) {
      return new Response(JSON.stringify({ message: "The repository is private" }), {
        status: 400,
      });
    }

    const languagesResponse = await fetch(repoData.languages_url, { headers });
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};

    const codeKeywords = [
      'index', 'main', 'app', 'server', 'page', 'component', 'controller', 'handler',
      'entry', 'api', 'module', 'service', 'core', 'cli', 'router', 'view', 'route', 'layout'
    ];

    const codeFileExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.html', '.css', '.c', '.cpp', '.h',
    ];

    const isRelevantFile = (fileName) => {
      const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
      return (codeKeywords.some(keyword => fileName.toLowerCase().includes(keyword)) || 
              codeFileExtensions.includes(fileExtension)) &&
             !fileName.toLowerCase().includes('config') &&
             !fileName.toLowerCase().includes('json') &&
             !fileName.toLowerCase().includes('test') &&
             !fileName.toLowerCase().includes('license');
    };

    const fetchFiles = async (path = '') => {
      if (resumeData.files.length >= 50) return;
    
      const filesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers });
      const files = await filesResponse.json();
    
      for (const file of files) {
        if (file.type === 'file' && resumeData.files.length < 50) {
          const fileName = file.name.toLowerCase();
    
          if (isRelevantFile(fileName)) {
            const fileContentResponse = await fetch(file.download_url, { headers });
            if (fileContentResponse.ok) {
              const fileContent = await fileContentResponse.text();
              const first200Lines = fileContent.split("\n").slice(0, 200).join("\n");
    
              resumeData.files.push({ [file.name]: first200Lines });
            } else {
              resumeData.files.push({ [file.name]: "Unable to fetch file content" });
            }
          }
        } else if (file.type === 'dir' && resumeData.files.length < 50) {
          await fetchFiles(file.path);
        }
    
        if (resumeData.files.length >= 50) break;
      }
    };

    const resumeData = {
      name: repoData.name,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      description: repoData.description || 'No description provided',
      owner: {
        username: repoData.owner.login,
        avatar_url: repoData.owner.avatar_url,
      },
      license: repoData.license ? repoData.license.name : 'No license specified',
      languages: Object.keys(languages).join(', '),
      files: [], 
    };
    
    await fetchFiles();

    return new Response(JSON.stringify({
      message: "Repository is valid",
      success: true,
      resumeData,
    }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to check repository", error: error.message }),
      { status: 500 }
    );
  }
}