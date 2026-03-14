export type Role = "Client" | "Lawyer";

export interface AuthUser {
  user_id: number;
  name: string;
  role: Role;
  access_token: string;
}

export interface CaseTicket {
  id: number;
  client_id: number;
  lawyer_id?: number;
  title: string;
  description: string;
  status: "Pending" | "Accepted" | "Rejected";
  created_at: string;
}
