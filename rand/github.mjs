/**
 * 
 * Example usage:
 * getPublicRepoFiles("octocat", "Hello-World");
 * 
 * eg. result `[
    {
        "name": "README.md",
        "path": "README.md",
        "type": "file"
    },
    {
        "name": "_",
        "path": "_",
        "type": "dir"
    }
]`
 * 
 * @param {string} owner 
 * @param {string} repo 
 * @param {string} path 
 * @returns  directory structure
 */

export async function getPublicRepoFiles(owner, repo, path = "") {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Map the data to extract relevant details
      const files = data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type, // "file" or "dir"
      }));
  
      console.log(files);
      return files;
    } catch (error) {
      console.error("Failed to fetch repository files:", error);
    }
  }
  

  /**
   * get tags
   * example response 
   * `[
    {
        "name": "v4",
        "commitSha": "9020d75c0d3bd41ac688f81baf46d052b66fe010"
    },
    {
        "name": "v3",
        "commitSha": "9a9db251eaab0f125e47b0668575cbe7a83b3b9b"
    },
    {
        "name": "v2",
        "commitSha": "42398ab58ab238614436737e320395c59a9dfbfd"
    },
    {
        "name": "v1",
        "commitSha": "ced850abe43db29430e8d7cbade68e07941ab05f"
    }
]`
   * @param {string} owner 
   * @param {string} repo 
   * @returns list of tags
   */

  async function getRepoTags(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/tags`;
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const tags = await response.json();
  
      // Map the tags to extract the relevant details
      const formattedTags = tags.map((tag) => ({
        name: tag.name,
        commitSha: tag.commit.sha,
      }));
  
      console.log(formattedTags);
      return formattedTags;
    } catch (error) {
      console.error("Failed to fetch repository tags:", error);
    }
  }
  
  // Example usage
  //getRepoTags("octocat", "Hello-World");
  