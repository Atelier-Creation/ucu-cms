import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, ExternalLink, RefreshCw, Search } from "lucide-react";
import cmsApi from "@/lib/cmsApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FrontendContentList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "";

  const fetchPages = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await cmsApi.get("/frontend-content/cms");
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load frontend content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const filteredPages = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return pages;
    return pages.filter((page) =>
      [page.route, page.pageKey, page.title, page.componentName, page.existingCmsModel]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  }, [pages, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Seeded Frontend Content</h1>
          <p className="text-sm text-muted-foreground">
            Draft/publish CMS records created from the current public frontend.
          </p>
        </div>
        <Button variant="outline" onClick={fetchPages} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Public Routes</CardTitle>
          <CardDescription>
            These records are seeded before public frontend API rewiring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search route, component, page key, or model"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>CMS Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => {
                const publicHref = frontendUrl ? `${frontendUrl}${page.route === "*" ? "" : page.route}` : "";
                return (
                  <TableRow key={page.pageKey}>
                    <TableCell className="font-medium">
                      <div className="max-w-[220px] truncate">{page.route}</div>
                      <div className="text-xs text-muted-foreground">{page.pageKey}</div>
                    </TableCell>
                    <TableCell>{page.componentName || "-"}</TableCell>
                    <TableCell>
                      <div className="max-w-[260px] truncate">{page.existingCmsModel || "FrontendPageContent"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={page.status === "published" ? "default" : "secondary"}>
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {page.updatedAt ? new Date(page.updatedAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {publicHref && (
                          <Button variant="ghost" size="icon" asChild title="Open public route">
                            <a href={publicHref} target="_blank" rel="noreferrer">
                              <ExternalLink />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/frontend-content/${page.pageKey}`}>
                            <Edit />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && filteredPages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No seeded frontend pages found.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading seeded content...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
