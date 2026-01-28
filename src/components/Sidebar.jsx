import { Link, useLocation, useNavigate } from "react-router-dom";
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
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate()

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
    {
      to: "/Programs",
      label: "Programs",
      icon: GraduationCap,
      submenu: [
        { to: "/programs/fulltime", label: "Full Time Programs" },
        { to: "/programs/flexi-program", label: "Flexi Programs" },
        {
          to: "/programs/Career-Reboot-Program-for-Women",
          label: "Career Reboot Program for Women",
        },
        {
          to: "/programs/Executive-Post-Graduate-Certificate-Programmes",
          label: "Executive Post Graduate Certificate Programmes",
        },
      ],
    },
    { to: "/events", label: "Events", icon: CalendarDays },
    {
      to: "/advisory-councils",
      label: "Advisory Councils",
      icon: GraduationCap,
      submenu: [
        { to: "/advisory/Business-Advisory-Council", label: "Business Advisory Council" },
        { to: "/advisory/Academic-Advisory-Council", label: "Academic Advisory Council" },
        {
          to: "/advisory/CHRO-Advisory-Council",
          label: "CHRO Advisory Council",
        },
        {
          to: "/advisory/Talent-Advisory-Council",
          label: "Talent Advisory Council",
        },
        {
          to: "/advisory/L&D-Advisory-Council",
          label: "L&D Advisory Council",
        },
        {
          to: "/advisory/Young-CXO-Council",
          label: "Young CXO Council ",
        },
        {
          to: "/advisory/Rising-Leaders-Council ",
          label: "Rising Leaders' Council ",
        },
        {
          to: "/advisory/Our-Brand-Ambassadors",
          label: "Our Brand Ambassadors",
        },
        {
          to: "/submenu/advisory/SME-Program-Advisory-Council",
          label: "SME Program Advisory Council",
        },
      ],
    },
    { to: "/online-program", label: "Online Programs", icon: Settings },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  // Sidebar content
  const content = (
    <div className="flex flex-col h-full max-w-70">
      {/* Logo */}
      <div className="p-4 border-b">
        <div className=" flex flex-col items-center justify-center">
          <div className="logo-batch-div">
            {/* <img src="./LogoBatch.svg" className="relative h-20 -top-4" alt="Batch Logo" /> */}
            <img
              onClick={() => navigate("/")}
              src="/logo.svg"
              alt="Logo"
              className="h-30 w-30 transition-all duration-300 dark:[filter:brightness(0)_invert(1)]"
            />
          </div>
          <p className="font-bold text-lg text-center">Admin Dashboard</p>
        </div>
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
                    onClick={() => setOpenMenu(isOpen ? null : link.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all",
                      isOpen ? "bg-blue-50 text-blue-800" : "hover:bg-gray-100",
                      //Dark mode
                      "dark:text-white dark:hover:bg-gray-800 dark:bg-transparent",
                      isOpen && "dark:bg-blue-50 dark:text-blue-800"
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
                    <div className="ml-7 border-l-2 border-blue-600 pl-4 space-y-1">
                      {link.submenu.map((sub) => {
                        const isSubActive = pathname.includes(sub.to);
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center py-2 text-sm text-gray-700 hover:text-blue-700 capitalize transition",
                              "dark:text-gray-300 dark:hover:text-blue-800",
                              isSubActive && "font-semibold text-blue-800"
                            )}
                          >
                            <div
                              className={cn(
                                "w-3 h-3 absolute left-[39px] rounded-full border-2 bg-background border-blue-800 mr-2",
                                isSubActive &&
                                "border-white w-4 h-4 left-[37px] bg-blue-800"
                              )}
                            />
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
                  "bg-blue-50 text-blue-800 hover:bg-gray-200 hover:text-gray-900"
                )}
              >
                <Link
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center"
                >
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
      <div className="p-4 flex flex-col items-center gap-4 w-full border-t bg-background">
        <Button variant="ghost" className="justify-start gap-2 w-full">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
        <span className="text-xs text-muted-foreground text-center w-full">
          © {new Date().getFullYear()} UCU CMS
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-background shadow-lg overflow-hidden hover:overflow-y-auto sidebar-scroll">
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
