import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Home,
  PanelsTopLeft,
  Users,
  Settings,
  CalendarDays,
  LogOut,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const links = [
    { to: "/", label: "Dashboard", icon: Home },
    {
      label: "Pages",
      to: "/pages",
      icon: PanelsTopLeft,
      submenu: [
        { to: "/pages/home", label: "Home" },
        { to: "/pages/industry", label: "Industry Partnership" },
        { to: "/pages/status", label: "Social Impact" },
      ],
    },
    { to: "/students", label: "Students", icon: Users },
    { to: "/Programs", label: "Programs", icon: GraduationCap,
      submenu: [
        { to: "/programs/fulltime", label: "Full Time Programs" },
        { to: "/programs/epgcp", label: "Executive Post Graduate Certificate Programmes" },
        { to: "/programs/iss", label: "Industry Sector Specialization" },
      ], },
    { to: "/events", label: "Events", icon: CalendarDays },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  // Sidebar content
  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-foreground">UCU CMS</h1>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.to;
            const isOpen = openMenu === link.label;

            if (link.submenu) {
              return (
                <div key={link.label} className="space-y-1">
                  <button
                    onClick={() =>
                      setOpenMenu(isOpen ? null : link.label)
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all",
                      isOpen ? "bg-orange-50 text-orange-800" : "hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="ml-7 border-l-2 border-orange-600 pl-4 space-y-1">
                      {link.submenu.map((sub) => {
                        const isSubActive = pathname.includes(sub.to);
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center py-2 text-sm text-gray-700 hover:text-orange-700 capitalize transition",
                              isSubActive && "font-semibold text-orange-800"
                            )}
                          >
                            <div className={cn("w-3 h-3 absolute left-[39px] rounded-full border-2 bg-background border-orange-800 mr-2", isSubActive && "border-white w-4 h-4 left-[37px] bg-orange-800")} />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Button
                key={link.to}
                asChild
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sm font-medium gap-3 py-2 hover:bg-gray-100",
                  isActive &&
                    "bg-orange-50 text-orange-800 hover:bg-gray-200 hover:text-gray-900"
                )}
              >
                <Link to={link.to} onClick={() => setMobileOpen(false)} className="flex items-center">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-4 flex flex-col gap-2">
        <Button variant="ghost" className="justify-start gap-2 w-full">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} UCU CMS
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background shadow-lg">
        {content}
      </aside>

      {/* Mobile Sidebar as Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}
