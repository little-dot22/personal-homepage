import { HashRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ParticleField from "./components/ParticleField";
import { NavProvider } from "./context/NavContext";
import FishTank from "./pages/FishTank";
import Home from "./pages/Home";
import Memories from "./pages/Memories";
import Uselessness from "./pages/Uselessness";

export default function App() {
  return (
    <HashRouter>
      <NavProvider>
        <ParticleField />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/uselessness" element={<Uselessness />} />
          <Route path="/fishtank" element={<FishTank />} />
        </Routes>
      </NavProvider>
    </HashRouter>
  );
}
