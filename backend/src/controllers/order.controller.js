const orderService = require("../services/order.service");

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(
      req.merchant.id,
      req.body
    );

    return res.status(201).json({
      id: order.id,
      merchant_id: order.merchant_id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
      status: order.status,
      created_at: order.created_at
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: {
        code: err.code || "BAD_REQUEST_ERROR",
        description: err.description || "Something went wrong"
      }
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrder(
      req.params.orderId,
      req.merchant.id
    );

    return res.status(200).json(order);
  } catch (err) {
    return res.status(err.status || 500).json({
      error: {
        code: err.code || "NOT_FOUND_ERROR",
        description: err.description || "Order not found"
      }
    });
  }
};
