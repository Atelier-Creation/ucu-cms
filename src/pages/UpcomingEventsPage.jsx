"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Trash2, Pencil, PanelsTopLeft, CalendarDays } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";
import { DatePicker } from "../components/ui/DatePicker";
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from "@/Api/UpcommingEventsApi";
const UpcomingEventsPage = () => {
  const { toast } = useToast();

  const [events, setEvents] = useState([]);

  const [newEvent, setNewEvent] = useState({
    date: "",
    category: "",
    eventTitle: "",
    eventDesc: "",
    exploreLink: "",
    applyLink: "",
  });

  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllEvents()
        setEvents(res.data || res)
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch data" })
      }
    }
    fetchData()
  }, [])

  const handleAdd = async () => {
    const { date, category, eventTitle, eventDesc, exploreLink, applyLink } = newEvent
    if (!date || !category || !eventTitle || !eventDesc || !exploreLink || !applyLink) {
      toast({ title: "Error", description: "All fields are required" })
      return
    }
    try {
      const res = await createEvent(newEvent)
      setEvents([...events, res.data || res])
      setNewEvent({
        date: "",
        category: "",
        eventTitle: "",
        eventDesc: "",
        exploreLink: "",
        applyLink: "",
      })
      toast({ title: "Success", description: "Data added successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add data" })
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id)
      setEvents(events.filter((data) =>
        data._id !== id
      ))
      toast({ title: "Success", description: "Data deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete data" })
    }
  };

  const handleEdit = async () => {
    try {
      const res = await updateEvent(editEvent._id, editEvent)
      setEvents(events.map((data) =>
        data._id === editEvent._id ? res.data || res : events
      ))
      toast({ title: "Success", description: "Data updated  successfully" })
      setEditEvent(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to update data" })
    }
  };

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
            <BreadcrumbPage>Upcoming Events</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" /> Upcoming Events
          Management
        </h1>
      </div>

      <Separator />

      {/* Add Form */}
      <Card className="border-border rounded-xl">
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="flex flex-col">
              <DatePicker
                value={newEvent.date}
                onChange={(date) => setNewEvent({ ...newEvent, date })}
              />
            </div>
            {/* Category Dropdown */}
            <div className="flex flex-col w-full">
              <Select
                value={newEvent.category}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, category: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="admission">Admission</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Title Input */}
          <Input
            placeholder="Event Title"
            value={newEvent.eventTitle}
            onChange={(e) =>
              setNewEvent({ ...newEvent, eventTitle: e.target.value })
            }
            className="w-full"
          />

          <Textarea
            placeholder="Event Description"
            value={newEvent.eventDesc}
            onChange={(e) =>
              setNewEvent({ ...newEvent, eventDesc: e.target.value })
            }
          />
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              placeholder="Explore Link (optional)"
              value={newEvent.exploreLink}
              onChange={(e) =>
                setNewEvent({ ...newEvent, exploreLink: e.target.value })
              }
            />
            <Input
              placeholder="Apply Now Link (optional)"
              value={newEvent.applyLink}
              onChange={(e) =>
                setNewEvent({ ...newEvent, applyLink: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAdd} className="w-fit">
            Add Event
          </Button>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-all">
            <CardHeader className="flex items-center justify-between pb-2">
              <CalendarDays className="w-12 h-12 text-muted-foreground inline-block" />
              <CardTitle
                className="text-base font-semibold flex items-center gap-2 truncate"
                title={event.eventTitle}
              >
                {event.eventTitle}
              </CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditEvent(event)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  {editEvent?._id === event._id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-3">
                        {editEvent?._id === event._id && (
                          <DatePicker
                            value={editEvent.date}
                            onChange={(date) =>
                              setEditEvent({ ...editEvent, date })
                            }
                          />
                        )}

                        <div className="flex flex-col">
                          <Label>Category</Label>
                          <Select
                            value={editEvent.category}
                            onValueChange={(value) =>
                              setEditEvent({ ...editEvent, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exam">Exam</SelectItem>
                              <SelectItem value="admission">
                                Admission
                              </SelectItem>
                              <SelectItem value="holiday">Holiday</SelectItem>
                              {/* Add more categories as needed */}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          placeholder="Title"
                          value={editEvent.eventTitle}
                          onChange={(e) =>
                            setEditEvent({
                              ...editEvent,
                              eventTitle: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Description"
                          value={editEvent.eventDesc}
                          onChange={(e) =>
                            setEditEvent({
                              ...editEvent,
                              eventDesc: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Explore Link"
                          value={editEvent.exploreLink}
                          onChange={(e) =>
                            setEditEvent({
                              ...editEvent,
                              exploreLink: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Apply Link"
                          value={editEvent.applyLink}
                          onChange={(e) =>
                            setEditEvent({
                              ...editEvent,
                              applyLink: e.target.value,
                            })
                          }
                        />
                        <Button onClick={handleEdit}>Save Changes</Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(event._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {event.date} • {event.category}
              </p>
              <p className="text-sm">{event.eventDesc}</p>
              <div className="flex gap-2 mt-2">
                {event.exploreLink && (
                  <Button variant="outline" asChild>
                    <a href={event.exploreLink}>Explore</a>
                  </Button>
                )}
                {event.applyLink && (
                  <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <a href={event.applyLink}>Apply Now</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsPage;
