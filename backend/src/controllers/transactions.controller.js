const pool = require("../config/db");

exports.getTransactions = async (req, res) => {
  const merchantId = req.merchant.id;

  const result = await pool.query(
    `SELECT id, order_id, amount, method, status, created_at
     FROM payments
     WHERE merchant_id=$1
     ORDER BY created_at DESC`,
    [merchantId]
  );

  return res.json(result.rows);
};
