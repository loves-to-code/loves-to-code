const fs = require("fs");
const path = require("path");

// Validation function for a single subdomain file
function validateSubdomainData(data, fileName) {
    const errors = [];

    // Check required fields
    if (!data.subdomain) errors.push("Missing required field: subdomain");
    if (!data.domain) errors.push("Missing required field: domain");
    if (!data.owner || !data.owner.email) errors.push("Missing required field: owner.email");
    if (!data.owner || !data.owner.github) errors.push("Missing required field: owner.github");
    if (!data.record || !data.record.type) errors.push("Missing required field: record.type");
    if (!data.record || !data.record.value) errors.push("Missing required field: record.value");

    if (errors.length > 0) {
        console.error(`❌ Validation errors in file ${fileName}:`);
        errors.forEach((error) => console.error(`- ${error}`));
        process.exit(1); // Exit with an error code to fail the workflow
    } else {
        console.log(`✅ File ${fileName} passed validation.`);
    }
}

// Main function to process the specified file
function validateFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1); // Exit with an error code to fail the workflow
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    validateSubdomainData(data, path.basename(filePath));
}

// Get file path from command-line arguments
const filePath = process.argv[2];
if (!filePath) {
    console.error("❌ No file specified for validation.");
    process.exit(1); // Exit with an error code to fail the workflow
}

validateFile(path.resolve(filePath));
