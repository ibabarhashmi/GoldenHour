import type { Bank, UniversalNumber } from "../lib/types";

/**
 * VERIFIED CONTACT DATA — every number/email below was transcribed from the
 * institution page in `sourceUrl` (Aug 2026). Re-verify against the source
 * pages before any production release; banks do rotate helpline numbers.
 * The few entries flagged in `note` as aggregator-cited could not be checked
 * verbatim on an official page and are labelled so in the UI.
 */
export const BANKS: Bank[] = [
  {
    id: "sbi",
    name: "State Bank of India",
    type: "bank",
    fraudLines: ["1800 11 1109"],
    generalLines: ["1800 1234", "1800 2100", "1800 11 2211", "1800 425 3800"],
    emails: [
      "unauthorisedtransaction@sbi.co.in",
      "customercare@sbi.co.in",
      "contactcentre@sbi.co.in",
    ],
    sourceUrl: "https://sbi.bank.in/web/customer-care/contact-us",
    note: {
      en: "You can also forward the transaction SMS to 9223008333.",
      hi: "लेन-देन का SMS 9223008333 पर फॉरवर्ड भी कर सकते हैं.",
    },
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    type: "bank",
    fraudLines: ["1800 258 6161"],
    generalLines: ["1800 1600", "1800 2600"],
    emails: ["report.phishingsite@hdfcbank.com"],
    sourceUrl:
      "https://www.hdfcbank.com/personal/need-help/report-unauthorized-transactions",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    type: "bank",
    fraudLines: ["1800 1080", "1800 2662"],
    generalLines: ["1800 1080"],
    emails: ["antiphishing@icicibank.com", "customer.care@icicibank.com"],
    sourceUrl:
      "https://www.icici.bank.in/personal-banking/help/online-safe-banking/report-unauthorized-transaction",
  },
  {
    id: "axis",
    name: "Axis Bank",
    type: "bank",
    fraudLines: ["1860 419 5555", "1860 500 5555"],
    generalLines: ["1860 419 5555", "1860 500 5555"],
    emails: ["email.services@axisbank.com"],
    sourceUrl: "https://www.axisbank.com/fraud-awareness/phishing-alert",
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    type: "bank",
    fraudLines: ["1800 209 0000"],
    generalLines: ["1860 266 2666", "1800 4100"],
    emails: ["itsecurity.bank@kotak.com"],
    sourceUrl: "https://kapps.kotak.com/FraudPreLogin",
    note: {
      en: "Phone numbers official-confirmed. The email is cited from aggregators only.",
      hi: "फ़ोन नंबर आधिकारिक स्रोत से. ईमेल केवल एग्रीगेटर से उद्धृत है.",
    },
  },
  {
    id: "pnb",
    name: "Punjab National Bank",
    type: "bank",
    fraudLines: ["1800 1800", "1800 2021"],
    generalLines: ["1800 180 2222", "1800 103 2222"],
    emails: ["care@pnb.co.in"],
    sourceUrl: "https://cgrms.pnb.bank.in/digi_cgrms/",
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    type: "bank",
    fraudLines: ["1800 5700", "1800 5000", "1800 258 44 55", "1800 102 44 55"],
    generalLines: ["1800 258 44 55", "1800 102 44 55"],
    emails: [
      "channelblock@bankofbaroda.bank.in",
      "cs.ho@bankofbaroda.bank.in",
    ],
    sourceUrl: "https://bankofbaroda.bank.in/contact-us",
  },
  {
    id: "canara",
    name: "Canara Bank",
    type: "bank",
    fraudLines: ["1800 1030"],
    generalLines: ["1800 1030"],
    emails: ["reportphishing@canarabank.com", "reportfraud@canarabank.com"],
    sourceUrl: "https://canarabank.com/pages/report-email-frauds-and-phishing",
  },
  {
    id: "union",
    name: "Union Bank of India",
    type: "bank",
    fraudLines: ["1800 2222 43", "1800 8332"],
    generalLines: ["1800 2333", "1800 22 22 44"],
    emails: ["cyber.incidents@unionbankofindia.bank"],
    sourceUrl: "https://www.unionbankofindia.bank.in/en/common/grievance-redressal",
  },
  {
    id: "idbi",
    name: "IDBI Bank",
    type: "bank",
    fraudLines: ["1800 425 7600"],
    generalLines: ["1800 209 4324", "1800 22 1070"],
    emails: ["idbicards@idbi.co.in", "customercare@idbi.co.in"],
    sourceUrl: "https://unauthorisedtran.idbibank.com/",
  },
  {
    id: "idfc",
    name: "IDFC FIRST Bank",
    type: "bank",
    fraudLines: ["1800 10 888"],
    generalLines: ["1800 10 888"],
    emails: ["banker@idfcfirstbank.com"],
    sourceUrl:
      "https://www.idfcfirst.bank.in/support/report-an-unauthorised-transaction",
  },
  {
    id: "yes",
    name: "Yes Bank",
    type: "bank",
    fraudLines: ["1800 1200", "1800 103 1212"],
    generalLines: ["1800 1200", "1860 210 1200"],
    emails: ["yestouchcc@yes.bank.in"],
    sourceUrl: "https://www.yes.bank.in/steps-to-report-an-unauthorized-transaction",
    note: {
      en: "Block a credit card by texting BLKCC + last 4 digits to 9840909000. Number sourced via aggregators.",
      hi: "क्रेडिट कार्ड ब्लॉक करने के लिए BLKCC + अंतिम 4 अंक 9840909000 पर भेजें. नंबर एग्रीगेटर से स्रोत.",
    },
  },
  {
    id: "indusind",
    name: "IndusInd Bank",
    type: "bank",
    fraudLines: ["1860 267 7777"],
    generalLines: ["1860 267 7777"],
    emails: [],
    sourceUrl:
      "https://www.indusind.bank.in/in/en/personal/customer-limited-liability.html",
  },
  {
    id: "federal",
    name: "Federal Bank",
    type: "bank",
    fraudLines: ["1800 425 1199", "1800 420 1199", "1860 419 1199"],
    generalLines: ["1800 425 1199", "1800 420 1199"],
    emails: ["ehelp@federalbank.co.in"],
    sourceUrl: "https://www.federal.bank.in/contact-center",
    note: {
      en: "Numbers official-confirmed; the email is aggregator-cited.",
      hi: "नंबर आधिकारिक स्रोत से; ईमेल एग्रीगेटर से उद्धृत.",
    },
  },
  {
    id: "au",
    name: "AU Small Finance Bank",
    type: "bank",
    fraudLines: ["1800 1200 1200", "1800 26 66677"],
    generalLines: ["1800 1200 1200", "1800 26 66677"],
    emails: ["customercare@aubank.in"],
    sourceUrl: "https://www.au.bank.in/report-unauthorised-transactions",
  },
  {
    id: "bandhan",
    name: "Bandhan Bank",
    type: "bank",
    fraudLines: ["1800 258 8181"],
    generalLines: ["033 6633 3333"],
    emails: ["customercare@bandhanbank.com"],
    sourceUrl: "https://bandhan.bank.in/fraud-awareness",
  },
  {
    id: "iob",
    name: "Indian Overseas Bank",
    type: "bank",
    fraudLines: ["1800 425 4445", "1800 890 4445", "044 2858 4890"],
    generalLines: ["1800 425 4445", "1800 890 4445"],
    emails: ["cybercell@iob.in"],
    sourceUrl: "https://www.iob.bank.in/en/grievances-redressal-mechanism",
  },
  {
    id: "cbi",
    name: "Central Bank of India",
    type: "bank",
    fraudLines: ["1800 3030"],
    generalLines: ["1800 22 1911"],
    emails: ["customercare@cboi.bank.in"],
    sourceUrl: "https://centralbank.bank.in/en/contact-us",
  },
  {
    id: "paytm",
    name: "Paytm Payments Bank",
    type: "wallet",
    fraudLines: ["1800 120 130"],
    generalLines: ["0120 4456 456"],
    emails: ["reportfraud@paytmbank.com", "cybercell@paytm.com"],
    sourceUrl: "https://www.paytm.bank.in/report-a-fraud",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    type: "wallet",
    fraudLines: ["080 6872 7374", "022 6872 7374"],
    generalLines: ["080 6872 7374", "022 6872 7374", "080 6112 3123", "022 6112 3123"],
    emails: ["grievances@phonepe.com"],
    sourceUrl: "https://www.phonepe.com/grievance-policy/",
    note: {
      en: "Fastest route is in-app: Help → Report a Problem, or grievance.phonepe.com.",
      hi: "सबसे तेज़ तरीका ऐप में: Help → Report a Problem, या grievance.phonepe.com.",
    },
  },
  {
    id: "gpay",
    name: "Google Pay India",
    type: "wallet",
    fraudLines: ["1800 419 0157"],
    generalLines: ["1800 419 0157"],
    emails: ["support-in@google.com"],
    sourceUrl: "https://support.google.com/pay/india/answer/7562363",
  },
  {
    id: "amazonpay",
    name: "Amazon Pay India",
    type: "wallet",
    fraudLines: ["1800 1200 1637"],
    generalLines: ["1800 1200 1571"],
    emails: ["reportascam@amazon.com"],
    sourceUrl:
      "https://www.amazon.in/gp/help/customer/display.html?nodeId=G2WRTQ8PRZKGHTB4",
  },
  {
    id: "mobikwik",
    name: "MobiKwik",
    type: "wallet",
    fraudLines: ["080 6980 8320"],
    generalLines: ["080 6980 8320"],
    emails: ["fraudalerts@mobikwik.com", "grievance@mobikwik.com"],
    sourceUrl:
      "https://promotions.mobikwik.com/inapp/terms-and-conditions/mobikwik-tnc/policy/grievance-policy.html",
  },
  {
    id: "airtelmoney",
    name: "Airtel Payments Bank",
    type: "wallet",
    fraudLines: ["1800 203 3330"],
    generalLines: ["1800 23400"],
    emails: ["fraud.reporting@airtelbank.com", "wecare@airtelbank.com"],
    sourceUrl: "https://www.airtelpayments.bank.in/static/contact-us",
  },
  {
    id: "visa",
    name: "Visa (cardholder assistance)",
    type: "card_network",
    fraudLines: ["000 800 100 1219"],
    generalLines: ["+1 303 967 1096 (intl collect)"],
    emails: ["askvisa@visa.com"],
    sourceUrl: "https://www.visa.co.in/support.html",
    note: {
      en: "Account disputes still route through your issuing bank.",
      hi: "खाता विवाद आपके कार्ड जारीकर्ता बैंक से होकर ही जाएँगे.",
    },
  },
  {
    id: "mastercard",
    name: "Mastercard (cardholder assistance)",
    type: "card_network",
    fraudLines: ["000 800 100 1087"],
    generalLines: ["+1 636 722 7111 (intl collect)"],
    emails: [],
    sourceUrl:
      "https://www.mastercard.com/in/en/personal/get-support/global-services.html",
    note: {
      en: "24×7 global service for lost/stolen cards; disputes go through your bank.",
      hi: "खोए/चोरी हुए कार्ड हेतु 24×7 ग्लोबल सेवा; विवाद बैंक से होकर जाएँगे.",
    },
  },
  {
    id: "rupay",
    name: "RuPay / NPCI",
    type: "card_network",
    fraudLines: ["1800 120 1740"],
    generalLines: ["1800 120 1740"],
    emails: ["upihelp@npci.org.in"],
    sourceUrl: "https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism",
    note: {
      en: "RuPay card disputes route through your issuing bank; UPI disputes at upihelp.npci.org.in.",
      hi: "RuPay कार्ड विवाद अपने बैंक से; UPI विवाद upihelp.npci.org.in पर.",
    },
  },
];

/**
 * Government / universal reference lines shown under the bank picker.
 * Chakshu deliberately notes it does NOT handle money already lost.
 */
export const UNIVERSAL_NUMBERS: UniversalNumber[] = [
  {
    id: "1930",
    name: { en: "National Cyber Crime Helpline", hi: "राष्ट्रीय साइबर अपराध हेल्पलाइन" },
    detail: { en: "24×7 · cybercrime.gov.in", hi: "24×7 · cybercrime.gov.in" },
    lines: ["1930"],
    url: "https://cybercrime.gov.in/",
  },
  {
    id: "rbi",
    name: { en: "RBI Integrated Ombudsman", hi: "RBI इंटीग्रेटेड ऑम्बड्समैन" },
    detail: {
      en: "Working days 9:30 AM–5:15 PM · cms.rbi.org.in",
      hi: "कार्य दिवस 9:30–17:15 · cms.rbi.org.in",
    },
    lines: ["14448"],
    url: "https://cms.rbi.org.in",
  },
  {
    id: "npci-upi",
    name: { en: "NPCI UPI complaints", hi: "NPCI UPI शिकायतें" },
    detail: { en: "upihelp.npci.org.in", hi: "upihelp.npci.org.in" },
    lines: ["1800 120 1740"],
    url: "https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism",
  },
  {
    id: "chakshu",
    name: { en: "Sanchar Saathi / Chakshu (DoT)", hi: "संचार साथी / चक्षु (DoT)" },
    detail: {
      en: "Fraud calls/SMS only — not for money already lost (use 1930)",
      hi: "केवल धोखाधड़ी कॉल/SMS — खोई राशि हेतु नहीं (1930 डायल करें)",
    },
    lines: ["1963", "1800 110 420", "1909"],
    url: "https://sancharsaathi.gov.in/sfc/",
  },
  {
    id: "112",
    name: { en: "National Emergency", hi: "राष्ट्रीय आपातकाल" },
    detail: { en: "Police · pan-India ERSS", hi: "पुलिस · पूरे भारत ERSS" },
    lines: ["112"],
    url: "https://112.gov.in",
  },
];

export const bankById = (id: string | null): Bank | null =>
  id ? (BANKS.find((b) => b.id === id) ?? null) : null;
