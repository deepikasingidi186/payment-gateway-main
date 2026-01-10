const pool = require("../config/db");
const { generateOrderId } = require("../utils/idGenerator");

exports.createOrder = async (merchantId, data) => {
  const { amount, currency, receipt, notes } = data;

  if (!amount || amount < 100) {
    throw {
      status: 400,
      code: "BAD_REQUEST_ERROR",
      description: "amount must be at least 100"
    };
  }

  let orderId;
  while (true) {
    orderId = generateOrderId();
    const exists = await pool.query(
      "SELECT id FROM orders WHERE id=$1",
      [orderId]
    );
    if (exists.rows.length === 0) break;
  }

  const result = await pool.query(
    `INSERT INTO orders
     (id, merchant_id, amount, currency, receipt, notes)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      orderId,
      merchantId,
      amount,
      currency || "INR",
      receipt || null,
      notes || {}
    ]
  );

  return result.rows[0];
};

exports.getOrder = async (orderId, merchantId) => {
  const result = await pool.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [orderId, merchantId]
  );

  if (result.rows.length === 0) {
    throw {
      status: 404,
      code: "NOT_FOUND_ERROR",
      description: "Order not found"
    };
  }

  return result.rows[0];
};
