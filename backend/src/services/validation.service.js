exports.validateVPA = (vpa) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return regex.test(vpa);
};

exports.validateCardNumber = (cardNumber) => {
  const clean = cardNumber.replace(/[\s-]/g, "");

  if (!/^\d{13,19}$/.test(clean)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

exports.detectCardNetwork = (cardNumber) => {
  const num = cardNumber.replace(/[\s-]/g, "");

  if (num.startsWith("4")) return "visa";

  if (/^5[1-5]/.test(num)) return "mastercard";

  if (/^3[47]/.test(num)) return "amex";

  if (/^(60|65|8[1-9])/.test(num)) return "rupay";

  return "unknown";
};

exports.validateExpiry = (month, year) => {
  const m = parseInt(month);
  let y = parseInt(year);

  if (m < 1 || m > 12) return false;

  if (year.length === 2) {
    y += 2000;
  }

  const now = new Date();
  const expiry = new Date(y, m);

  return expiry >= new Date(now.getFullYear(), now.getMonth());
};
