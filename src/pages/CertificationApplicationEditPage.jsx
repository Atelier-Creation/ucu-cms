import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationById,
  updateApplication,
} from "../Api/certificationApplicationApi";
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  BookOpen,
  Download,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CertificationApplicationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);

  // Fetch application details on load
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getApplicationById(id);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load application details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Handle nested input updates
  const handleNestedChange = (section, field, value, subSection = null) => {
    setData(prev => {
      const updated = { ...prev };
      if (subSection) {
        if (!updated[section]) updated[section] = {};
        if (!updated[section][subSection]) updated[section][subSection] = {};
        updated[section][subSection][field] = value;
      } else {
        if (!updated[section]) updated[section] = {};
        updated[section][field] = value;
      }
      return updated;
    });
  };

  // Handle Qualifications Education items change
  const handleEducationChange = (index, field, value) => {
    setData(prev => {
      const updated = { ...prev };
      if (!updated.qualifications) updated.qualifications = {};
      if (!updated.qualifications.education) updated.qualifications.education = [];
      updated.qualifications.education[index][field] = value;
      return updated;
    });
  };

  // Handle Qualifications Certifications change
  const handleCertificationChange = (index, field, value) => {
    setData(prev => {
      const updated = { ...prev };
      if (!updated.qualifications) updated.qualifications = {};
      if (!updated.qualifications.certifications) updated.qualifications.certifications = [];
      updated.qualifications.certifications[index][field] = value;
      return updated;
    });
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateApplication(id, data);
      if (res.success) {
        toast({
          title: "Success",
          description: "Application details updated successfully!",
        });
        navigate("/certification-applications");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save application updates.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <RefreshLoader />
        <span>Loading applicant details...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
        <HelpCircle className="h-8 w-8 text-red-500" />
        <span>Application details not found.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate("/certification-applications")}
            className="h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Edit Applicant: {data.personalDetails?.fullName || "N/A"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update candidate fields, review documents, and configure admissions status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Status:</label>
            <select
              value={data.status || "Submitted"}
              onChange={e => setData(prev => ({ ...prev, status: e.target.value }))}
              className="flex h-9 w-36 rounded-md border border-input bg-background px-3 py-1 text-sm font-bold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sections Column (Left, Width 2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Program of Interest */}
          <Card className="shadow-sm">
            <CardHeader className="py-5 bg-slate-50/50 dark:bg-slate-900/35 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-slate-500" />
                1. Program of Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Program Name</label>
                  <Input
                    value={data.programOfInterest?.programName || ""}
                    onChange={e => handleNestedChange("programOfInterest", "programName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Preferred Cohort</label>
                  <Input
                    value={data.programOfInterest?.preferredCohort || ""}
                    onChange={e => handleNestedChange("programOfInterest", "preferredCohort", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Learning Mode</label>
                  <select
                    value={data.programOfInterest?.preferredLearningMode || "Hybrid"}
                    onChange={e => handleNestedChange("programOfInterest", "preferredLearningMode", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="On-Campus">On-Campus</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="100% Online">100% Online</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Personal Details */}
          <Card className="shadow-sm">
            <CardHeader className="py-5 bg-slate-50/50 dark:bg-slate-900/35 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                2. Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <Input
                    value={data.personalDetails?.fullName || ""}
                    onChange={e => handleNestedChange("personalDetails", "fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
                  <Input
                    type="date"
                    value={data.personalDetails?.dateOfBirth ? data.personalDetails.dateOfBirth.split("T")[0] : ""}
                    onChange={e => handleNestedChange("personalDetails", "dateOfBirth", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Gender</label>
                  <select
                    value={data.personalDetails?.gender || "Male"}
                    onChange={e => handleNestedChange("personalDetails", "gender", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Nationality</label>
                  <Input
                    value={data.personalDetails?.nationality || ""}
                    onChange={e => handleNestedChange("personalDetails", "nationality", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Email Address</label>
                  <Input
                    type="email"
                    value={data.personalDetails?.email || ""}
                    onChange={e => handleNestedChange("personalDetails", "email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Mobile Phone</label>
                  <Input
                    value={data.personalDetails?.phone || ""}
                    onChange={e => handleNestedChange("personalDetails", "phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Current Address</label>
                  <Textarea
                    value={data.personalDetails?.currentAddress || ""}
                    onChange={e => handleNestedChange("personalDetails", "currentAddress", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500">Permanent Address</label>
                  <Textarea
                    value={data.personalDetails?.permanentAddress || ""}
                    onChange={e => handleNestedChange("personalDetails", "permanentAddress", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Emergency Contact Name</label>
                  <Input
                    value={data.personalDetails?.emergencyContactName || ""}
                    onChange={e => handleNestedChange("personalDetails", "emergencyContactName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Emergency Phone</label>
                  <Input
                    value={data.personalDetails?.emergencyContactPhone || ""}
                    onChange={e => handleNestedChange("personalDetails", "emergencyContactPhone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Academic Qualifications */}
          <Card className="shadow-sm">
            <CardHeader className="py-5 bg-slate-50/50 dark:bg-slate-900/35 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-slate-500" />
                3. Qualifications & Academics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Education List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Education Details</h4>
                {data.qualifications?.education?.map((ed, idx) => (
                  <div key={ed._id || idx} className="p-4 border rounded-lg bg-slate-50/30 space-y-4">
                    <span className="text-xs font-bold text-slate-400">Entry #{idx + 1}</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Degree / Major</label>
                        <Input
                          value={ed.degreeMajor || ""}
                          onChange={e => handleEducationChange(idx, "degreeMajor", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Institution</label>
                        <Input
                          value={ed.institution || ""}
                          onChange={e => handleEducationChange(idx, "institution", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">Graduation Year</label>
                        <Input
                          value={ed.yearOfGraduation || ""}
                          onChange={e => handleEducationChange(idx, "yearOfGraduation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500">GPA / Marks</label>
                        <Input
                          value={ed.gpaPercentage || ""}
                          onChange={e => handleEducationChange(idx, "gpaPercentage", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications List */}
              {data.qualifications?.certifications?.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Professional Certifications</h4>
                  {data.qualifications.certifications.map((cert, idx) => (
                    <div key={cert._id || idx} className="p-4 border rounded-lg bg-slate-50/30 space-y-4">
                      <span className="text-xs font-bold text-slate-400">Certification Entry #{idx + 1}</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500">Cert Name</label>
                          <Input
                            value={cert.certificationName || ""}
                            onChange={e => handleCertificationChange(idx, "certificationName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500">Issuing Body</label>
                          <Input
                            value={cert.issuingBody || ""}
                            onChange={e => handleCertificationChange(idx, "issuingBody", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-semibold text-slate-500">Year / Expiry</label>
                          <Input
                            value={cert.year || ""}
                            onChange={e => handleCertificationChange(idx, "year", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 4: Work Experience */}
          <Card className="shadow-sm">
            <CardHeader className="py-5 bg-slate-50/50 dark:bg-slate-900/35 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-500" />
                4. Work Experience Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Total Experience (Years)</label>
                  <Input
                    type="number"
                    value={data.workExperience?.totalYears || 0}
                    onChange={e => handleNestedChange("workExperience", "totalYears", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Total Experience (Months)</label>
                  <Input
                    type="number"
                    value={data.workExperience?.totalMonths || 0}
                    onChange={e => handleNestedChange("workExperience", "totalMonths", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Current Job */}
              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Current Employment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Company Name</label>
                    <Input
                      value={data.workExperience?.currentEmployment?.organizationName || ""}
                      onChange={e => handleNestedChange("workExperience", "organizationName", e.target.value, "currentEmployment")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Designation / Role</label>
                    <Input
                      value={data.workExperience?.currentEmployment?.designation || ""}
                      onChange={e => handleNestedChange("workExperience", "designation", e.target.value, "currentEmployment")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Date of Joining</label>
                    <Input
                      type="date"
                      value={data.workExperience?.currentEmployment?.dateOfJoining ? data.workExperience.currentEmployment.dateOfJoining.split("T")[0] : ""}
                      onChange={e => handleNestedChange("workExperience", "dateOfJoining", e.target.value, "currentEmployment")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Work Location</label>
                    <Input
                      value={data.workExperience?.currentEmployment?.location || ""}
                      onChange={e => handleNestedChange("workExperience", "location", e.target.value, "currentEmployment")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Industry / Sector</label>
                    <select
                      value={data.workExperience?.currentEmployment?.industrySector || ""}
                      onChange={e => handleNestedChange("workExperience", "industrySector", e.target.value, "currentEmployment")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">-- Select Industry --</option>
                      <option value="Consulting">Consulting</option>
                      <option value="IT/Tech">IT / Technology</option>
                      <option value="Finance/Banking">Finance / Banking</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {data.workExperience?.currentEmployment?.industrySector === "Other" && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500">Specify Industry</label>
                      <Input
                        value={data.workExperience?.currentEmployment?.industrySectorOther || ""}
                        onChange={e => handleNestedChange("workExperience", "industrySectorOther", e.target.value, "currentEmployment")}
                      />
                    </div>
                  )}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Roles & Responsibilities</label>
                    <Textarea
                      value={data.workExperience?.currentEmployment?.responsibilities || ""}
                      onChange={e => handleNestedChange("workExperience", "responsibilities", e.target.value, "currentEmployment")}
                    />
                  </div>
                </div>
              </div>

              {/* Past Job */}
              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Past Employment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Previous Company</label>
                    <Input
                      value={data.workExperience?.pastEmployment?.organizationName || ""}
                      onChange={e => handleNestedChange("workExperience", "organizationName", e.target.value, "pastEmployment")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Previous Role</label>
                    <Input
                      value={data.workExperience?.pastEmployment?.designation || ""}
                      onChange={e => handleNestedChange("workExperience", "designation", e.target.value, "pastEmployment")}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Tenure</label>
                    <Input
                      value={data.workExperience?.pastEmployment?.tenure || ""}
                      onChange={e => handleNestedChange("workExperience", "tenure", e.target.value, "pastEmployment")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Statement of Purpose */}
          <Card className="shadow-sm">
            <CardHeader className="py-5 bg-slate-50/50 dark:bg-slate-900/35 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                5. Statements of Purpose & Career Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Q1. Why are you interested in this program?</label>
                <Textarea
                  value={data.statementOfPurpose?.whyProgram || ""}
                  onChange={e => handleNestedChange("statementOfPurpose", "whyProgram", e.target.value)}
                  rows="7"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Q2. Describe a major professional achievement:</label>
                <Textarea
                  value={data.statementOfPurpose?.professionalAchievement || ""}
                  onChange={e => handleNestedChange("statementOfPurpose", "professionalAchievement", e.target.value)}
                  rows="6"
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Uploaded Documents Column (Right, Width 1/3) */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="py-5 bg-slate-50/50 dark:bg-slate-900/35 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                6. Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              
              {/* Resume */}
              <div className="p-4 border rounded-xl bg-slate-50/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Candidate Resume</span>
                  {data.documents?.resumeUrl ? (
                    <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-semibold">Missing</span>
                  )}
                </div>
                {data.documents?.resumeUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2 text-blue-600 bg-white"
                    onClick={() => window.open(data.documents.resumeUrl, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume / CV
                  </Button>
                )}
              </div>

              {/* ID Proof */}
              <div className="p-4 border rounded-xl bg-slate-50/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Government ID Proof</span>
                  {data.documents?.idProofUrl ? (
                    <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-semibold">Missing</span>
                  )}
                </div>
                {data.documents?.idProofUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2 text-blue-600 bg-white"
                    onClick={() => window.open(data.documents.idProofUrl, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                    Download ID Proof
                  </Button>
                )}
              </div>

              {/* Degrees */}
              <div className="p-4 border rounded-xl bg-slate-50/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Degree & Transcripts</span>
                  {data.documents?.graduationCertificateUrl ? (
                    <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-semibold">Missing</span>
                  )}
                </div>
                {data.documents?.graduationCertificateUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-2 text-blue-600 bg-white"
                    onClick={() => window.open(data.documents.graduationCertificateUrl, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                    Download Certificates
                  </Button>
                )}
              </div>

              {/* Candidate Declaration details */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs text-slate-500 space-y-2">
                <div className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Declaration Status:</div>
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                  {data.declaration?.accepted ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Accepted on {new Date(data.declaration?.signedDate || data.createdAt).toLocaleDateString()}
                    </>
                  ) : (
                    "Not Accepted"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  );
}

// Minimal icons loaders
function RefreshLoader() {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-blue-500" />
  );
}
