"use client";

import React, { useState } from "react";
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

const UpcomingEventsPage = () => {
  const { toast } = useToast();

  const [events, setEvents] = useState([
    {
      id: 1,
      date: "15 Sept",
      title: "Masterclass: Navigating the Global Corporate Landscape",
      description:
        "Led by global CXOs, this session will cover leadership agility and market expansion strategies.",
      category: "LATEST",
      exploreLink: "#",
      applyLink: "#",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    description: "",
    category: "",
    exploreLink: "",
    applyLink: "",
  });

  const [editEvent, setEditEvent] = useState(null);

  const handleAdd = () => {
    if (
      !newEvent.date ||
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.category
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "error",
      });
      return;
    }

    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setNewEvent({
      date: "",
      title: "",
      description: "",
      category: "",
      exploreLink: "",
      applyLink: "",
    });
    toast({ title: "Added", description: "New event added successfully." });
  };

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: "Deleted", description: "Event removed successfully." });
  };

  const handleEdit = () => {
    setEvents(events.map((e) => (e.id === editEvent.id ? editEvent : e)));
    setEditEvent(null);
    toast({ title: "Updated", description: "Event updated successfully." });
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
                  <SelectItem value="Exam">Exam</SelectItem>
                  <SelectItem value="Admission">Admission</SelectItem>
                  <SelectItem value="Holiday">Holiday</SelectItem>
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

            {/* Event Title Input */}
            <Input
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="w-full"
            />

          <Textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
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
                title={event.title}
              >
                {event.title}
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
                  {editEvent?.id === event.id && (
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-3">
                        {editEvent?.id === event.id && (
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
                              <SelectItem value="Exam">Exam</SelectItem>
                              <SelectItem value="Admission">
                                Admission
                              </SelectItem>
                              <SelectItem value="Holiday">Holiday</SelectItem>
                              {/* Add more categories as needed */}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          placeholder="Title"
                          value={editEvent.title}
                          onChange={(e) =>
                            setEditEvent({
                              ...editEvent,
                              title: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Description"
                          value={editEvent.description}
                          onChange={(e) =>
                            setEditEvent({
                              ...editEvent,
                              description: e.target.value,
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
                  onClick={() => handleDelete(event.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {event.date} • {event.category}
              </p>
              <p className="text-sm">{event.description}</p>
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
