import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PanelsTopLeft, Plus, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "../../components/FileUploader";
import {
  getCouncilByTitle,
  createCouncilCategory,
  updateCouncilCategory,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor
} from "../../Api/CouncilApi";

function CouncilPage() {
  const location = useLocation();
  const { toast } = useToast();

  // Extract council title from URL
  const [councilTitle, setCouncilTitle] = useState("");

  // Data states
  const [category, setCategory] = useState({
    _id: null,
    councilTitle: "",
    bannerImage: "",
    aboutContent: ""
  });
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(false);

  // Advisor Dialog State
  const [isAdvisorDialogOpen, setIsAdvisorDialogOpen] = useState(false);
  const [currentAdvisor, setCurrentAdvisor] = useState(null); // null = new, obj = edit
  const [advisorForm, setAdvisorForm] = useState({
    name: "",
    desigination: "",
    profileImageUrl: "",
    companyLogo: "",
    companyText: "", // Assuming this is company name?
    linkedinUrl: ""
  });
  const [savingAdvisor, setSavingAdvisor] = useState(false);

  // Path processing
  const pathnames = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment.toLowerCase() !== "advisory");

  const formattedPath = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    if (pathnames.length > 0) {
      const title = formattedPath(pathnames[pathnames.length - 1]);
      setCouncilTitle(title);
      fetchData(title);
    }
  }, [location.pathname]);

  const fetchData = async (title) => {
    setLoading(true);
    try {
      const result = await getCouncilByTitle(title);
      if (result && result.data) {
        setCategory(result.data.category);
        setAdvisors(result.data.adivsories || []);
      } else {
        // Category doesn't exist, prepare to create it
        setCategory({
          _id: null,
          councilTitle: title,
          bannerImage: "",
          aboutContent: ""
        });
        setAdvisors([]);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    setSavingCategory(true);
    try {
      if (category._id) {
        await updateCouncilCategory(category._id, {
          councilTitle: category.councilTitle,
          bannerImage: category.bannerImage,
          aboutContent: category.aboutContent
        });
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        const result = await createCouncilCategory({
          councilTitle: category.councilTitle,
          bannerImage: category.bannerImage,
          aboutContent: category.aboutContent
        });
        setCategory(result.data);
        toast({ title: "Success", description: "Category created successfully" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save category", variant: "destructive" });
    } finally {
      setSavingCategory(false);
    }
  };

  // Advisor Handlers
  const openAddAdvisor = () => {
    setCurrentAdvisor(null);
    setAdvisorForm({
      name: "",
      desigination: "",
      profileImageUrl: "",
      companyLogo: "",
      companyText: "",
      linkedinUrl: ""
    });
    setIsAdvisorDialogOpen(true);
  };

  const openEditAdvisor = (advisor) => {
    setCurrentAdvisor(advisor);
    setAdvisorForm({
      name: advisor.name || "",
      desigination: advisor.desigination || "",
      profileImageUrl: advisor.profileImageUrl || "",
      companyLogo: advisor.companyLogo || "",
      companyText: advisor.companyText || "",
      linkedinUrl: advisor.linkedinUrl || ""
    });
    setIsAdvisorDialogOpen(true);
  };

  const handleSaveAdvisor = async () => {
    if (!category._id) {
      toast({ title: "Error", description: "Please save the category first", variant: "destructive" });
      return;
    }
    setSavingAdvisor(true);
    try {
      const payload = { ...advisorForm, councilTitleId: category._id };

      if (currentAdvisor) {
        await updateAdvisor(currentAdvisor._id, payload);
        toast({ title: "Success", description: "Advisor updated" });
      } else {
        await createAdvisor(payload);
        toast({ title: "Success", description: "Advisor added" });
      }
      setIsAdvisorDialogOpen(false);
      fetchData(councilTitle); // Refresh list
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save advisor", variant: "destructive" });
    } finally {
      setSavingAdvisor(false);
    }
  };

  const handleDeleteAdvisor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advisor?")) return;
    try {
      await deleteAdvisor(id);
      toast({ title: "Success", description: "Advisor deleted" });
      fetchData(councilTitle);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete advisor", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="min-w-max sm:min-w-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathnames.map((segment, index) => {
            const routeTo = "/advisory/" + pathnames.slice(0, index + 1).join("/"); // simplified route construction
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{formattedPath(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to='#'>{formattedPath(segment)}</Link>
                      {/* Note: Previous code had route logic. Assuming '/advisory/...' structure matches. */}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{councilTitle}</h1>
        <Button onClick={handleSaveCategory} disabled={savingCategory}>
          {savingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Page Details
        </Button>
      </div>

      {/* Category Banner & Content */}
      <Card>
        <CardHeader><CardTitle>Page Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Banner Image</Label>
            <FileUploader
              value={category.bannerImage || ""}
              onChange={(url) => setCategory(prev => ({ ...prev, bannerImage: url }))}
            />
          </div>
          <div className="space-y-2">
            <Label>About Content</Label>
            <Textarea
              placeholder="Describe the advisory council..."
              value={category.aboutContent || ""}
              onChange={(e) => setCategory(prev => ({ ...prev, aboutContent: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advisors List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Advisors</CardTitle>
          <Button onClick={openAddAdvisor} disabled={!category._id}>
            <Plus className="mr-2 h-4 w-4" /> Add Advisor
          </Button>
        </CardHeader>
        <CardContent>
          {!category._id && <div className="text-muted-foreground text-sm">Please save the category first to add advisors.</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisors.map((advisor) => (
              <Card key={advisor._id} className="relative overflow-hidden group">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-md">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600" onClick={() => openEditAdvisor(advisor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600" onClick={() => handleDeleteAdvisor(advisor._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 flex gap-4 items-start">
                  <img
                    src={advisor.profileImageUrl || "https://via.placeholder.com/100"}
                    alt={advisor.name}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{advisor.name}</h3>
                    <p className="text-sm text-muted-foreground">{advisor.desigination}</p>
                    {advisor.companyText && <p className="text-xs font-medium mt-1">{advisor.companyText}</p>}
                    {advisor.linkedinUrl && (
                      <a href={advisor.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline block mt-1">LinkedIn Profile</a>
                    )}
                  </div>
                </div>
                {advisor.companyLogo && (
                  <div className="bg-muted/20 p-2 flex justify-center">
                    <img src={advisor.companyLogo} alt="Company Logo" className="h-8 object-contain" />
                  </div>
                )}
              </Card>
            ))}
          </div>
          {advisors.length === 0 && category._id && (
            <div className="text-center py-10 text-muted-foreground">No advisors added yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Advisor Dialog */}
      <Dialog open={isAdvisorDialogOpen} onOpenChange={setIsAdvisorDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentAdvisor ? "Edit Advisor" : "Add Advisor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={advisorForm.name}
                  onChange={(e) => setAdvisorForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  value={advisorForm.desigination}
                  onChange={(e) => setAdvisorForm(prev => ({ ...prev, desigination: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <FileUploader
                value={advisorForm.profileImageUrl}
                onChange={(url) => setAdvisorForm(prev => ({ ...prev, profileImageUrl: url }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={advisorForm.companyText}
                onChange={(e) => setAdvisorForm(prev => ({ ...prev, companyText: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <FileUploader
                value={advisorForm.companyLogo}
                onChange={(url) => setAdvisorForm(prev => ({ ...prev, companyLogo: url }))}
              />
            </div>

            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={advisorForm.linkedinUrl}
                onChange={(e) => setAdvisorForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdvisorDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAdvisor} disabled={savingAdvisor}>
              {savingAdvisor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Advisor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CouncilPage;