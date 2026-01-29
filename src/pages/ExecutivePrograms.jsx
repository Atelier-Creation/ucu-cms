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
            link: "/program/Executive-Post-Graduate-Certificate-Programmes/functional-certifications/1",
            submenu: [
              { label: "Sales", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/sales/2" },
              { label: "Product Management", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/product-management/3" },
              { label: "Cybersecurity", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/cybersecurity/4" },
              { label: "Brand Management & Digital Marketing", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/bm-dm/5" },
              { label: "Mobility & Sustainability", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/mobility-sustainability/6" },
              { label: "Consulting", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/consulting/7" },
              { label: "Banking & Finance", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/banking-finance/8" },
              { label: "Business Analytics", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/business-analytics/9" },
              { label: "Data Science & AI", link: "/programs/Executive-Post-Graduate-Certificate-Programmes/data-science/10" },
            ],
          },
          {
            label: "Industry Sector Specialization",
            link: "/program/Industry-Sector-Specialization",
            submenu: [
          { label: "FinTech", link: "/program/Industry-Sector-Specialization/fintech/1" },
          {
            label: "Global Capability Centers (GCC)",
            link: "/program/Industry-Sector-Specialization/gcc/2",
          },
          {
            label: "Semi conductors",
            link: "/program/Industry-Sector-Specialization/semi-conductors/3",
          },
          {
            label: "Health Care & Life Science.",
            link: "/program/Industry-Sector-Specialization/Health-Care/4",
          },
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
 <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
           Executive Post Graduate Certificate Programmes
        </h1>
        <div className="ml-2 text-right">
          <Button onClick={() => navigate('/program/fulltime/create')}>Add Program</Button>
        </div>
      </div>
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
