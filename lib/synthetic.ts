// Verhoeff — the checksum UIDAI uses. We generate ONLY numbers that FAIL it.
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function verhoeffValid(num: string): boolean {
  if (!num || !/^\d+$/.test(num)) return false;
  let c = 0;
  const rev = num.split("").reverse();
  for (let i = 0; i < rev.length; i++) {
    c = d[c][p[i % 8][Number(rev[i])]];
  }
  return c === 0;
}

/** Aadhaar-SHAPED but provably invalid: starts with 0 (UIDAI never issues 0/1
 *  as the first digit) AND fails Verhoeff. Double-locked. */
export function fakeAadhaar(): string {
  for (;;) {
    const n =
      "0" +
      Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join("");
    if (!verhoeffValid(n)) return n;
  }
}

/** PAN-shaped, reserved 4th char 'Z' + implausible pattern. Never a real PAN. */
export const fakePan = () => "ZZZZZ0000Z";

/** 12-digit UTR-shaped, always prefixed 0000 which real UTRs don't use. */
export const fakeUtr = () =>
  "0000" + String(Math.floor(Math.random() * 1e8)).padStart(8, "0");

/** NCRP acknowledgement numbers are 14 digits. Ours always start '99' as a tell. */
export const mockAckNo = () =>
  "99" + String(Math.floor(Math.random() * 1e12)).padStart(12, "0");

/** Case ids are not government numbers; GH prefix keeps them obviously ours. */
export const mockCaseId = () =>
  "GH-" +
  Array.from({ length: 8 }, () =>
    "ABCDEFGHJKMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 31)),
  ).join("");
