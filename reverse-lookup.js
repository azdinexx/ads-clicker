//dns lookup

const dns = require('dns');

async function areWebsitesOnSameHost(website1, website2) {
  try {
    const website1Ips = await dnsLookup(website1);
    const website2Ips = await dnsLookup(website2);

    // Check if any IP addresses are the same
    const sameIpFound = website1Ips.some((ip) => website2Ips.includes(ip));

    if (sameIpFound) {
      console.log(`${website1} and ${website2} are hosted on the same server.`);
    } else {
      console.log(
        `${website1} and ${website2} are not hosted on the same server.`
      );
    }
  } catch (error) {
    console.error(`Error checking websites:`, error);
  }
}

function dnsLookup(hostname) {
  return new Promise((resolve, reject) => {
    dns.resolve(hostname, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
}

// Example usage
areWebsitesOnSameHost('www.benidex.com');
