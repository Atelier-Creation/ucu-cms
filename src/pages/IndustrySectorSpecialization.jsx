import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building2, Pencil } from "lucide-react";

const industrySectorData = [
  {
    icon: "Building2",
    pageTitle: "Industry Sector Specialization",
    sections: [
      {
        header: "Programs",
        submenu: [
          { label: "FinTech", link: "/program/fintech" },
          {
            label: "Global Capability Centers (GCC)",
            link: "/program/gcc",
          },
          {
            label: "Semi conductors",
            link: "/program/semi-conductors",
          },
          {
            label: "Health Care & Life Science.",
            link: "/program/hc-ls",
          },
        ],
      },
    ],
  },
];

const iconMap = { Building2 };

function IndustrySectorSpecialization() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Industry Sector Specialization
        </h1>
        <div className="ml-2 text-right">
          <Button onClick={() => navigate("/program/fulltime/create")}>
            Add Program
          </Button>
        </div>
      </div>
      <Accordion
        type="single"
        collapsible
        className="space-y-3"
        defaultValue="page-0"
      >
        {industrySectorData.map((page, pageIndex) => {
          const Icon = iconMap[page.icon];
          return (
            <AccordionItem
              key={pageIndex}
              value={`page-${pageIndex}`}
              className="border border-border shadow-sm rounded-lg bg-muted/30"
            >
              <AccordionTrigger className="flex justify-between items-center px-5 py-3 font-medium bg-muted/50 hover:bg-muted transition cursor-pointer rounded-t-lg">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-primary" />}
                  <span>{page.pageTitle}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-gray-50 p-4 space-y-3">
                {page.sections.map((section, i) => (
                  <Accordion
                    key={i}
                    type="single"
                    collapsible
                    className="border-l pl-4 space-y-2"
                  >
                    {section.submenu.map((sub, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between group"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-fit text-sm font-normal text-left cursor-pointer"
                          onClick={() => navigate(sub.link)}
                        >
                          {sub.label}
                        </Button>
                        <Pencil
                          className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                          onClick={() => navigate(sub.link)}
                        />
                      </div>
                    ))}
                  </Accordion>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default IndustrySectorSpecialization;
