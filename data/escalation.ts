import type { Lang } from "../lib/types";

export interface EscalationStep {
  /** days after fraudAt when this step becomes due */
  dayOffset: number;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  /** which action key this step tracks, if any */
  tracks?: "ncrp" | "bank";
}

/**
 * RBI grievance norms give a bank 30 days to resolve; the Ombudsman hears
 * only after that window. RTI to I4C/state cyber cell is the last rung.
 */
export const ESCALATION_LADDER: EscalationStep[] = [
  {
    dayOffset: 0,
    name: { en: "File on NCRP", hi: "NCRP पर शिकायत" },
    desc: {
      en: "Day zero. The acknowledgement number starts every follow-up.",
      hi: "शून्यवें दिन. पावती संख्या से हर फ़ॉलो-अप शुरू होता है.",
    },
    tracks: "ncrp",
  },
  {
    dayOffset: 0,
    name: { en: "Written complaint to your bank", hi: "बैंक को लिखित शिकायत" },
    desc: {
      en: "Same day. A written record starts the bank's response clock.",
      hi: "उसी दिन. लिखित रिकॉर्ड बैंक की जवाबी घड़ी शुरू करता है.",
    },
    tracks: "bank",
  },
  {
    dayOffset: 30,
    name: { en: "Bank must respond", hi: "बैंक को जवाब देना होगा" },
    desc: {
      en: "RBI grievance norms give the bank 30 days to resolve your complaint.",
      hi: "RBI ग्रीवांस नियमों में बैंक को शिकायत सुलझाने को 30 दिन मिलते हैं.",
    },
    tracks: "bank",
  },
  {
    dayOffset: 31,
    name: { en: "Approach the RBI Ombudsman", hi: "RBI ओंबड्समैन के पास जाएँ" },
    desc: {
      en: "Only after day 30 without a satisfactory reply. Free, online, CMS portal.",
      hi: "दिन 30 के बाद ही, संतोषजनक जवाब न मिले. नि:शुल्क, ऑनलाइन, CMS पोर्टल.",
    },
  },
  {
    dayOffset: 45,
    name: { en: "Ask I4C and your state cyber cell", hi: "I4C और राज्य साइबर सेल से पूछें" },
    desc: {
      en: "An RTI asking for your complaint's status keeps it from sleeping in a queue.",
      hi: "अपनी शिकायत की स्थिति पूछने का RTI उसे कतार में सोने से रोकता है.",
    },
    tracks: "ncrp",
  },
];
