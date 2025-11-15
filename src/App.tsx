import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";

import BuildDeckPage from "./pages/BuildDeckPage";
import MyDeckPage from "./pages/MyDeckPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Nav />

      <Routes>
        <Route path="/build" element={<BuildDeckPage />} />
        <Route path="/decks" element={<MyDeckPage />} />
      </Routes>
    </div>
  );
}

export default App;
