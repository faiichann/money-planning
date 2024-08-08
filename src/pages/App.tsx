import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Emergency from "./Emergency";
import Retirement from "./Retirement";

const App = () => {
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
