const paymentService = require("../services/payment.service");

exports.createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(
      req.merchant.id,
      req.body
    );

    const response = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at
    };

    if (payment.method === "upi") {
      response.vpa = payment.vpa;
    }

    if (payment.method === "card") {
      response.card_network = payment.card_network;
      response.card_last4 = payment.card_last4;
    }

    return res.status(201).json(response);
  } catch (err) {
    return res.status(err.status || 500).json({
      error: {
        code: err.code || "PAYMENT_FAILED",
        description: err.description || "Payment processing failed"
      }
    });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPayment(
      req.params.paymentId
    );

    const response = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at,
      updated_at: payment.updated_at
    };

    if (payment.method === "upi") {
      response.vpa = payment.vpa;
    }

    if (payment.method === "card") {
      response.card_network = payment.card_network;
      response.card_last4 = payment.card_last4;
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(err.status || 500).json({
      error: {
        code: err.code || "NOT_FOUND_ERROR",
        description: err.description || "Payment not found"
      }
    });
  }
};

exports.getPublicPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPublicPayment(
      req.params.paymentId
    );

    const response = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at,
      updated_at: payment.updated_at
    };

    if (payment.method === "upi") {
      response.vpa = payment.vpa;
    }

    if (payment.method === "card") {
      response.card_network = payment.card_network;
      response.card_last4 = payment.card_last4;
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(err.status || 500).json({
      error: {
        code: err.code || "NOT_FOUND_ERROR",
        description: err.description || "Payment not found"
      }
    });
  }
};
