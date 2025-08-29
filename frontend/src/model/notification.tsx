import { NotificationType } from "../enum/NotificationType";
import { User } from "./user";

export interface Notification {
  id?: number; // Optional for new tickets
  message: string;
  type: NotificationType;
  readed: string; 
  recipient: User;
  dateSent: Date; // ISO date string format (YYYY-MM-DD)
}
