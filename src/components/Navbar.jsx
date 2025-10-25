import { useEffect, useState } from "react";
import { Bell, Menu, User, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Navbar({ setMobileOpen }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
      {/* Left section - mobile menu & logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button triggers AdminLayout's state */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
      </div>

      {/* Center section - search */}
      <div className="hidden md:block w-1/3">
        <Input type="text" placeholder="Search..." className="w-full" />
      </div>

      {/* Right section - notifications, theme toggle, user */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
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
    </header>
  );
}
