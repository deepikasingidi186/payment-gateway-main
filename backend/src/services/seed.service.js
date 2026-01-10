const pool = require("../config/db");

exports.seedTestMerchant = async () => {
  const { TEST_MERCHANT_EMAIL, TEST_API_KEY, TEST_API_SECRET } = process.env;

  const check = await pool.query(
    "SELECT id FROM merchants WHERE email=$1",
    [TEST_MERCHANT_EMAIL]
  );

  if (check.rows.length > 0) return;

  await pool.query(
    `INSERT INTO merchants
     (id, name, email, api_key, api_secret)
     VALUES ($1,$2,$3,$4,$5)`,
    [
      "550e8400-e29b-41d4-a716-446655440000",
      "Test Merchant",
      TEST_MERCHANT_EMAIL,
      TEST_API_KEY,
      TEST_API_SECRET,
    ]
  );
};
