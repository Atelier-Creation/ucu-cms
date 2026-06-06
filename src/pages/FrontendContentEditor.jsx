import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Save, Send } from "lucide-react";
import cmsApi from "@/lib/cmsApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function prettyJson(value) {
  return JSON.stringify(value ?? [], null, 2);
}

function parseJsonField(label, value) {
  try {
    return JSON.parse(value || "[]");
  } catch (error) {
    throw new Error(`${label} contains invalid JSON`);
  }
}

export default function FrontendContentEditor() {
  const { pageKey } = useParams();
  const [page, setPage] = useState(null);
  const [form, setForm] = useState(null);
  const [jsonFields, setJsonFields] = useState({
    sections: "[]",
    extractedText: "[]",
    imageReferences: "[]",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "";

  const publicHref = useMemo(() => {
    if (!frontendUrl || !form?.route || form.route === "*") return "";
    return `${frontendUrl}${form.route}`;
  }, [frontendUrl, form?.route]);

  const loadPage = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await cmsApi.get(`/frontend-content/cms/${pageKey}`);
      setPage(data);
      setForm({
        title: data.title || "",
        route: data.route || "",
        slug: data.slug || "",
        status: data.status || "draft",
        existingCmsModel: data.existingCmsModel || "",
        existingCmsEndpoint: data.existingCmsEndpoint || "",
      });
      setJsonFields({
        sections: prettyJson(data.sections),
        extractedText: prettyJson(data.extractedText),
        imageReferences: prettyJson(data.imageReferences),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load frontend content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [pageKey]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildPayload = (nextStatus = form.status) => {
    const sections = parseJsonField("Sections", jsonFields.sections);
    const extractedText = parseJsonField("Extracted text", jsonFields.extractedText);
    const imageReferences = parseJsonField("Image references", jsonFields.imageReferences);

    if (!Array.isArray(sections)) throw new Error("Sections must be a JSON array");
    if (!Array.isArray(extractedText)) throw new Error("Extracted text must be a JSON array");
    if (!Array.isArray(imageReferences)) throw new Error("Image references must be a JSON array");

    return {
      ...page,
      ...form,
      status: nextStatus,
      sections,
      extractedText,
      imageReferences,
    };
  };

  const savePage = async (nextStatus = form.status) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = buildPayload(nextStatus);
      const { data } = await cmsApi.put(`/frontend-content/cms/${pageKey}`, payload);
      setPage(data);
      setForm((current) => ({ ...current, status: data.status }));
      setMessage(nextStatus === "published" ? "Published successfully." : "Draft saved.");
    } catch (err) {
      setError(err.message || err.response?.data?.message || "Failed to save frontend content");
    } finally {
      setSaving(false);
    }
  };

  const publishPage = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = buildPayload("published");
      await cmsApi.put(`/frontend-content/cms/${pageKey}`, payload);
      const { data } = await cmsApi.post(`/frontend-content/cms/${pageKey}/publish`);
      setPage(data);
      setForm((current) => ({ ...current, status: "published" }));
      setMessage("Published successfully.");
    } catch (err) {
      setError(err.message || err.response?.data?.message || "Failed to publish frontend content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading frontend content...</div>;
  }

  if (error && !page) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link to="/frontend-content">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/frontend-content">
              <ArrowLeft />
              Back to Content
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{form.title || pageKey}</h1>
              <Badge variant={form.status === "published" ? "default" : "secondary"}>
                {form.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{form.route}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {publicHref && (
            <Button variant="outline" asChild>
              <a href={publicHref} target="_blank" rel="noreferrer">
                <ExternalLink />
                Preview
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => savePage("draft")} disabled={saving}>
            <Save />
            Save Draft
          </Button>
          <Button onClick={publishPage} disabled={saving}>
            <Send />
            Publish
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Page Metadata</CardTitle>
          <CardDescription>Stable routing and migration mapping for this page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(event) => updateForm("title", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Route</Label>
            <Input value={form.route} onChange={(event) => updateForm("route", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value)}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Existing CMS Model</Label>
            <Input
              value={form.existingCmsModel}
              onChange={(event) => updateForm("existingCmsModel", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Existing CMS Endpoint</Label>
            <Input
              value={form.existingCmsEndpoint}
              onChange={(event) => updateForm("existingCmsEndpoint", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sections JSON</CardTitle>
          <CardDescription>
            Preserves source order, component names, extracted text, API references, and media references.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            className="min-h-[420px] font-mono text-xs"
            value={jsonFields.sections}
            onChange={(event) => setJsonFields((current) => ({ ...current, sections: event.target.value }))}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text</CardTitle>
            <CardDescription>Text candidates captured from JSX and static content objects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[300px] font-mono text-xs"
              value={jsonFields.extractedText}
              onChange={(event) => setJsonFields((current) => ({ ...current, extractedText: event.target.value }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image References</CardTitle>
            <CardDescription>Existing asset paths and public URLs preserved from the frontend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[300px] font-mono text-xs"
              value={jsonFields.imageReferences}
              onChange={(event) => setJsonFields((current) => ({ ...current, imageReferences: event.target.value }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
