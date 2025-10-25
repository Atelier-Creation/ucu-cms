import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import bannerImage from "@/assets/banner1.jpeg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Mic, GraduationCap } from "lucide-react";

const tableHead = ["Sections", "Description", "Image", "Actions"];

// ✅ Map icon strings to actual Lucide components
const iconMap = {
  Home,
  Mic,
  GraduationCap,
};

const allPagesData = [
  {
    icon: "Home",
    pageTitle: "Home Page",
    sections: [
      {
        header: "Hero Section",
        description:
          "Every program is co-created and co-delivered by academia and industry—where faculty and industry CXOs collaborate to build future-ready, job-relevant learning experiences for students.",
        image: bannerImage,
        editurl: "/pages/home/slider",
      },
      {
        header: "Full Time Programs",
        description: "Showcases reviews and experiences from our learners.",
        image: bannerImage,
        editurl: "/pages/home/slider",
      },
    ],
  },
  {
    icon: "GraduationCap",
    pageTitle: "About Page",
    sections: [
      {
        _id: "1",
        header: "Our Story",
        description:
          "We are a global learning organization focused on career transformation.",
        image: bannerImage,
        editurl: "/pages/home/slider",
      },
      {
        _id: "2",
        header: "Vision & Mission",
        description:
          "To empower professionals with relevant, hands-on learning experiences.",
        image: bannerImage,
        editurl: "/pages/home/slider",
      },
    ],
  },
  {
    icon: "Mic",
    pageTitle: "Industry Icons Speak",
    sections: [
      {
        _id: "1",
        header: "Contact Form",
        description:
          "Allows users to get in touch with the team through a simple form.",
        image: bannerImage,
        editurl: "/pages/home/slider",
      },
    ],
  },
];

function AllPageView() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-5 text-foreground">All Pages</h1>

      <Accordion type="single" collapsible>
        {allPagesData.map((page, pageIndex) => {
          const Icon = iconMap[page.icon]; // pick correct icon dynamically
          return (
            <AccordionItem
              key={pageIndex}
              value={`item-${pageIndex + 1}`}
              className="mb-2 border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="flex justify-between cursor-pointer items-center bg-muted/50 px-5 text-foreground hover:bg-muted transition">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{page.pageTitle}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-background text-foreground p-0">
                <div className="py-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableHead.map((column, index) => (
                          <TableHead key={index}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {page.sections.map((section, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {section.header}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {section.description}
                          </TableCell>
                          <TableCell>
                            <img
                              src={section.image}
                              alt="Section"
                              className="h-16 w-24 object-cover rounded-md border border-border"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(section.editurl || "/pages")
                              }
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default AllPageView;
