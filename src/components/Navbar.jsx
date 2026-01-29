import { useEffect, useState } from "react";
import { Bell, Menu, User, Moon, Sun, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ setMobileOpen }) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      message: "Order #12345 has been placed successfully.",
      time: "5 mins ago",
    },
    {
      id: 2,
      title: "Stock Alert",
      message: "Low stock alert for Product XYZ.",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Customer Review",
      message: "You received a new 5-star review!",
      time: "2 hours ago",
    },
  ]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const clearNotifications = () => setNotifications([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b relative">
      {/* Left section - mobile menu */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Center - search */}
      <div className="hidden md:block w-1/3">
        <Input type="text" placeholder="Search..." className="w-full" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setShowNotifications(true)}
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>

        <Button
          onClick={toggleTheme}
          variant="ghost"
          className="p-2 rounded-full"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>

        <Separator orientation="vertical" className="h-6 hidden md:block" />

        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="hidden md:inline text-sm font-medium">Admin</span>
        </Button>
      </div>

      {/* ✅ Notification Sheet */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
            />

            {/* Sheet (mobile = bottom, desktop = right) */}
            <motion.div
              drag={isMobile ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (isMobile && info.offset.y > 100) {
                  setShowNotifications(false);
                }
              }}
              initial={{
                x: isMobile ? 0 : "100%",
                y: isMobile ? "100%" : 0,
              }}
              animate={{
                x: 0,
                y: 0,
              }}
              exit={{
                x: isMobile ? 0 : "100%",
                y: isMobile ? "100%" : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bg-background shadow-xl z-50 p-5 flex flex-col ${isMobile
                  ? "bottom-0 left-0 w-full h-[60vh] rounded-t-2xl"
                  : "top-0 right-0 w-80 md:w-96 h-full rounded-l-2xl"
                }`}
            >
              {/* Mobile drag indicator */}
              {isMobile && (
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3" />
              )}

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearNotifications}
                      className="text-xs flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Notifications list */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg border hover:bg-accent transition"
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 text-gray-400" />
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
