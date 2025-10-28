import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Pencil } from "lucide-react";

const executiveProgramsData = [
  {
    icon: "GraduationCap",
    pageTitle: "Executive Post Graduate Certificate Programmes",
    sections: [
      {
        header: "Programmes",
        submenu: [
          {
            label: "Functional Specialization",
            link: "/program/epgcp/functional-certifications",
            submenu: [
              { label: "Sales", link: "/program/epgcp/functional-certifications/sales" },
              { label: "Product Management", link: "/program/epgcp/functional-certifications/product-management" },
              { label: "Cybersecurity", link: "/program/epgcp/functional-certifications/cybersecurity" },
              { label: "Brand Management & Digital Marketing", link: "/program/epgcp/functional-certifications/bm-dm" },
              { label: "Mobility & Sustainability", link: "/program/epgcp/functional-certifications/mobility-sustainability" },
              { label: "Consulting", link: "/program/epgcp/functional-certifications/consulting" },
              { label: "Banking & Finance", link: "/program/epgcp/functional-certifications/banking-finance" },
              { label: "Business Analytics", link: "/program/epgcp/functional-certifications/business-analytics" },
              { label: "Data Science & AI", link: "/program/epgcp/functional-certifications/data-science" },
            ],
          },
        ],
      },
    ],
  },
];

function ExecutivePrograms() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">
        Executive Post Graduate Certificate Programmes
      </h1>

      <Accordion
        type="single"
        collapsible
        className="space-y-3"
        defaultValue="page-0"
      >
        {executiveProgramsData.map((page, pageIndex) => {
          const Icon = GraduationCap;
          return (
            <AccordionItem
              key={pageIndex}
              value={`page-${pageIndex}`}
              className="border border-border shadow-sm rounded-lg bg-card"
            >
              <AccordionTrigger className="flex justify-between items-center px-5 py-3 font-medium bg-muted hover:bg-muted/80 transition cursor-pointer rounded-t-lg">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5 text-primary" />}
                  <span>{page.pageTitle}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-background p-4 space-y-3 rounded-b-lg">
                {page.sections.map((section, i) => (
                  <Accordion
                    key={i}
                    type="single"
                    collapsible
                    className="border-l pl-4 space-y-2"
                    defaultValue="sub-0"
                  >
                    {section.submenu.map((sub, j) =>
                      sub.submenu ? (
                        <AccordionItem
                          key={j}
                          value={`sub-${j}`}
                          className="border-l border-border pl-3 pr-3 rounded-md bg-muted/30"
                        >
                          <AccordionTrigger className="text-sm font-medium text-left hover:text-primary flex justify-between items-center cursor-pointer">
                            <span>{sub.label}</span>
                          </AccordionTrigger>

                          <AccordionContent className="flex flex-col gap-2">
                            {sub.submenu.map((nested, k) => (
                              <div
                                key={k}
                                className="flex items-center justify-between group"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-fit text-sm font-normal text-left"
                                  onClick={() => navigate(nested.link)}
                                >
                                  {nested.label}
                                </Button>
                                <Pencil
                                  className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                                  onClick={() => navigate(nested.link)}
                                />
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <div
                          key={j}
                          className="flex items-center justify-between group"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit text-sm font-normal text-left"
                            onClick={() => navigate(sub.link)}
                          >
                            {sub.label}
                          </Button>
                          <Pencil
                            className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer opacity-80 group-hover:opacity-100"
                            onClick={() => navigate(sub.link)}
                          />
                        </div>
                      )
                    )}
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

export default ExecutivePrograms;
