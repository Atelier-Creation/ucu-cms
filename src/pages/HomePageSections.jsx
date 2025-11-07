import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import bannerthumnail from "@/assets/bannerthumnail.png";
import Industrythumnail from "@/assets/Industrythumnail.png";
import Aspirantsthumbnail from "@/assets/Aspirantsthumbnail.png";
import UpcomingEventsThumbnail from "@/assets/UpcomingEventsThumbnail.png";
import { Home, PanelsTopLeft, Pencil } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const homeSections = [
  {
    id: 1,
    title: "Hero Section",
    description:
      "Displays the main hero banner with title, subtitle, and call-to-action.",
    image: bannerthumnail,
    editurl: "/pages/home/slider",
  },
  {
    id: 2,
    title: "Industry Icons",
    description:
      "Highlights popular Industry Icons Speak with Youtube video and Discription.",
    image: Industrythumnail,
    editurl: "/pages/home/industry",
  },
  {
    id: 3,
    title: "Aspirants & Parents",
    description:
      "Showcases the Aspirants & Parents Speak on the Home.",
    image: Aspirantsthumbnail,
    editurl: "/pages/home/Aspirants",
  },
  {
    id: 4,
    title: "Upcoming Events",
    description:
      "Displays Upcoming Events eg:exam,admission events with date.",
    image: UpcomingEventsThumbnail,
    editurl: "/pages/home/UpcomingEvents",
  },
//   {
//     id: 5,
//     title: "Newsletter Signup",
//     description:
//       "Encourages users to subscribe for updates, offers, or news.",
//     image: bannerImage,
//     editurl: "/pages/home/newsletter",
//   },
];

function HomePageSections() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pages/home/none">
            <PanelsTopLeft className="w-4 h-4 inline-block mr-1" />
              Pages
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Home Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <Home className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Home Page Sections
        </h1>
      </div>

      <Separator />

      {/* Section List */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {homeSections.map((section) => (
          <Card
            key={section.id}
            className="hover:shadow-md transition-shadow border-border rounded-2xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                {section.title}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(section.editurl)}
                className="flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-40 object-cover rounded-lg border border-border"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default HomePageSections;
