import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllApplications,
  deleteApplication,
} from "../Api/certificationApplicationApi";
import {
  Search,
  Eye,
  Trash2,
  Filter,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CertificationApplicationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  // Load submissions
  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await getAllApplications();
      if (res.success) {
        setApplications(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch applications list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Delete submission
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}'s application?`)) return;

    try {
      const res = await deleteApplication(id);
      if (res.success) {
        toast({
          title: "Deleted",
          description: `${name}'s application deleted successfully.`,
        });
        setApplications(prev => prev.filter(app => app._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete application.",
        variant: "destructive",
      });
    }
  };

  // Get status badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/35 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Under Review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Shortlisted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/35 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/35 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200";
    }
  };

  // Unique list of programs for filtering
  const uniquePrograms = Array.from(
    new Set(applications.map(app => app.programOfInterest?.programName).filter(Boolean))
  );

  // Filter application list
  const filteredApps = applications.filter(app => {
    const name = app.personalDetails?.fullName || "";
    const email = app.personalDetails?.email || "";
    const phone = app.personalDetails?.phone || "";
    const program = app.programOfInterest?.programName || "";
    const status = app.status || "Submitted";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesProgram = programFilter === "all" || program === programFilter;

    return matchesSearch && matchesStatus && matchesProgram;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admissions Applications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and edit candidate submissions for certification and executive programs.
          </p>
        </div>
        <Button onClick={loadApplications} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh List
        </Button>
      </div>

      <Separator />

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Submitted</CardDescription>
            <CardTitle className="text-2xl font-bold">{applications.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-amber-500">Under Review</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-500">
              {applications.filter(a => a.status === "Under Review").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-green-500">Accepted</CardDescription>
            <CardTitle className="text-2xl font-bold text-green-500">
              {applications.filter(a => a.status === "Accepted").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-red-500">Rejected</CardDescription>
            <CardTitle className="text-2xl font-bold text-red-500">
              {applications.filter(a => a.status === "Rejected").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search candidate name, email, phone, or program..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            {/* Program Filter */}
            <div className="md:col-span-3">
              <select
                value={programFilter}
                onChange={e => setProgramFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Programs</option>
                {uniquePrograms.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table list */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span>Fetching applications...</span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
              <AlertCircle className="h-8 w-8 text-slate-300" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">No Applications Found</span>
              <span className="text-xs max-w-sm text-slate-500">
                Try modifying your search query or reset status/program filters.
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">Candidate Details</th>
                    <th className="py-4 px-6">Program of Interest</th>
                    <th className="py-4 px-6">Submitted Date</th>
                    <th className="py-4 px-6 text-center">Mode</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApps.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/35 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {app.personalDetails?.fullName || "N/A"}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3" />
                            {app.personalDetails?.email || "N/A"}
                          </span>
                          <span className="flex items-center gap-1.5 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {app.personalDetails?.phone || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Program */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                          <GraduationCap className="h-4 w-4 text-slate-400" />
                          {app.programOfInterest?.programName || "N/A"}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 ml-5">
                          Cohort: {app.programOfInterest?.preferredCohort || "N/A"}
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>

                      {/* Mode */}
                      <td className="py-4 px-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {app.programOfInterest?.preferredLearningMode || "N/A"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                          {app.status || "Submitted"}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-slate-100 hover:text-slate-900"
                            onClick={() => navigate(`/certification-applications/edit/${app._id}`)}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(app._id, app.personalDetails?.fullName)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
