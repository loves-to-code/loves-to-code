const fs = require("fs");
const path = require("path");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.ZONE_ID;

if (!CLOUDFLARE_API_TOKEN || !ZONE_ID) {
    console.error("❌ Missing environment variables: CLOUDFLARE_API_TOKEN or ZONE_ID");
    process.exit(1);
}

const subdomainsDir = path.join(__dirname, "../subdomains");

// Function to check if a DNS record already exists
async function dnsRecordExists(subdomain, record) {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=${record.type}&name=${subdomain}.`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Cloudflare API Error: ${data.errors?.[0]?.message || "Unknown error"}`);
        }

        // Check if the record already exists
        return data.result.some(
            (r) => r.name === `${subdomain}.` && r.content === record.value
        );
    } catch (error) {
        console.error(`❌ Failed to check DNS record for ${subdomain}:`, error.message);
        throw error;
    }
}

// Function to add a subdomain to Cloudflare
async function addSubdomain(subdomain, record) {
    const exists = await dnsRecordExists(subdomain, record);

    if (exists) {
        console.log(`⚠️ DNS record for ${subdomain} already exists. Skipping...`);
        return;
    }

    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: record.type,
                name: `${subdomain}.`,
                content: record.value,
                ttl: 1,
                proxied: false,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Cloudflare API Error: ${data.errors?.[0]?.message || "Unknown error"}`);
        }

        console.log(`✅ Subdomain ${subdomain} added successfully!`);
        return data;
    } catch (error) {
        console.error(`❌ Failed to add subdomain ${subdomain}:`, error.message);
        throw error;
    }
}

// Main function to process changed subdomains
async function processChangedSubdomains(changedFiles) {
    for (const file of changedFiles) {
        const filePath = path.join(subdomainsDir, file);
        const subdomainData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const { subdomain, record } = subdomainData;
        await addSubdomain(subdomain, record);
    }
}

// Exported function for GitHub Workflow
module.exports = async function runWorkflow(changedFiles) {
    try {
        await processChangedSubdomains(changedFiles);
    } catch (error) {
        console.error("❌ Error processing subdomains:", error.message);
        process.exit(1);
    }
};
