import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Landing from "@/components/landing/Landing";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NewMealPage from "@/pages/NewMealPage";
import MealDetailPage from "@/pages/MealDetailPage";
import RecordsPage from "@/pages/RecordsPage";
import ProfilePage from "@/pages/ProfilePage";

export default function App() {
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
        </Routes>
      </main>
    </>
  );
}
