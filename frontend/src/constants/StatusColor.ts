import { TicketStatus } from "../enum/TicketStatus";

export const getStatusColor = (status: TicketStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
        case TicketStatus.OPEN:
            return "info";
        case TicketStatus.IN_PROGRESS:
            return "warning";
        case TicketStatus.RESOLU:
            return "success";
        case TicketStatus.CLOSED:
            return "default";
        default:
            return "default";
    }
};