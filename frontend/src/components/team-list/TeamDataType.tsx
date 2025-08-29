import { Priority } from "../../enum/Priority";
import { TicketStatus } from "../../enum/TicketStatus";
import { Team } from "../../model/team";
import { User } from "../../model/user";

export interface TeamDataType {
    id: number;
    name: string;
    description?: string;
}