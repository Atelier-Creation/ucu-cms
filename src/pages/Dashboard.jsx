import { Calendar, Users, FileText, IndianRupee, TrendingUp, TrendingDown, Activity, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Enhanced stat card data
  const stats = [
    {
      id: 1,
      label: "Total Posts",
      value: "1,284",
      icon: FileText,
      trend: "+12%",
      trendUp: true,
      description: "content pieces published"
    },
    {
      id: 2,
      label: "Active Users",
      value: "8,342",
      icon: Users,
      trend: "+5.2%",
      trendUp: true,
      description: "registered on the platform"
    },
    {
      id: 3,
      label: "Revenue",
      value: "₹12.3k",
      icon: IndianRupee,
      trend: "-2.1%",
      trendUp: false,
      description: "total earnings this month"
    },
    {
      id: 4,
      label: "New Signups",
      value: "142",
      icon: Activity,
      trend: "+18%",
      trendUp: true,
      description: "joined in last 30 days"
    },
  ];

  // Example upcoming events
  const upcomingEvents = [
    { id: 1, name: "Orientation Session", date: "Nov 20, 2025", time: "10:00 AM", attendees: 50, status: "Confirmed" },
    { id: 2, name: "Workshop: React Basics", date: "Nov 22, 2025", time: "02:00 PM", attendees: 30, status: "Pending" },
    { id: 3, name: "Guest Lecture: AI Trends", date: "Nov 25, 2025", time: "11:30 AM", attendees: 120, status: "Confirmed" },
    { id: 4, name: "Hackathon Kickoff", date: "Dec 01, 2025", time: "09:00 AM", attendees: 200, status: "Planning" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your platform's performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:flex">
            Download Report
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Schedule Event
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.id} variants={item}>
              <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary/80 overflow-hidden relative group">
                {/* Decorative background circle */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="flex items-center text-xs">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={stat.trendUp ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>
                      {stat.trend}
                    </span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events Table */}
        <div className="lg:col-span-2">
          <Card className="h-full border border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Upcoming Events</CardTitle>
                <CardDescription>Manaage your schedule and sessions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[40%]">Event Details</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Attendees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{event.name}</span>
                          <span className="text-xs text-muted-foreground">Main Auditorium</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{event.date}</span>
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${event.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                            event.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                              'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                          }`}>
                          {event.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {event.attendees}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Activity / Notifications */}
        <div className="lg:col-span-1">
          <Card className="h-full border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>Latest system updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8 bg-muted items-center justify-center border text-xs font-medium">
                    U{i}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      User {i} updated their profile
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i * 15} minutes ago
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View Activity Log
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
