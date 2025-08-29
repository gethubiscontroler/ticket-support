import { Priority } from "../../enum/Priority";
import { TicketStatus } from "../../enum/TicketStatus";
import { Team } from "../../model/team";
import { User } from "../../model/user";

export interface TicketDataType {
    id?: number; 
    title: string;
    status: TicketStatus;
    priority: Priority;
    creationDate: Date;
    description: string;
    createdBy: User;
    assignedTeam: Team;

}