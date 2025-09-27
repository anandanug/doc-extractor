import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ExtractionResultPage from "./pages/ExtractionResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman utama → Upload */}
        <Route path="/" element={<UploadPage />} />

        {/* Halaman hasil ekstraksi */}
        <Route path="/result" element={<ExtractionResultPage />} />

        {/* kalau nanti ada dashboard atau settings bisa tambahkan di sini */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}