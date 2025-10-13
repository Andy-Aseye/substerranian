export const formatDriveLink = (url: string): string => {
    if (!url) return "";
  
    // Extract the ID from Google Drive "view" URLs
    const match = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  
    // Return unchanged if not a matching Drive link
    return url;
  };
  