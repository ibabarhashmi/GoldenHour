import type { Lang } from "../lib/types";

export const EVIDENCE_ITEMS: Record<
  string,
  { label: Record<Lang, string> }
> = {
  sms_screenshot: {
    label: {
      en: "Screenshot of the debit SMS from your bank",
      hi: "बैंक के कटौती SMS का स्क्रीनशॉट",
    },
  },
  bank_statement: {
    label: {
      en: "Bank statement line showing the transaction",
      hi: "लेन-देन दिखाने वाला बैंक स्टेटमेंट",
    },
  },
  upi_txn_detail: {
    label: {
      en: "Transaction detail screen from your UPI app",
      hi: "UPI ऐप की लेन-देन विवरण स्क्रीन",
    },
  },
  caller_number: {
    label: {
      en: "The number that called you (from call log)",
      hi: "कॉल करने वाला नंबर (कॉल लॉग से)",
    },
  },
  email_headers: {
    label: {
      en: "Suspicious emails — keep them, don't delete",
      hi: "संदिग्ध ईमेल — मिटाएँ नहीं, सहेजें",
    },
  },
  app_link: {
    label: {
      en: "Link or APK source of the app they made you install",
      hi: "जो ऐप बनवाई गई उसका लिंक या स्रोत",
    },
  },
  chat: {
    label: {
      en: "Chat screenshots (WhatsApp/SMS) with the other party",
      hi: "दूसरे पक्ष से चैट के स्क्रीनशॉट (WhatsApp/SMS)",
    },
  },
  payment_proof: {
    label: {
      en: "Payment confirmation screenshots or receipts",
      hi: "भुगतान पुष्टि के स्क्रीनशॉट या रसीदें",
    },
  },
  card_statement: {
    label: {
      en: "Card statement entry for the charge you didn't make",
      hi: "बिना आपके हुए कार्ड खर्च की स्टेटमेंट प्रविष्टि",
    },
  },
  operator_complaint: {
    label: {
      en: "Complaint/reference given to your mobile operator about the SIM",
      hi: "SIM के लिए ऑपरेटर को दी गई शिकायत/पावती",
    },
  },
};
