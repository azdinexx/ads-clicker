const puppeteer = require('puppeteer');

async function searchGoogle(query) {
  const browser = await puppeteer.launch({ headless: false }); // Set headless to false to see the browser in action
  const page = await browser.newPage();

  await page.goto('https://www.google.com', {
    timeout: 60000,
  });

  // Type the search query into the search box
  await page.type('textarea[name=q]', query);

  // Submit the form
  await page.keyboard.press('Enter');

  // Wait for the search results to load
  await page.waitForNavigation();

  // Extract the content of the next <div> after elements with class names 'U3A9Ac' and 'qV8iec'
  const links = await page.evaluate(() => {
    const elements = document.querySelectorAll('.U3A9Ac, .qV8iec');
    let links = [];
    elements.forEach((element) => {
      const nextDiv = element.nextElementSibling;
      if (nextDiv && nextDiv.tagName === 'DIV') {
        if (!nextDiv.textContent.includes('benidex')) {
          const link = nextDiv.querySelector('a');
          if (link) {
            links.push(link.href);
          } else {
            console.log('benidex found');
          }
        }
      }
    });
    return links;
  });

  // Open each link in a new page
  for (const link of links) {
    const newPage = await browser.newPage();
    await newPage.goto(link, {
      timeout: 60000,
    });
    console.log(`Opened link: ${link}`);

    // Perform any actions on the new page as needed
    // For example, you can take a screenshot of the page
    await newPage.screenshot({
      path: `screenshot_${
        query.toLowerCase().replaceAll(' ', '-') + '-' + links.indexOf(link)
      }.png`,
    });

    // Close the new page to free up resources
    await newPage.close();
  }

  // Continue with the original page
  console.log('Continuing with the original page...');
  // You

  await browser.close();
}

//  usage
searchGoogle('mobilier scolaire maroc')
  .then(() => console.log('Search completed.'))
  .then(() =>
    searchGoogle('benidex maroc').then(() => console.log('Search completed.'))
  );
