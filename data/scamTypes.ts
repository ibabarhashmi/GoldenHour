import type { ScamType } from "../lib/types";

/**
 * The mapping below IS the product's domain knowledge: plain-language labels
 * map onto NCRP's real seven financial-fraud sub-categories. TypeScript
 * enforces that ncrpSubCategory is exactly one of the real strings.
 */
export const SCAM_TYPES: ScamType[] = [
  {
    id: "upi_fraud",
    label: {
      en: "Money left my account after a UPI request",
      hi: "UPI अनुरोध के बाद मेरे खाते से पैसा निकल गया",
    },
    hint: {
      en: "A collect request, QR scan or screen that looked like 'receiving money'.",
      hi: "कलेक्ट अनुरोध, QR स्कैन या 'पैसा मिल रहा है' जैसी दिखने वाली स्क्रीन.",
    },
    icon: "upi",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "UPI Related Frauds",
    evidence: ["upi_txn_detail", "sms_screenshot", "bank_statement", "chat"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, I approved a UPI collect request believing money was coming in.",
      hi: "{{date}} को {{time}} बजे, पैसा आने की धारणा से मैंने UPI अनुरोध स्वीकार किया.",
    },
  },
  {
    id: "otp_vishing",
    label: {
      en: "I shared an OTP with someone who called",
      hi: "कॉल करने वाले को मैंने OTP बता दिया",
    },
    hint: {
      en: "A caller posing as your bank, a delivery service or a government office.",
      hi: "बैंक, डिलीवरी या सरकारी दफ्तर बनकर कॉल करने वाला.",
    },
    icon: "call",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "Fraud Call/Vishing",
    evidence: ["caller_number", "sms_screenshot", "bank_statement"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, a caller asked for an OTP and money moved soon after.",
      hi: "{{date}} को {{time}} बजे, कॉल पर OTP माँगा गया और तुरंत बाद पैसा निकल गया.",
    },
  },
  {
    id: "card_fraud",
    label: {
      en: "My card was used without me",
      hi: "मेरे कार्ड का इस्तेमाल मेरे बिना हुआ",
    },
    hint: {
      en: "Debits you don't recognise; card never left your hand.",
      hi: "अनजान कटौतियाँ; कार्ड आपके पास ही था.",
    },
    icon: "card",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "Debit/Credit Card Fraud/Sim Swap Fraud",
    evidence: ["bank_statement", "sms_screenshot", "card_statement"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, my card was charged without any purchase by me.",
      hi: "{{date}} को {{time}} बजे, मेरे कोई खर्च बिना कार्ड से राशि कटी.",
    },
  },
  {
    id: "sim_swap",
    label: {
      en: "My phone number stopped working, then money went",
      hi: "मेरा नंबर अचानक बंद हुआ, फिर पैसा गया",
    },
    hint: {
      en: "No network for hours, then bank SMS arrives on a phone that isn't yours.",
      hi: "घंटों नेटवर्क गायब, फिर बैंक SMS किसी और फ़ोन पर.",
    },
    icon: "sim",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "Debit/Credit Card Fraud/Sim Swap Fraud",
    evidence: ["operator_complaint", "bank_statement", "sms_screenshot"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, my SIM stopped working without my request and transactions followed.",
      hi: "{{date}} को {{time}} बजे, बिना मेरे अनुरोध मेरा SIM बंद हुआ और उसके बाद लेन-देन हुए.",
    },
  },
  {
    id: "investment_app",
    label: {
      en: "I paid into a trading app and can't withdraw",
      hi: "ट्रेडिंग ऐप में डाला पैसा वापस नहीं मिल रहा",
    },
    hint: {
      en: "Profits shown on screen grow fast; withdrawal needs one more fee.",
      hi: "स्क्रीन पर मुनाफ़ा तेज़ी से बढ़ता है; निकासी के लिए एक और शुल्क.",
    },
    icon: "chart",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "Demat/Depository Fraud",
    evidence: ["app_link", "chat", "payment_proof", "bank_statement"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, I transferred amounts to an investment app that now blocks withdrawal.",
      hi: "{{date}} को {{time}} बजे, मैंने निवेश ऐप में राशि भेजी जो अब निकासी रोके है.",
    },
  },
  {
    id: "email_takeover",
    label: {
      en: "Someone took over my email and money moved",
      hi: "मेरा ईमेल किसी और ने कब्ज़ाया और पैसा गया",
    },
    hint: {
      en: "Password changed without you; recovery mails you never asked for.",
      hi: "बिना आपके पासवर्ड बदला; अनचाहे रिकवरी ईमेल.",
    },
    icon: "mail",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "Business Email Compromise/Email Takeover",
    evidence: ["email_headers", "bank_statement", "payment_proof"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, my email account was taken over and payments were redirected.",
      hi: "{{date}} को {{time}} बजे, मेरा ईमेल खाता कब्ज़ाया गया और भुगतान बदले गए.",
    },
  },
  {
    id: "wallet_fraud",
    label: {
      en: "Money went from my wallet app",
      hi: "मेरे वॉलेट ऐप से पैसा गया",
    },
    hint: {
      en: "Paytm, PhonePe, Amazon Pay or similar — debits you didn't make.",
      hi: "Paytm, PhonePe, Amazon Pay जैसे ऐप — आपकी बिना कटौतियाँ.",
    },
    icon: "wallet",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "E-Wallet Related Fraud",
    evidence: ["upi_txn_detail", "sms_screenshot", "bank_statement"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, my wallet balance was spent without my authorisation.",
      hi: "{{date}} को {{time}} बजे, मेरी स्वीकृति के बिना वॉलेट की राशि खर्च हुई.",
    },
  },
  {
    id: "netbanking",
    label: {
      en: "Someone logged into my net banking",
      hi: "किसी ने मेरे नेट बैंकिंग में प्रवेश किया",
    },
    hint: {
      en: "Login alerts from devices you don't own, then transfers.",
      hi: "अनजान डिवाइस के लॉगिन अलर्ट, फिर ट्रांसफ़र.",
    },
    icon: "laptop",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "Internet Banking Related Fraud",
    evidence: ["bank_statement", "email_headers", "sms_screenshot"],
    descriptionTemplate: {
      en: "On {{date}} at {{time}}, my net banking access was misused to transfer funds.",
      hi: "{{date}} को {{time}} बजे, मेरे नेट बैंकिंग का उपयोग कर राशि भेजी गई.",
    },
  },
];

export const scamTypeById = (id: string | null): ScamType | null =>
  id ? (SCAM_TYPES.find((s) => s.id === id) ?? null) : null;
