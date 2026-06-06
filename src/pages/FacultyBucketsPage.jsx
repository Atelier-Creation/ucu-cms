import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import FileUploader from "@/components/FileUploader";
import { getFacultyBuckets, updateFacultyBuckets } from "../Api/FacultyBucketApi";

const sortBuckets = (items) =>
  [...items].sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));

const emptyBucket = {
  title: "",
  isVisible: true,
  data: [],
};

const emptyFaculty = {
  name: "",
  prof: "",
  image: "",
};

export default function FacultyBucketsPage() {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      const result = await getFacultyBuckets();
      setBuckets(sortBuckets(result));
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch faculty buckets.", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const validBuckets = buckets.filter((bucket) => bucket.title?.trim());
      const result = await updateFacultyBuckets(validBuckets);
      setBuckets(sortBuckets(result));
      toast({ title: "Success", description: "Faculty buckets updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save faculty buckets.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateBucket = (index, field, value) => {
    setBuckets((prev) =>
      sortBuckets(prev.map((bucket, i) => (i === index ? { ...bucket, [field]: value } : bucket)))
    );
  };

  const addBucket = () => {
    setBuckets((prev) => sortBuckets([...prev, { ...emptyBucket }]));
  };

  const removeBucket = (index) => {
    setBuckets((prev) => prev.filter((_, i) => i !== index));
  };

  const addFaculty = (bucketIndex) => {
    setBuckets((prev) =>
      prev.map((bucket, i) =>
        i === bucketIndex ? { ...bucket, data: [...(bucket.data || []), { ...emptyFaculty }] } : bucket
      )
    );
  };

  const removeFaculty = (bucketIndex, facultyIndex) => {
    setBuckets((prev) =>
      prev.map((bucket, i) =>
        i === bucketIndex
          ? { ...bucket, data: (bucket.data || []).filter((_, j) => j !== facultyIndex) }
          : bucket
      )
    );
  };

  const updateFaculty = (bucketIndex, facultyIndex, field, value) => {
    setBuckets((prev) =>
      prev.map((bucket, i) =>
        i === bucketIndex
          ? {
              ...bucket,
              data: (bucket.data || []).map((faculty, j) =>
                j === facultyIndex ? { ...faculty, [field]: value } : faculty
              ),
            }
          : bucket
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Faculty Dropdown Buckets</h1>
          <p className="text-sm text-muted-foreground">
            Add, rename, hide, or remove Faculty dropdown sections. Buckets are shown alphabetically on the website.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addBucket}>+ Add Bucket</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {buckets.map((bucket, bucketIndex) => (
          <Card key={bucket._id || bucketIndex}>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">{bucket.title || "New Faculty Bucket"}</CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Visible</span>
                <Switch
                  checked={bucket.isVisible !== false}
                  onCheckedChange={(checked) => updateBucket(bucketIndex, "isVisible", checked)}
                />
                <Button variant="ghost" className="text-red-500" onClick={() => removeBucket(bucketIndex)}>
                  Remove
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Bucket Name</label>
                <Input
                  value={bucket.title || ""}
                  onChange={(e) => updateBucket(bucketIndex, "title", e.target.value)}
                  placeholder="e.g. Sales"
                />
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Faculty Profiles</h3>
                <Button size="sm" variant="outline" onClick={() => addFaculty(bucketIndex)}>+ Add Faculty</Button>
              </div>

              {(bucket.data || []).map((faculty, facultyIndex) => (
                <Card key={facultyIndex} className="p-4 border-dashed">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Faculty {facultyIndex + 1}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => removeFaculty(bucketIndex, facultyIndex)}
                    >
                      Remove Faculty
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={faculty.name || ""}
                      onChange={(e) => updateFaculty(bucketIndex, facultyIndex, "name", e.target.value)}
                      placeholder="Faculty name"
                    />
                    <Textarea
                      value={faculty.prof || ""}
                      onChange={(e) => updateFaculty(bucketIndex, facultyIndex, "prof", e.target.value)}
                      placeholder="Designation / profile text"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="text-sm font-medium">Profile Image</label>
                    <FileUploader
                      value={faculty.image || ""}
                      onChange={(url) => updateFaculty(bucketIndex, facultyIndex, "image", url)}
                    />
                  </div>
                </Card>
              ))}

              {(bucket.data || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No faculty profiles added yet.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
