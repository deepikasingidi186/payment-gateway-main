const pool = require("../config/db");
const { generatePaymentId } = require("../utils/idGenerator");
const {
  validateVPA,
  validateCardNumber,
  detectCardNetwork,
  validateExpiry
} = require("./validation.service");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

exports.createPayment = async (merchantId, data) => {
  const { order_id, method, vpa, card } = data;

  // 1️⃣ Fetch order
  const orderRes = await pool.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [order_id, merchantId]
  );

  if (orderRes.rows.length === 0) {
    throw {
      status: 404,
      code: "NOT_FOUND_ERROR",
      description: "Order not found"
    };
  }

  const order = orderRes.rows[0];

  // 2️⃣ Method validation
  let paymentData = {};

  if (method === "upi") {
    if (!vpa || !validateVPA(vpa)) {
      throw {
        status: 400,
        code: "INVALID_VPA",
        description: "VPA format invalid"
      };
    }
    paymentData.vpa = vpa;
  }

  if (method === "card") {
    if (!card) {
      throw {
        status: 400,
        code: "INVALID_CARD",
        description: "Card details required"
      };
    }

    const { number, expiry_month, expiry_year } = card;

    if (!validateCardNumber(number)) {
      throw {
        status: 400,
        code: "INVALID_CARD",
        description: "Card validation failed"
      };
    }

    if (!validateExpiry(expiry_month, expiry_year)) {
      throw {
        status: 400,
        code: "EXPIRED_CARD",
        description: "Card expiry date invalid"
      };
    }

    paymentData.card_network = detectCardNetwork(number);
    paymentData.card_last4 = number.slice(-4);
  }

  // 3️⃣ Generate payment id
  let paymentId;
  while (true) {
    paymentId = generatePaymentId();
    const exists = await pool.query(
      "SELECT id FROM payments WHERE id=$1",
      [paymentId]
    );
    if (exists.rows.length === 0) break;
  }

  // 4️⃣ Insert payment (status = processing)
  await pool.query(
    `INSERT INTO payments
     (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      paymentId,
      order.id,
      merchantId,
      order.amount,
      order.currency,
      method,
      "processing",
      paymentData.vpa || null,
      paymentData.card_network || null,
      paymentData.card_last4 || null
    ]
  );

  // 5️⃣ Processing delay
  const testMode = process.env.TEST_MODE === "true";
  const delay = testMode
    ? parseInt(process.env.TEST_PROCESSING_DELAY || "1000")
    : 5000 + Math.random() * 5000;

  await sleep(delay);

  // 6️⃣ Success / failure
  let success;
  if (testMode) {
    success = process.env.TEST_PAYMENT_SUCCESS !== "false";
  } else {
    success = method === "upi"
      ? Math.random() < 0.9
      : Math.random() < 0.95;
  }

  if (success) {
    await pool.query(
      "UPDATE payments SET status='success', updated_at=NOW() WHERE id=$1",
      [paymentId]
    );
  } else {
    await pool.query(
      `UPDATE payments
       SET status='failed',
           error_code='PAYMENT_FAILED',
           error_description='Payment processing failed',
           updated_at=NOW()
       WHERE id=$1`,
      [paymentId]
    );
  }

  // 7️⃣ Return payment
  const result = await pool.query(
    "SELECT * FROM payments WHERE id=$1",
    [paymentId]
  );

  return result.rows[0];
};

exports.getPayment = async (paymentId) => {
  const result = await pool.query(
    "SELECT * FROM payments WHERE id = $1",
    [paymentId]
  );

  if (result.rows.length === 0) {
    throw {
      status: 404,
      code: "NOT_FOUND_ERROR",
      description: "Payment not found"
    };
  }

  return result.rows[0];
};

exports.getPublicPayment = async (paymentId) => {
  const result = await pool.query(
    "SELECT id, order_id, amount, currency, method, status, vpa, card_network, card_last4, created_at, updated_at FROM payments WHERE id=$1",
    [paymentId]
  );

  if (result.rows.length === 0) {
    throw {
      status: 404,
      code: "NOT_FOUND_ERROR",
      description: "Payment not found"
    };
  }

  return result.rows[0];
};
