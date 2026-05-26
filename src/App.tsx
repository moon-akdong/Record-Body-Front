import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Landing from "@/components/landing/Landing";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NewMealPage from "@/pages/NewMealPage";
import MealDetailPage from "@/pages/MealDetailPage";
import RecordsPage from "@/pages/RecordsPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import BodyEditPage from "@/pages/BodyEditPage";
import TdeePage from "@/pages/TdeePage";
import { usePageTracking } from "@/hooks/usePageTracking";

export default function App() {
  usePageTracking();

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/meals/new" element={<NewMealPage />} />
          <Route path="/meals/:id" element={<MealDetailPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/body" element={<BodyEditPage />} />
          <Route path="/tdee" element={<TdeePage />} />
        </Routes>
      </main>
    </>
  );
}
