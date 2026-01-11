import { useEffect, useState } from "react";
import axios from "axios";

export default function Checkout() {
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(null);
  const [vpa, setVpa] = useState("");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [paymentId, setPaymentId] = useState(null);
  const [status, setStatus] = useState("idle");

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  // Fetch order
  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`http://localhost:8000/api/v1/orders/${orderId}/public`)
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null));
  }, [orderId]);

  // Poll payment
  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(() => {
      axios
        .get(`http://localhost:8000/api/v1/payments/${paymentId}/public`)
        .then(res => {
          if (res.data.status === "success") {
            setStatus("success");
            clearInterval(interval);
          }
          if (res.data.status === "failed") {
            setStatus("failed");
            clearInterval(interval);
          }
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentId]);

  const handleUPIPay = (e) => {
    e.preventDefault();
    setStatus("processing");

    axios
      .post(`http://localhost:8000/api/v1/payments/public`, {
        order_id: order.id,
        method: "upi",
        vpa
      })
      .then(res => {
        setPaymentId(res.data.id);
      })
      .catch(() => setStatus("failed"));
  };

  const handleCardPay = (e) => {
    e.preventDefault();
    setStatus("processing");

    const [expiry_month, expiry_year] = card.expiry.split("/");

    axios
      .post(`http://localhost:8000/api/v1/payments/public`, {
        order_id: order.id,
        method: "card",
        card: {
          number: card.number,
          expiry_month,
          expiry_year,
          cvv: card.cvv,
          holder_name: card.name
        }
      })
      .then(res => {
        setPaymentId(res.data.id);
      })
      .catch(() => setStatus("failed"));
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div data-test-id="checkout-container">

      {/* Order Summary */}
      <div data-test-id="order-summary">
        <h2>Complete Payment</h2>
        <div>
          <span>Amount: </span>
          <span data-test-id="order-amount">
            ₹{(order.amount / 100).toFixed(2)}
          </span>
        </div>
        <div>
          <span>Order ID: </span>
          <span data-test-id="order-id">{order.id}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div data-test-id="payment-methods">
        <button data-test-id="method-upi" onClick={() => setMethod("upi")}>
          UPI
        </button>
        <button data-test-id="method-card" onClick={() => setMethod("card")}>
          Card
        </button>
      </div>

      {/* UPI Form */}
      {method === "upi" && status === "idle" && (
        <form data-test-id="upi-form" onSubmit={handleUPIPay}>
          <input
            data-test-id="vpa-input"
            placeholder="username@bank"
            value={vpa}
            onChange={e => setVpa(e.target.value)}
          />
          <button data-test-id="pay-button">
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {/* Card Form */}
      {method === "card" && status === "idle" && (
        <form data-test-id="card-form" onSubmit={handleCardPay}>
          <input
            data-test-id="card-number-input"
            placeholder="Card Number"
            onChange={e => setCard({ ...card, number: e.target.value })}
          />
          <input
            data-test-id="expiry-input"
            placeholder="MM/YY"
            onChange={e => setCard({ ...card, expiry: e.target.value })}
          />
          <input
            data-test-id="cvv-input"
            placeholder="CVV"
            onChange={e => setCard({ ...card, cvv: e.target.value })}
          />
          <input
            data-test-id="cardholder-name-input"
            placeholder="Name on Card"
            onChange={e => setCard({ ...card, name: e.target.value })}
          />
          <button data-test-id="pay-button">
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div data-test-id="processing-state">
          <span data-test-id="processing-message">
            Processing payment...
          </span>
        </div>
      )}

      {/* Success */}
      {status === "success" && (
        <div data-test-id="success-state">
          <h2>Payment Successful!</h2>
          <span data-test-id="payment-id">{paymentId}</span>
        </div>
      )}

      {/* Failure */}
      {status === "failed" && (
        <div data-test-id="error-state">
          <h2>Payment Failed</h2>
          <button data-test-id="retry-button" onClick={() => setStatus("idle")}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
