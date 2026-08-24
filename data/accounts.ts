export interface DemoAccount {
  email: string;
  password: string;
  role: string;
}

/** Mock accounts — printed on /login and in the README. Nothing is stored. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "judge@demo.in", password: process.env.GH_DEMO_PASSWORD ?? "demo1234", role: "judge" },
  { email: "partner@demo.in", password: process.env.GH_DEMO_PASSWORD ?? "demo1234", role: "partner" },
  { email: "victim@demo.in", password: process.env.GH_DEMO_PASSWORD ?? "demo1234", role: "victim" },
];
