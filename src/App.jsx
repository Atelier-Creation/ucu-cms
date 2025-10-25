import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// import Posts from "./pages/Posts";
// import Users from "./pages/Users";
import AdminLayout from "./layout/AdminLayout";
import "./App.css";
import { Pages } from "./pages/Pages";
import AllPageView from "./pages/NewPage/AllPageView";
import HeroSlidesPage from "./components/HeroSlidesPage";
import HomePageSections from "./components/HomePageSections";
import IndustryIconsPage from "./components/IndustryIconsPage";
import { Toaster } from "./components/ui/toaster";
import AspirantsParentsPage from "./components/AspirantsParentsPage";
import UpcomingEventsPage from "./components/UpcomingEventsPage";
function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pages/home/none" element={<AllPageView />} />
          <Route path="/pages/home" element={<HomePageSections />} />
          <Route path="/pages/home/slider" element={<HeroSlidesPage/>} />
          <Route path="/pages/home/industry" element={<IndustryIconsPage/>} />
          <Route path="/pages/home/Aspirants" element={<AspirantsParentsPage/>} />
          <Route path="/pages/home/UpcomingEvents" element={<UpcomingEventsPage/>} />
          {/* <Route path="/users" element={<Users />} /> */}
        </Routes>
        <Toaster />
      </AdminLayout>
    </Router>
  );
}

export default App;
