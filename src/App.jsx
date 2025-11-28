import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// import Posts from "./pages/Posts";
// import Users from "./pages/Users";
import AdminLayout from "./layout/AdminLayout";
import "./App.css";
import { Pages } from "./pages/Pages";
import AllPageView from "./pages/AllPageView";
import HeroSlidesPage from "./pages/HeroSlidesPage";
import HomePageSections from "./pages/HomePageSections";
import IndustryIconsPage from "./pages/IndustryIconsPage";
import { Toaster } from "./components/ui/toaster";
import AspirantsParentsPage from "./pages/AspirantsParentsPage";
import UpcomingEventsPage from "./pages/UpcomingEventsPage";
import FullTimePrograms from "./pages/FulltimeProgram";
import ExecutivePrograms from "./pages/ExecutivePrograms";
import IndustrySectorSpecialization from "./pages/IndustrySectorSpecialization";
import ProgramCMSFullEditor from "./pages/ProgramCMSFullEditor";
import ProgramEditor from "./pages/ProgramEditor";
import FlexiProgram from "./pages/FlexiProgram";
import CrpfwProgram from "./pages/CrpfwProgram";
import CouncilPage from "./pages/CouncilPage/CouncilPage";
import CouncilSubmenuPage from "./pages/CouncilPage/CouncilSubmenuPage";
function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pages/home/none" element={<AllPageView />} />
          <Route path="/pages/home" element={<HomePageSections />} />
          <Route path="/pages/home/slider" element={<HeroSlidesPage />} />
          <Route path="/pages/home/industry" element={<IndustryIconsPage />} />
          <Route
            path="/pages/home/Aspirants"
            element={<AspirantsParentsPage />}
          />
          <Route
            path="/pages/home/UpcomingEvents"
            element={<UpcomingEventsPage />}
          />
          <Route path="/programs/fulltime" element={<FullTimePrograms />} />
          <Route path="/programs/flexi-program" element={<FlexiProgram />} />
          <Route path="/programs/Career-Reboot-Program-for-Women" element={<CrpfwProgram />} />
          <Route path="/programs/Executive-Post-Graduate-Certificate-Programmes" element={<ExecutivePrograms />} />
          <Route path="/advisory/*" element={<CouncilPage />} />
          <Route path="/submenu/advisory/SME-Program-Advisory-Council" element={<CouncilSubmenuPage />} />
          <Route
            path="/programs/iss"
            element={<IndustrySectorSpecialization />}
          />
          {/* <Route path="/program/fulltime/*" element={<ProgramEditor />} /> */}
          <Route
            path="/program/fulltime/create"
            element={<ProgramEditor mode="create" />}
          />
          <Route
            path="/program/fulltime/:slug/:id"
            element={<ProgramEditor mode="edit" />}
          />
          {/* <Route path="/program/flexi/*" element={<ProgramEditor />} /> */}
          <Route
            path="/program/flexi/create"
            element={<ProgramEditor mode="create" />}
          />
          <Route
            path="/program/flexi/:slug/:id"
            element={<ProgramEditor mode="edit" />}
          />
          {/* <Route path="/program/epgcp/functional-certifications/*" element={<ProgramEditor />} /> */}
          <Route
            path="/programs/Executive-Post-Graduate-Certificate-Programmes/create"
            element={<ProgramEditor mode="create" />}
          />
          <Route
            path="/programs/Executive-Post-Graduate-Certificate-Programmes/:slug/:id"
            element={<ProgramEditor mode="edit" />}
          />
          {/* <Route path="/programs/crpfw/career-for-womens/*" element={<ProgramEditor />} /> */}
          <Route
            path="/programs/Career-Reboot-Program-for-Women/create"
            element={<ProgramEditor mode="create" />}
          />
          <Route
            path="/programs/Career-Reboot-Program-for-Women/:slug/:id"
            element={<ProgramEditor mode="edit" />}
          />
          {/* <Route path="/programs/Industry-Sector-Specialization/career-for-womens/*" element={<ProgramEditor />} /> */}
          <Route
            path="/program/Industry-Sector-Specialization/create"
            element={<ProgramEditor mode="create" />}
          />
          <Route
            path="/program/Industry-Sector-Specialization/:slug/:id"
            element={<ProgramEditor mode="edit" />}
          />
          {/* <Route path="/users" element={<Users />} /> */}
        </Routes>
        <Toaster />
      </AdminLayout>
    </Router>
  );
}

export default App;
