import { ReactNode, createContext, useReducer } from "react";
import { UserDataType } from "../components/user-list/UserDataType";

interface UserContextProps {
  children: ReactNode;
}

interface UserState {
  users: UserDataType[];
}



interface UserAction {
  type: string;
  id: string;
}

const UserList: UserDataType[] = [];

const initalUserState: UserState = {
  users: UserList,
};

const TicketReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "TOOGLE BOOKMARK":
    default:
      return state;
  }
};

export const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initalUserState,
  dispatch: () => {},
});

export const UserProvider = ({ children }: UserContextProps) => {
  const [state, dispatch] = useReducer(TicketReducer, initalUserState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
