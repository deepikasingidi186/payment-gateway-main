require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./config/db");
const app = require("./app");
const { seedTestMerchant } = require("./services/seed.service");

const PORT = process.env.PORT || 8000;

(async () => {
  const schema = fs.readFileSync(
    path.join(__dirname, "config/schema.sql")
  ).toString();

  await pool.query(schema);
  await seedTestMerchant();

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
})();
