import { Priority } from "../enum/Priority";
import { TicketStatus } from "../enum/TicketStatus";
import { Team } from "./team";
import { User } from "./user";

export interface Ticket {
  id?: number; // Optional for new tickets
  title: string;
  status: TicketStatus;
  priority: Priority;
  description: string; // Fixed capitalization from Java class
  createdBy: User;
  assignedTeam: Team;
  creationDate: Date; // ISO date string format (YYYY-MM-DD)
}

export interface CreateTicketRequest {
  title: string;
  status: TicketStatus;
  priority: Priority;
  description: string; // Fixed capitalization from Java class
  createdBy: User;
  assignedTeam: Team;
  creationDate: Date; // ISO date string format (YYYY-MM-DD)
}
