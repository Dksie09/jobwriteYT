import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Success from "./components/Success";
import Failure from "./components/Failure";
import Dashboard from "./components/Dashboard";
import AllJobs from "./components/AllJobs";
import Feedback from "./components/Feedback";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/allJobs" element={<AllJobs />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
