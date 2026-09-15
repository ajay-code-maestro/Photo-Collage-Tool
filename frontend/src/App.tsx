import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/app/page';
import EditorPage from '@/app/editor/page';
import '@/app/globals.css';

export default function App() {
  return (
    <BrowserRouter basename="/Photo-Collage-Tool">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
