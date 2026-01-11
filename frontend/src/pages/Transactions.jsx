import { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/transactions", {
      headers: {
        "X-Api-Key": "key_test_abc123",
        "X-Api-Secret": "secret_test_xyz789"
      }
    }).then(res => setRows(res.data));
  }, []);

  return (
    <table data-test-id="transactions-table">
      <thead>
        <tr>
          <th>Payment ID</th>
          <th>Order ID</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Status</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr
            key={r.id}
            data-test-id="transaction-row"
            data-payment-id={r.id}
          >
            <td data-test-id="payment-id">{r.id}</td>
            <td data-test-id="order-id">{r.order_id}</td>
            <td data-test-id="amount">{r.amount}</td>
            <td data-test-id="method">{r.method}</td>
            <td data-test-id="status">{r.status}</td>
            <td data-test-id="created-at">
              {new Date(r.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
