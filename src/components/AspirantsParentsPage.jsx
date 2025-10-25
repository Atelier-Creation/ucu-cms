"use client"

import React, { useState } from "react"
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

const AspirantsParentsPage = () => {
  const { toast } = useToast()
  const [aspirants, setAspirants] = useState([
    {
      id: 1,
      videoUrl: "https://youtu.be/ulaQhIpWY98",
      thumbnail: "https://th.bing.com/th/id/R.3bcbeff4ee0abb81ef150c9ea7e35730?rik=t3aMo1m4uUQi6g&riu=http%3a%2f%2fwww.newdesignfile.com%2fpostpic%2f2010%2f05%2ffree-stock-photos-people_102217.jpg&ehk=vGjIrntn5QyP%2fIXY2Ei7Iiz4%2fy%2byXvP8I8j0XxemwjI%3d&risl=&pid=ImgRaw&r=0",
      author: "Vikram Sethi",
      proffection: "Chief Human Resources Officer, Global Dynamics",
      para: "UCU is cultivating the next generation of business leaders through practical, industry-focused learning.",
    },
  ])

  const [newItem, setNewItem] = useState({
    videoUrl: "",
    thumbnail: "",
    author: "",
    proffection: "",
    para: "",
  })

  const [editItem, setEditItem] = useState(null)

  const getEmbedUrl = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? `https://www.youtube.com/embed/${match[1]}` : ""
  }

  const handleAdd = () => {
    if (!newItem.videoUrl || !newItem.thumbnail || !newItem.author || !newItem.proffection || !newItem.para) {
      toast({ title: "Error", description: "Please fill all fields.", variant: "error" })
      return
    }

    setAspirants([...aspirants, { id: Date.now(), ...newItem }])
    setNewItem({ videoUrl: "", thumbnail: "", author: "", proffection: "", para: "" })
    toast({ title: "Added", description: "New aspirant added successfully." })
  }

  const handleDelete = (id) => {
    setAspirants(aspirants.filter((a) => a.id !== id))
    toast({ title: "Deleted", description: "Aspirant removed successfully." })
  }

  const handleEdit = () => {
    setAspirants(aspirants.map((a) => (a.id === editItem.id ? editItem : a)))
    setEditItem(null)
    toast({ title: "Updated", description: "Aspirant details updated successfully." })
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
            value={newItem.videoUrl}
            onChange={(e) => setNewItem({ ...newItem, videoUrl: e.target.value })}
          />
          <Input
            placeholder="Thumbnail URL"
            value={newItem.thumbnail}
            onChange={(e) => setNewItem({ ...newItem, thumbnail: e.target.value })}
          />
          <Input
            placeholder="Author Name"
            value={newItem.author}
            onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
          />
          <Input
            placeholder="Profession"
            value={newItem.proffection}
            onChange={(e) => setNewItem({ ...newItem, proffection: e.target.value })}
          />
          <Textarea
            placeholder="Write paragraph..."
            value={newItem.para}
            onChange={(e) => setNewItem({ ...newItem, para: e.target.value })}
          />
          <Button onClick={handleAdd} className="w-fit">
            Add Aspirant
          </Button>
        </CardContent>
      </Card>

      {/* Aspirant List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aspirants.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={getEmbedUrl(item.videoUrl)}
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
                  {editItem?.id === item.id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Aspirant</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-3">
                        <Input
                          placeholder="YouTube Video Link"
                          value={editItem.videoUrl}
                          onChange={(e) => setEditItem({ ...editItem, videoUrl: e.target.value })}
                        />
                        <Input
                          placeholder="Thumbnail URL"
                          value={editItem.thumbnail}
                          onChange={(e) => setEditItem({ ...editItem, thumbnail: e.target.value })}
                        />
                        <Input
                          placeholder="Author"
                          value={editItem.author}
                          onChange={(e) => setEditItem({ ...editItem, author: e.target.value })}
                        />
                        <Input
                          placeholder="Profession"
                          value={editItem.proffection}
                          onChange={(e) => setEditItem({ ...editItem, proffection: e.target.value })}
                        />
                        <Textarea
                          placeholder="Paragraph"
                          value={editItem.para}
                          onChange={(e) => setEditItem({ ...editItem, para: e.target.value })}
                        />
                        <Button onClick={handleEdit}>Save Changes</Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <img
                src={item.thumbnail}
                alt={item.author}
                className="rounded-md border w-full h-40 object-cover"
              />
              <p className="text-sm font-medium text-foreground">{item.proffection}</p>
              <p className="text-sm text-muted-foreground">{item.para}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AspirantsParentsPage
