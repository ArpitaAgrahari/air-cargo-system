import { UUID } from "crypto";

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}