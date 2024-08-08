import { createRoot } from "react-dom/client";
import App from "./pages/App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const AppWithRouter = () => {
  return (
    <BrowserRouter basename="/money-planning/">
      <App />
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<AppWithRouter />);
}
