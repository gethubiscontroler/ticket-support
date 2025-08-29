import { ReactNode, createContext, useReducer } from "react";
import { DashboardAction, DashboardState } from "../types/dashboard";


interface DashboardContextProps {
  children: ReactNode;
}

const initialDashboardState: DashboardState = {
  dashboardData: null,
  loading: false,
  error: null,
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        dashboardData: action.payload,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        dashboardData: null,
      };
    case 'RESET':
      return initialDashboardState;
    default:
      return state;
  }
};

export const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}>({
  state: initialDashboardState,
  dispatch: () => {},
});

export const DashboardProvider = ({ children }: DashboardContextProps) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};