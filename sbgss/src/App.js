import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stagiaires from "./pages/Stagiaires";
import AddStagiaire from "./pages/AddStagiaire";
import EditStagiaire from "./pages/EditStagiaire";
import Documents from "./pages/Documents";
import UploadDocument from "./pages/UploadDocument"
import InscriptionStagiaire from "./pages/InscriptionStagiaire";
import VoirStagiaire from "./pages/VoirStagiaire";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inscription" element={<InscriptionStagiaire />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stagiaires" element={<Stagiaires />} />
        <Route path="/add-stagiaire" element={<AddStagiaire />} />
        <Route path="/edit-stagiaire/:id" element={<EditStagiaire />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/upload-document" element={<UploadDocument />} />
        <Route path="/stagiaire/:id" element={<VoirStagiaire />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
