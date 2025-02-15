const fs = require("fs");
const path = require("path");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Cloudflare API credentials
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.ZONE_ID;

if (!CLOUDFLARE_API_TOKEN || !ZONE_ID) {
    console.error("❌ Missing Cloudflare API Token or Zone ID.");
    process.exit(1);
}

async function addDnsRecord(subdomain, record) {
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
                name: `${subdomain}`,
                content: record.value,
                ttl: 1,
                proxied: false,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errors?.[0]?.message || "Unknown Cloudflare error");
        }

        console.log(`✅ Successfully added DNS record for ${subdomain}`);
        return data;
    } catch (error) {
        console.error(`❌ Failed to add DNS record for ${subdomain}: ${error.message}`);
        process.exit(1);
    }
}

async function updateDnsRecords(filePath) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const { subdomain, record, vercel } = data;

        if (!subdomain || !record || !record.type || !record.value) {
            throw new Error("Invalid subdomain data: Missing required fields.");
        }

        await addDnsRecord(subdomain, record);

        // add vercel TXT record if hosted on vercel
        if (vercel && typeof vercel === "string") {
            await addDnsRecord(`_vercel`, { type: "TXT", value: `${vercel}` });
        }
    } catch (error) {
        console.error(`❌ Error processing file ${filePath}: ${error.message}`);
        process.exit(1);
    }
}

// Main script
const file = process.argv[2];
if (!file) {
    console.error("❌ No file specified.");
    process.exit(1);
}

updateDnsRecords(file);