const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');

// Function to check for backlinks
async function checkBacklinks(targetUrl) {
  try {
    // Fetch the HTML content of the target URL
    const response = await axios.get(targetUrl);
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract all <a> tags
    const links = $('a');

    // Check each link to see if it's a backlink
    links.each((index, element) => {
      const link = $(element).attr('href');
      if (isBacklink(targetUrl, link)) {
        console.log(`Backlink found: ${link}`);
      }
    });
  } catch (error) {
    console.error(`Error fetching or parsing ${targetUrl}:`, error);
  }
}

// Function to determine if a link is a backlink
function isBacklink(targetUrl, link) {
  // Resolve the link to an absolute URL
  const resolvedLink = url.resolve(targetUrl, link);

  // Check if the resolved link is a backlink
  return resolvedLink.startsWith(targetUrl);
}

// Example usage
const targetUrl = 'https://mypoufs.com'; // Replace with your target URL
checkBacklinks(targetUrl);
