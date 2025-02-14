const fs = require("fs");

const file = process.argv[2];
if (!file) {
    console.error("❌ No file specified for validation.");
    process.exit(1);
}

try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    const errors = [];

    if (!data.subdomain) errors.push("Missing subdomain.");
    if (!data.record || !data.record.type) errors.push("Missing record type.");
    if (!data.record || !data.record.value) errors.push("Missing record value.");
    if (!data.owner || !data.owner.email) errors.push("Missing owner email.");
    if (!data.owner || !data.owner.github) errors.push("Missing owner GitHub username.");

    if (errors.length > 0) {
        console.error(`❌ Validation errors in ${file}:\n- ${errors.join("\n- ")}`);
        process.exit(1);
    }

    console.log(`✅ Validation passed for ${file}`);
} catch (error) {
    console.error(`❌ Failed to validate ${file}: ${error.message}`);
    process.exit(1);
}
