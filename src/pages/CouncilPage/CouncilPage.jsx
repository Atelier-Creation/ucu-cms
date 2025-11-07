import React, { useState } from 'react'
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelsTopLeft } from "lucide-react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FileUploader from "../../components/FileUploader";
function CouncilPage({
  mode = "create", // "create" | "edit"
  initialData = null,
  onSave,
  onCancel,
}) {
  const location = useLocation();
  const params = useParams();
  const [selectedCouncil, setSelectedCouncil] = useState("");
  // remove "advisory" from breadcrumb
  const pathnames = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment.toLowerCase() !== "advisory");
  const formattedPath = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    <div>
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
            const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      {mode === "edit" && initialData?.title
                        ? initialData.title
                        : formattedPath(segment)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{formattedPath(segment)}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className='my-5'>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Edit Program" : "Create New Adivisory Council"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Manage all sections of the Adivisory page from a single dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Advisory Council Advisors</h2>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Banner Image */}

          <div className="space-y-2">
            <Label>Upload Advisors Image</Label>
            <FileUploader />
          </div>

          {/* adivor belongs  */}
<div className="space-y-2">
  <Label>Council Belongs To</Label>
  <Input
    value={formattedPath(pathnames[pathnames.length - 1])}
    readOnly
    className="bg-gray-100 cursor-not-allowed"
  />
</div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Advisors Name</Label>
            <Input
              placeholder="Enter program title"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label>Advisors Professional</Label>
            <Input
              placeholder="Enter subtitle"
            />
          </div>
          <div className="space-y-2">
            <Label>Advisors Linkedin URL</Label>
            <Input
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Advisors Company Logo Image</Label>
            <FileUploader />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button onClick={() => console.log("Saved Data:", data)}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CouncilPage