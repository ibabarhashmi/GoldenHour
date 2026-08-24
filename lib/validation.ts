import { z } from "zod";

/** NCRP rejects special characters; Devanagari is allowed because the app supports Hindi. */
export const DESCRIPTION_REGEX =
  /^[a-zA-Z0-9\s.,\-\u0900-\u097F]+$/;

export const descriptionSchema = z
  .string()
  .min(200)
  .max(2000)
  .regex(DESCRIPTION_REGEX);

export const utrSchema = z
  .string()
  .regex(/^\d{12}$/)
  .nullable()
  .optional();

export const caseInputSchema = z.object({
  description: descriptionSchema,
  fraudAt: z
    .number()
    .int()
    .positive()
    .refine((n) => n <= Date.now(), { message: "future" })
    .refine((n) => n >= Date.now() - 365 * 24 * 60 * 60 * 1000, {
      message: "too_old",
    }),
  amount: z.number().positive().max(1e9).nullable().optional(),
  utr: utrSchema,
});

export const fileComplaintSchema = z.object({
  caseId: z.string().min(3).max(32),
  scamTypeId: z.string().min(1),
  ncrpCategory: z.literal("Online Financial Fraud"),
  ncrpSubCategory: z.string().min(1),
  fraudAt: z.number().int().positive(),
  amount: z.number().positive().max(1e9),
  utr: utrSchema,
  handle: z.string().max(120).nullable().optional(),
  suspectName: z.string().max(120).nullable().optional(),
  description: descriptionSchema,
  complainantName: z.string().min(2).max(120),
  complainantMobile: z.string().regex(/^\d{10}$/),
  complainantEmail: z.string().email(),
  onBehalfOf: z.enum(["self", "someone_else"]),
  declarationAccepted: z.literal(true),
});

export const draftRequestSchema = z.object({
  how: z.string().nullable(),
  what: z.string().nullable(),
  approved: z.string().nullable(),
  amount: z.number().positive().max(1e9).nullable().optional(),
  bank: z.string().nullable().optional(),
  utr: utrSchema,
  handle: z.string().max(120).nullable().optional(),
  fraudAt: z.number().int().positive(),
  lang: z.enum(["en", "hi"]),
});

export const classifyRequestSchema = z.object({
  text: z.string().min(3).max(1000),
  lang: z.enum(["en", "hi"]).default("en"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export function formatError(
  code: string,
  message: string,
  field?: string,
): { error: { code: string; message: string; field?: string } } {
  return { error: { code, message, ...(field ? { field } : {}) } };
}
