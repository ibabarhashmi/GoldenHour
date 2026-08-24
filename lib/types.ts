export type Lang = "en" | "hi";

export type ActionKey = "call1930" | "bank" | "ncrp";
export type ActionStatus = "pending" | "in_progress" | "done" | "skipped";

export interface ScamType {
  id: string;
  label: Record<Lang, string>;
  hint: Record<Lang, string>;
  icon: string;
  ncrpCategory: "Online Financial Fraud";
  ncrpSubCategory: NcrpSubCategory;
  evidence: string[];
  descriptionTemplate: Record<Lang, string>;
}

export type NcrpSubCategory =
  | "Business Email Compromise/Email Takeover"
  | "Debit/Credit Card Fraud/Sim Swap Fraud"
  | "Demat/Depository Fraud"
  | "E-Wallet Related Fraud"
  | "Fraud Call/Vishing"
  | "Internet Banking Related Fraud"
  | "UPI Related Frauds";

export const NCRP_SUB_CATEGORIES = [
  "Business Email Compromise/Email Takeover",
  "Debit/Credit Card Fraud/Sim Swap Fraud",
  "Demat/Depository Fraud",
  "E-Wallet Related Fraud",
  "Fraud Call/Vishing",
  "Internet Banking Related Fraud",
  "UPI Related Frauds",
] as const;

export interface CaseFile {
  id: string;
  createdAt: number;
  fraudAt: number;
  lang: Lang;
  onBehalfOf: "self" | "someone_else";
  scamTypeId: string | null;
  amount: number | null;
  bankId: string | null;
  counterpartyHandle: string | null;
  utr: string | null;
  narrativeSlots: NarrativeSlots;
  description: string | null;
  actions: Record<ActionKey, ActionStatus>;
  acknowledgementNo: string | null;
  filedAt: number | null;
  timeline: TimelineEvent[];
}

export interface NarrativeSlots {
  how: string | null;
  what: string | null;
  approved: string | null;
}

export interface TimelineEvent {
  at: number;
  kind: "created" | "action_done" | "filed" | "escalation_due";
  label: Record<Lang, string>;
}

export interface Bank {
  id: string;
  name: string;
  type: "bank" | "wallet" | "card_network";
  mockFraudLine: string;
}
