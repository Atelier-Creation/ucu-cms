"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Trash2, Pencil, PanelsTopLeft, Youtube } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createAspirant, getAllAspirants, getAspirantById, deleteAspirant, updateAspirant } from "@/Api/AspirantApi"
const AspirantsParentsPage = () => {
  const { toast } = useToast()
  const [aspirants, setAspirants] = useState([
  ])

  const [newItem, setNewItem] = useState({
    VideoUrl: "",
    thumbNailUrl: "",
    author: "",
    authorProf: "",
    authorDesc: "",
  })

  const [editItem, setEditItem] = useState(null)

  const getEmbedUrl = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? `https://www.youtube.com/embed/${match[1]}` : ""
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAspirants()
        setAspirants(res.data || res)
      } catch (error) {
        toast({ title: "Error", description: "failed to fetch data" })
      }
    }
    fetchData()
  }, [])
  const handleAdd = async () => {
    const { VideoUrl, author, authorDesc, authorProf, thumbNailUrl } = newItem
    if (!VideoUrl || !author || !authorDesc || !authorProf || !thumbNailUrl) {
      toast({ title: "Error", description: "All Fields Are Required" })
      return
    }
    try {
      const res = await createAspirant(newItem)
      setAspirants([...aspirants, res.data || res])
      setNewItem({
        VideoUrl: "",
        author: "",
        authorDesc: "",
        authorProf: "",
        thumbNailUrl: ""
      })

      toast({ title: "Success", description: "Aspirant data added successfully" })
    } catch (error) {
      toast({ title: "Error", description: "failed to add data" })
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAspirant(id)
setAspirants(aspirants.filter((data) => data._id !== id))

      toast({ title: "Success", description: "Deleted data successfully" })
    } catch (error) {
      toast({ title: "Error", description: "failed to delete data" })
    }
  }

  const handleEdit = async () => {
    try {
      const res = await updateAspirant(editItem._id, editItem)
      setAspirants(
        aspirants.map((data) =>
          data._id === editItem._id ? res.data || res : data
        )
      )

      setEditItem(null)
      toast({ title: "Success", description: "Updated data successfully" })

    } catch (error) {
      toast({ title: "Error", description: "failed to update data" })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pages/home">
              <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
              Pages
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pages/home">Home Page</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Aspirants & Parents Speak</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Aspirants & Parents Management
        </h1>
      </div>

      <Separator />

      {/* Add Form */}
      <Card className="border-border rounded-xl">
        <CardHeader>
          <CardTitle>Add New Aspirant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="YouTube Video Link"
            value={newItem.VideoUrl}
            onChange={(e) => setNewItem({ ...newItem, VideoUrl: e.target.value })}
          />
          <Input
            placeholder="Thumbnail URL"
            value={newItem.thumbNailUrl}
            onChange={(e) => setNewItem({ ...newItem, thumbNailUrl: e.target.value })}
          />
          <Input
            placeholder="Author Name"
            value={newItem.author}
            onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
          />
          <Input
            placeholder="Profession"
            value={newItem.authorProf}
            onChange={(e) => setNewItem({ ...newItem, authorProf: e.target.value })}
          />
          <Textarea
            placeholder="Write description..."
            value={newItem.authorDesc}
            onChange={(e) => setNewItem({ ...newItem, authorDesc: e.target.value })}
          />
          <Button onClick={handleAdd} className="w-fit">
            Add Aspirant
          </Button>
        </CardContent>
      </Card>

      {/* Aspirant List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aspirants.map((item) => (
          <Card key={item._id} className="hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={getEmbedUrl(item.VideoUrl)}
                title="Aspirant Video"
                allowFullScreen
              />
            </div>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">{item.author}</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setEditItem(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  {editItem?._id === item._id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Aspirant</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-3">
                        <Input
                          placeholder="YouTube Video Link"
                          value={editItem.VideoUrl}
                          onChange={(e) => setEditItem({ ...editItem, VideoUrl: e.target.value })}
                        />
                        <Input
                          placeholder="Thumbnail URL"
                          value={editItem.thumbNailUrl}
                          onChange={(e) => setEditItem({ ...editItem, thumbNailUrl: e.target.value })}
                        />
                        <Input
                          placeholder="Author"
                          value={editItem.author}
                          onChange={(e) => setEditItem({ ...editItem, author: e.target.value })}
                        />
                        <Input
                          placeholder="Profession"
                          value={editItem.authorProf}
                          onChange={(e) => setEditItem({ ...editItem, authorProf: e.target.value })}
                        />
                        <Textarea
                          placeholder="Description"
                          value={editItem.authorDesc}
                          onChange={(e) => setEditItem({ ...editItem, authorDesc: e.target.value })}
                        />
                        <Button onClick={handleEdit}>Save Changes</Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <img
                src={item.thumbNailUrl}
                alt={item.author}
                className="rounded-md border w-full h-40 object-cover"
              />
              <p className="text-sm font-medium text-foreground">{item.authorProf}</p>
              <p className="text-sm text-muted-foreground">{item.authorDesc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AspirantsParentsPage
