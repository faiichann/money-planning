import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Emergency from "./Emergency";
import Retirement from "./Retirement";
import { useEffect } from "react";
import ReactGA from "react-ga";

const App = () => {
  useEffect(() => {
    ReactGA.initialize("G-NJQ56ZH3SD");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/retirement" element={<Retirement />} />
      </Routes>
    </div>
  );
};

export default App;
