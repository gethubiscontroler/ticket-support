import { Priority } from "../enum/Priority";

export const getPriorityColor = (priority: Priority): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (priority) {
        case Priority.LOW:
            return "success";
        case Priority.MEDIUM:
            return "warning";
        case Priority.URGENT:
            return "error";
        case Priority.CRITICAL:
            return "error";
        default:
            return "default";
    }
};
