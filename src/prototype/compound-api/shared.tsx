export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
};

export const USERS: User[] = [
  { id: 1, name: "Sinta Prabowo", email: "sinta@acme.id", role: "Admin", status: "active" },
  { id: 2, name: "Bagas Nugroho", email: "bagas@acme.id", role: "Billing", status: "active" },
  { id: 3, name: "Maya Chen", email: "maya@acme.id", role: "Support", status: "invited" },
  { id: 4, name: "Rizky Amar", email: "rizky@acme.id", role: "Viewer", status: "suspended" },
  { id: 5, name: "Dewi Lestari", email: "dewi@acme.id", role: "Editor", status: "active" },
  { id: 6, name: "Andi Wijaya", email: "andi@acme.id", role: "Editor", status: "active" },
];

export const ROLES = ["Admin", "Billing", "Support", "Editor", "Viewer"];
