const fs = require("fs");

const file = process.argv[2];
if (!file) {
    console.error("❌ No file specified for validation.");
    process.exit(1);
}

// Allow only `A` and `CNAME` record types
const allowedRecordTypes = ["A", "CNAME"];
const allowedDomainNames = ["lovestoco.de"];
// reserved subdomains - thanks to https://github.com/is-a-dev/register/blob/main/util/reserved.json - i copied it from here lil bro 😜
const reservedSubdomains = [
    "_acme-challenge.www",
    "_atproto.www",
    "_discord.www",
    "_vercel.www",
    "account",
    "accounts",
    "admin",
    "administrator",
    "alert",
    "alerts",
    "api",
    "auth",
    "authentication",
    "authorisation",
    "authorise",
    "authorization",
    "authorize",
    "aux",
    "billing",
    "blog",
    "calendar",
    "cart",
    "catalog",
    "chat",
    "checkout",
    "co",
    "com",
    "con",
    "confirm",
    "confirmation",
    "dashboard",
    "default",
    "dns",
    "doc",
    "documentation",
    "email",
    "emails",
    "error",
    "errors",
    "event",
    "events",
    "example",
    "feedback",
    "finance",
    "forgot",
    "forgot-password",
    "gtld",
    "guest",
    "help",
    "helpdesk",
    "hostmaster",
    "info",
    "infos",
    "int",
    "internal",
    "login",
    "logout",
    "lpt[1-9]",
    "m",
    "mail",
    "maintainer",
    "maintainers",
    "marketing",
    "media",
    "mobile",
    "net",
    "network",
    "news",
    "noc",
    "notification",
    "notifications",
    "notify",
    "ns",
    "nul",
    "oauth",
    "official",
    "operations",
    "ops",
    "org",
    "organisation",
    "pay",
    "payment",
    "payments",
    "portal",
    "postmaster",
    "recovery",
    "redirect",
    "registrar",
    "registry",
    "reset",
    "reset-password",
    "root",
    "sales",
    "schedule",
    "secure",
    "security",
    "service",
    "services",
    "session",
    "sessions",
    "shop",
    "signin",
    "signout",
    "signup",
    "staff",
    "statistics",
    "stats",
    "status",
    "store",
    "superuser",
    "support",
    "sys",
    "system",
    "teams",
    "test",
    "tld",
    "token",
    "tokens",
    "url",
    "user",
    "users",
    "webmail",
    "webmaster",
    "whois",
    "wwww",
    "your-domain-name"
];

try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    const errors = [];

    // Validate required fields
    if (!data.description) errors.push("Usage description is missing. Add the `description` field.");
    if (!data.subdomain) errors.push("Missing subdomain.");
    if (!data.domain || !allowedDomainNames.includes(data.domain)) errors.push("Missing or invalid domain name.");
    if (!data.record || !data.record.type) errors.push("Missing record type.");
    if (!data.record || !data.record.value) errors.push("Missing record value.");
    if (!data.owner || !data.owner.email) errors.push("Missing owner email.");
    if (!data.owner || !data.owner.github) errors.push("Missing owner GitHub username.");

    if (!allowedRecordTypes.includes(data.record.type)) {
        errors.push(`Invalid record type "${data.record.type}". Only ${allowedRecordTypes.join(", ")} are allowed.`);
    }

    if (reservedSubdomains.includes(data.subdomain)) {
        errors.push(`baka dont use a reserved subdomain name.`);
    }

    // Add any additional checks to prevent sensitive or unwanted records
    // Example: Block sensitive IP ranges or values
    const blockedPatterns = [/^127\./, /^192\.168\./, /^10\./]; // Private IP ranges
    if (
        data.record.type === "A" &&
        blockedPatterns.some((pattern) => pattern.test(data.record.value))
    ) {
        errors.push("Invalid record value for type A: Private or sensitive IP addresses are not allowed.");
    }

    if (errors.length > 0) {
        console.error(`❌ Validation errors in ${file}:\n- ${errors.join("\n- ")}`);
        process.exit(1);
    }

    console.log(`✅ Validation passed for ${file}`);
} catch (error) {
    console.error(`❌ Failed to validate ${file}: ${error.message}`);
    process.exit(1);
}
