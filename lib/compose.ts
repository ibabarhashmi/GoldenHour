import type { Lang } from "./types.ts";
import { formatDate, formatTime } from "./clock.ts";

export interface ComposeInput {
  how: string | null;
  what: string | null;
  approved: string | null;
  amount?: number | null;
  bank?: string | null;
  utr?: string | null;
  handle?: string | null;
  fraudAt: number;
  lang: Lang;
}

export function formatRs(amount: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    amount,
  );
}

// Slot vocabularies — ids are stored in the case, labels are rendered per language.
export const HOW_OPTIONS: Record<string, Record<Lang, string>> = {
  clicked_link: {
    en: "I clicked a link sent to me and entered my details on the page it opened",
    hi: "मुझे भेजे गए एक लिंक को खोलकर मैंने उस पृष्ठ पर अपनी जानकारी भरी",
  },
  shared_otp: {
    en: "I shared an OTP or PIN with a person who had called me",
    hi: "मुझे कॉल करने वाले व्यक्ति को OTP या PIN साझा किया",
  },
  call_impersonation: {
    en: "a caller claiming to be a bank official persuaded me to approve a request",
    hi: "बैंक अधिकारी बताकर कॉल करने वाले व्यक्ति ने मुझसे एक अनुरोध स्वीकार करवा लिया",
  },
  used_app: {
    en: "I installed an app shown to me and allowed access to my device",
    hi: "मुझे दिखाई गई एक ऐप स्थापित कर मैंने डिवाइस की अनुमति दे दी",
  },
  qr_request: {
    en: "I scanned a QR code or accepted a collect request believing it was for receiving money",
    hi: "पैसे मिलने की धारणा से मैंने QR कोड स्कैन किया या कलेक्ट अनुरोध स्वीकार किया",
  },
};

export const WHAT_OPTIONS: Record<string, Record<Lang, string>> = {
  money_debited: { en: "Money was debited", hi: "मेरे खाते से राशि कटी" },
  card_used: {
    en: "My card was used",
    hi: "मेरे कार्ड का उपयोग हुआ",
  },
  account_emptied: {
    en: "Account emptied",
    hi: "मेरा खाता खाली हो गया",
  },
};

/**
 * Detail clauses appended to the transaction sentence. Empty string for
 * money_debited — "unauthorised transaction" already says it.
 */
const WHAT_CLAUSE: Record<string, Record<Lang, string>> = {
  money_debited: { en: "", hi: "" },
  card_used: {
    en: ", using my card without my knowledge",
    hi: ", जिसमें मेरे कार्ड का उपयोग मेरी जानकारी के बिना किया गया",
  },
  account_emptied: {
    en: ", and multiple such transactions emptied my account",
    hi: ", और ऐसे कई लेन-देन से मेरा खाता खाली हो गया",
  },
};

export const APPROVAL_OPTIONS: Record<string, Record<Lang, string>> = {
  not_approved: {
    en: "I did not approve this transaction at any point.",
    hi: "मैंने इस लेन-देन को कभी स्वीकृत नहीं किया.",
  },
  tricked_approve: {
    en: "I was deceived into approving this transaction myself.",
    hi: "मुझे धोखे से यह लेन-देन स्वयं स्वीकार करवाया गया.",
  },
};

const FALLBACK_OPEN: Record<Lang, string> = {
  en: "money was transferred out of my account without my authorisation",
  hi: "मेरे खाते से मेरी स्वीकृति के बिना राशि निकाल ली गई",
};

function descTime(input: ComposeInput): string {
  // The portal rejects special characters; colons are not allowed, so
  // "10:15 pm" becomes "10.15 pm" inside the description text only.
  return formatTime(input.fraudAt, input.lang).replace(/:/g, ".");
}

/**
 * User-supplied identifiers (UPI ids, emails, phone numbers) arrive with
 * characters the portal rejects. "@ybl" reads as " at ybl"; anything still
 * outside the allowed charset is dropped rather than risking rejection.
 */
export function sanitizeHandle(handle: string): string {
  const spaced = handle.trim().replace(/\s*@\s*/g, " at ");
  return spaced.replace(/[^a-zA-Z0-9\s.,\-\u0900-\u097F]/g, "").trim();
}

function buildParts(input: ComposeInput): string[] {
  const lang = input.lang;
  const date = formatDate(input.fraudAt, lang);
  const time = descTime(input);
  const bank = input.bank || (lang === "en" ? "bank" : "बैंक");
  const how = (input.how && HOW_OPTIONS[input.how]?.[lang]) || "";
  const clause = (input.what && WHAT_CLAUSE[input.what]?.[lang]) || "";
  const approved =
    (input.approved && APPROVAL_OPTIONS[input.approved]?.[lang]) || "";
  const handle = input.handle ? sanitizeHandle(input.handle) : "";

  const parts: string[] = [];

  if (lang === "en") {
    parts.push(
      `On ${date} at ${time}, ${how || FALLBACK_OPEN.en}.`,
    );
    if (input.amount != null)
      parts.push(
        ` Following this, an unauthorised transaction of Rs ${formatRs(input.amount)} was made on my ${bank} account${clause}.`,
      );
    else
      parts.push(
        ` Following this, unauthorised transactions were made on my ${bank} account${clause}.`,
      );
    if (input.utr)
      parts.push(
        ` The transaction reference number is ${input.utr.replace(/[^a-zA-Z0-9\-]/g, "")}.`,
      );
    if (handle)
      parts.push(` The identifier of the other party is ${handle}.`);
    parts.push(
      ` I did not knowingly authorise this transfer and I reported it to the 1930 helpline and to my bank immediately.`,
    );
    parts.push(
      ` I request that the beneficiary account be put on hold and the amount be restored to my account.`,
    );
  } else {
    parts.push(`${date} को ${time} बजे, ${how || FALLBACK_OPEN.hi}.`);
    if (input.amount != null)
      parts.push(
        ` इसके बाद, मेरे ${bank} खाते से Rs ${formatRs(input.amount)} का अनधिकृत लेन-देन हुआ${clause}.`,
      );
    else
      parts.push(
        ` इसके बाद, मेरे ${bank} खाते से अनधिकृत लेन-देन किए गए${clause}.`,
      );
    if (input.utr) parts.push(` लेन-देन संदर्भ संख्या ${input.utr} है.`);
    if (handle) parts.push(` दूसरे पक्ष का पहचान विवरण ${handle} है.`);
    parts.push(
      ` मैंने इस भुगतान को जानबूझकर अधिकृत नहीं किया और मैंने तुरंत 1930 हेल्पलाइन और अपने बैंक को सूचित किया.`,
    );
    parts.push(
      ` अनुरोध है कि लाभार्थी खाते को रोक दिया जाए और राशि मेरे खाते में वापस कर दी जाए.`,
    );
  }

  if (approved) return [...parts.slice(0, -2), ` ${approved}`, ...parts.slice(-2)];
  return parts;
}

export function composeDescription(input: ComposeInput): string {
  return buildParts(input).join("").replace(/\s+/g, " ").trim();
}
