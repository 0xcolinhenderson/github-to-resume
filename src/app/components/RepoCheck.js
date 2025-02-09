export async function POST(request) {
  try {
    const { repoUrl } = await request.json();
    console.log("Received repo URL:", repoUrl);

    const regex = /^https:\/\/github\.com\/([^/]+)\/([^/]+)$/;
    const match = repoUrl.match(regex);

    if (!match) {
      return new Response(
        JSON.stringify({ message: "Invalid GitHub repository URL", success: false }),
        { status: 400 }
      );
    }

    const owner = match[1];
    const repo = match[2];

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

    if (response.ok) {
      const repoData = await response.json();
      if (repoData.private) {
        return new Response(
          JSON.stringify({ message: "The repository is private.", success: false }),
          { status: 400 }
        );
      }
      return new Response(
        JSON.stringify({ message: "Repository is valid", success: true }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Repository not found! (Maybe its private?)", success: false }),
        { status: 400 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to check repository.", success: false }),
      { status: 500 }
    );
  }
}
