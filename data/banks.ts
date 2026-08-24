import type { Bank } from "../lib/types";

/**
 * SAFETY RULE, NO EXCEPTIONS: the only real numbers in this product are
 * 1930 and 112. Every mockFraudLine below is the same clearly fake
 * placeholder, rendered on screen with a "(mock number)" label by the
 * component — never trust the data file alone.
 */
const MOCK_LINE = "1800-000-0000";

export const BANKS: Bank[] = [
  { id: "sbi", name: "State Bank of India", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "hdfc", name: "HDFC Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "icici", name: "ICICI Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "axis", name: "Axis Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "kotak", name: "Kotak Mahindra Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "pnb", name: "Punjab National Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "bob", name: "Bank of Baroda", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "canara", name: "Canara Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "union", name: "Union Bank of India", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "idbi", name: "IDBI Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "idfc", name: "IDFC FIRST Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "yes", name: "Yes Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "indusind", name: "IndusInd Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "federal", name: "Federal Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "au", name: "AU Small Finance Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "bandhan", name: "Bandhan Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "iob", name: "Indian Overseas Bank", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "cbi", name: "Central Bank of India", type: "bank", mockFraudLine: MOCK_LINE },
  { id: "paytm", name: "Paytm", type: "wallet", mockFraudLine: MOCK_LINE },
  { id: "phonepe", name: "PhonePe", type: "wallet", mockFraudLine: MOCK_LINE },
  { id: "gpay", name: "Google Pay", type: "wallet", mockFraudLine: MOCK_LINE },
  { id: "amazonpay", name: "Amazon Pay", type: "wallet", mockFraudLine: MOCK_LINE },
  { id: "mobikwik", name: "MobiKwik", type: "wallet", mockFraudLine: MOCK_LINE },
  { id: "airtelmoney", name: "Airtel Money", type: "wallet", mockFraudLine: MOCK_LINE },
  { id: "visa", name: "Visa card", type: "card_network", mockFraudLine: MOCK_LINE },
  { id: "mastercard", name: "Mastercard", type: "card_network", mockFraudLine: MOCK_LINE },
  { id: "rupay", name: "RuPay card", type: "card_network", mockFraudLine: MOCK_LINE },
];

export const bankById = (id: string | null): Bank | null =>
  id ? (BANKS.find((b) => b.id === id) ?? null) : null;
