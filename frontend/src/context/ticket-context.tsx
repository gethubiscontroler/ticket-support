import { ReactNode, createContext, useReducer } from "react";
import { TicketDataType } from "../components/ticket-list/TicketDataType";

interface TicketContextProps {
  children: ReactNode;
}

interface TicketState {
  tickets: TicketDataType[];
}



interface TicketAction {
  type: string;
  id: string;
}

const TicketList: TicketDataType[] = [];

const initalTicketState: TicketState = {
  tickets: TicketList,
};

const TicketReducer = (state: TicketState, action: TicketAction): TicketState => {
  switch (action.type) {
    case "TOOGLE BOOKMARK":
    //   return {
    //     ...state,
    //     tickets: state.tickets.map((ticket) => {
    //       if (ticket.id === action.id) {
    //         return { ...ticket, isBookmarked: !ticket.isBookmarked };
    //       }
    //       return movie;
    //     }),
    //   };
    default:
      return state;
  }
};

export const TicketContext = createContext<{
  state: TicketState;
  dispatch: React.Dispatch<TicketAction>;
}>({
  state: initalTicketState,
  dispatch: () => { },
});

export const TicketProvider = ({ children }: TicketContextProps) => {
  const [state, dispatch] = useReducer(TicketReducer, initalTicketState);
  return (
    <TicketContext.Provider value={{ state, dispatch }}>
      {children}
    </TicketContext.Provider>
  );
};
