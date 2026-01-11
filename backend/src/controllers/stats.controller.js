const pool = require("../config/db");

exports.getStats = async (req, res) => {
  const merchantId = req.merchant.id;

  const totalPayments = await pool.query(
    "SELECT COUNT(*) FROM payments WHERE merchant_id=$1",
    [merchantId]
  );

  const successfulPayments = await pool.query(
    "SELECT COUNT(*), COALESCE(SUM(amount),0) FROM payments WHERE merchant_id=$1 AND status='success'",
    [merchantId]
  );

  const total = parseInt(totalPayments.rows[0].count);
  const successCount = parseInt(successfulPayments.rows[0].count);
  const totalAmount = successfulPayments.rows[0].coalesce || successfulPayments.rows[0].sum || 0;

  const successRate = total === 0 ? 0 : Math.round((successCount / total) * 100);

  return res.json({
    total_transactions: total,
    total_amount: totalAmount,
    success_rate: successRate
  });
};
