export interface Mediator {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialization: string;
}

export const MEDIATORS: Mediator[] = [
  { id: 1, name: "Ravi Shankar Gupta", phone: "+91 98765 43210", email: "ravi.gupta@mediator.in", specialization: "Civil Disputes" },
  { id: 2, name: "Neha Patel", phone: "+91 87654 32109", email: "neha.patel@mediator.in", specialization: "Family Mediation" },
  { id: 3, name: "Arun Krishnamurthy", phone: "+91 76543 21098", email: "arun.k@mediator.in", specialization: "Corporate Mediation" },
  { id: 4, name: "Sunita Sharma", phone: "+91 65432 10987", email: "sunita.s@mediator.in", specialization: "Property & Land" },
  { id: 5, name: "Deepak Joshi", phone: "+91 54321 09876", email: "deepak.j@mediator.in", specialization: "Criminal & Labour" },
];

export function getMediatorForCase(caseId: number): Mediator {
  return MEDIATORS[caseId % MEDIATORS.length];
}
