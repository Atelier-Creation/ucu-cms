import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Plus, PanelsTopLeft } from "lucide-react";
import {
    getPartnershipCategories,
    createPartnershipCategory,
    updatePartnershipCategory,
    deletePartnershipCategory,
    getPartnershipData,
    createPartnershipData,
    updatePartnershipData,
    deletePartnershipData,
} from "@/Api/PartnershipApi";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function IndustryPartnershipPage() {
    const { toast } = useToast();
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState("data");

    // State for Category Form
    const [categoryForm, setCategoryForm] = useState({
        categoryTitle: "",
        categoryDesc: "",
        _id: null,
    });
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

    // State for Data Item Form
    const [itemForm, setItemForm] = useState({
        title: "",
        profession: "",
        image: "", // Comma separated string for UI
        categoryId: "",
        subCategoryId: "",
        _id: null,
    });
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [cats, data] = await Promise.all([
                getPartnershipCategories(),
                getPartnershipData(),
            ]);
            setCategories(cats.data || cats); // Handle potential response wrapping
            setItems(data.data || data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- CATEGORY HANDLERS ---
    const handleCategorySubmit = async () => {
        try {
            if (categoryForm._id) {
                await updatePartnershipCategory(categoryForm._id, categoryForm);
                toast({ title: "Success", description: "Category updated." });
            } else {
                await createPartnershipCategory(categoryForm);
                toast({ title: "Success", description: "Category created." });
            }
            setIsCategoryDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save category.",
                variant: "destructive",
            });
        }
    };

    const handleEditCategory = (cat) => {
        setCategoryForm({
            categoryTitle: cat.categoryTitle,
            categoryDesc: cat.categoryDesc,
            _id: cat._id,
        });
        setIsCategoryDialogOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm("Are you sure? This might delete associated data.")) return;
        try {
            await deletePartnershipCategory(id);
            toast({ title: "Success", description: "Category deleted." });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete category.",
                variant: "destructive",
            });
        }
    };

    // --- DATA ITEM HANDLERS ---
    const handleItemSubmit = async () => {
        try {
            const payload = {
                ...itemForm,
                image: itemForm.image.split(",").map((s) => s.trim()).filter(Boolean),
                subCategoryId: itemForm.subCategoryId || null,
            };

            if (itemForm._id) {
                await updatePartnershipData(itemForm._id, payload);
                toast({ title: "Success", description: "Item updated." });
            } else {
                await createPartnershipData(payload);
                toast({ title: "Success", description: "Item created." });
            }
            setIsItemDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save item.",
                variant: "destructive",
            });
        }
    };

    const handleEditItem = (item) => {
        setItemForm({
            title: item.title,
            profession: item.profession || "",
            image: item.image ? item.image.join(", ") : "",
            categoryId: item.categoryId?._id || item.categoryId || "",
            subCategoryId: item.subCategoryId || "",
            _id: item._id,
        });
        setIsItemDialogOpen(true);
    };

    const handleDeleteItem = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deletePartnershipData(id);
            toast({ title: "Success", description: "Item deleted." });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete item.",
                variant: "destructive",
            });
        }
    };

    const getCategoryName = (catId) => {
        const cat = categories.find(c => c._id === catId || c._id === catId?._id);
        return cat ? cat.categoryTitle : "Unknown";
    }

    // Get current selected category object to check for subcategories
    const selectedCategory = categories.find(c => c._id === itemForm.categoryId);

    return (
        <div className="p-6 space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/pages/home/none">
                            <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />Pages
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Industry Partnership</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Industry Partnership</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="data">Partnership Items</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                {/* --- PARTNERSHIP ITEMS TAB --- */}
                <TabsContent value="data" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                setItemForm({ title: "", profession: "", image: "", categoryId: "", subCategoryId: "", _id: null });
                                setIsItemDialogOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Items ({items.length})</CardTitle>
                            <CardDescription>Manage industry partners, alumni, or board members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title/Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Profession</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell>
                                                {item.categoryId?.categoryTitle || getCategoryName(item.categoryId)}
                                            </TableCell>
                                            <TableCell>{item.profession}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditItem(item)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteItem(item._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No items found.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- CATEGORIES TAB --- */}
                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                setCategoryForm({ categoryTitle: "", categoryDesc: "", _id: null });
                                setIsCategoryDialogOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Categories ({categories.length})</CardTitle>
                            <CardDescription>Define categories for partnership items (e.g., Recruiters, Alumni).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((cat) => (
                                        <TableRow key={cat._id}>
                                            <TableCell className="font-medium">{cat.categoryTitle}</TableCell>
                                            <TableCell className="truncate max-w-[300px]">{cat.categoryDesc}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditCategory(cat)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteCategory(cat._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {categories.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24">No categories found.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* --- DIALOGS --- */}

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{categoryForm._id ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Category Title</Label>
                            <Input
                                value={categoryForm.categoryTitle}
                                onChange={(e) => setCategoryForm({ ...categoryForm, categoryTitle: e.target.value })}
                                placeholder="e.g. Recruiters"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={categoryForm.categoryDesc}
                                onChange={(e) => setCategoryForm({ ...categoryForm, categoryDesc: e.target.value })}
                                placeholder="Description of this category"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCategorySubmit}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Item Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{itemForm._id ? "Edit Item" : "Add Item"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title / Name</Label>
                            <Input
                                value={itemForm.title}
                                onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                                placeholder="e.g. John Doe, Google"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Profession / Role (Optional)</Label>
                            <Input
                                value={itemForm.profession}
                                onChange={(e) => setItemForm({ ...itemForm, profession: e.target.value })}
                                placeholder="e.g. CEO, Senior Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Images (Comma separated URLs)</Label>
                            <Textarea
                                value={itemForm.image}
                                onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                                placeholder="https://example.com/image1.jpg, https://example.com/logo.png"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={itemForm.categoryId}
                                onValueChange={(val) => setItemForm({ ...itemForm, categoryId: val, subCategoryId: "" })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.categoryTitle}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedCategory?.subCategories?.length > 0 && (
                            <div className="space-y-2">
                                <Label>Sub Category</Label>
                                <Select
                                    value={itemForm.subCategoryId}
                                    onValueChange={(val) => setItemForm({ ...itemForm, subCategoryId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Sub Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedCategory.subCategories.map((sub) => (
                                            <SelectItem key={sub._id} value={sub._id}>
                                                {sub.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleItemSubmit}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
