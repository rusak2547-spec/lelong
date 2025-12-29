const fs = require("fs");
const path = require("path");

const envContent = `DATABASE_URL="file:./dev.db"`;
const envPath = path.join(__dirname, "..", ".env");

fs.writeFileSync(envPath, envContent, "utf8");
console.log(".env file has been reset to SQLite (file:./dev.db).");
