import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { TicketProvider } from "./context/ticket-context";
import "./App.css";

function App() {
  return (
    <TicketProvider>
      <RouterProvider router={router} />
    </TicketProvider>
  );
}

export default App;
