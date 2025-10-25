import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function AdminLayout({ children }) {
   const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      {/* Sidebar stays full height, fixed */}
      <Sidebar className="h-full flex-shrink-0" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar setMobileOpen={setMobileOpen} />

        {/* Scrollable area */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
