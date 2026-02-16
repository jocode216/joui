// Docs.tsx
import React, { useState } from "react";
import WeekOne from "./resourse/weekone/WeekOne";
import './docs.css'
import MVCStructure from "./resourse/weektwo/WeekTwo";
import WeekThree from "./resourse/weekthree/WeekThree";
import WeekFour from "./resourse/weekfour/JWT";
import FAQ from "../faq/FAQ";
import Crud from "./resourse/crud/Crud";
import Friendly from './resourse/friendly/Friendly'
import Seo from "./resourse/site/Seo";
import PWA from "./resourse/site/PWA/PWA";
import Baas from "./resourse/baas/Baas";
import MulterDocs from "./resourse/baas/Multer";

function Docs() {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const weekTabs = [
    { id: 1, label: "Js basics", component: <WeekOne /> },
    {
      id: 2,
      label: "Project Setup",
      component: <MVCStructure />,
    },
    {
      id: 3,
      label: "Final setup",
      component: <WeekThree />,
    },
    {
      id: 4,
      label: "Using jwt and bcrypt",
      component: <WeekFour />,
    },
    {
      id: 5,
      label: "Crud Operation",
      component: <Crud />,
    },
    {
      id: 6,
      label: "Interview Question",
      component: <FAQ />,
    },
    {
      id: 7,
      label: "Exercise",
      component: <Friendly />,
    },
    {
      id: 8,
      label: "SEO",
      component: <Seo />,
    },
    {
      id: 9,
      label: "PWA",
      component: <PWA />,
    },
    {
      id: 10,
      label: "Multer",
      component: <MulterDocs />,
    },
    {
      id: 11,
      label: "BAAS",
      component: <Baas />,
    },
  ];

  return (
    <div className="docs-container disabledocs">
      {/* Week Navigation Tabs */}
      <div className="week-tabs">
        {weekTabs.map((week) => (
          <button
            key={week.id}
            className={`week-tab ${activeWeek === week.id ? "active" : ""}`}
            onClick={() => setActiveWeek(week.id)}
          >
            {week.label}
          </button>
        ))}
      </div>
      <hr />

      {/* Active Week Content */}
      <div className="week-content">
        {weekTabs.find((week) => week.id === activeWeek)?.component}
      </div>
    </div>
  );
}

export default Docs;
