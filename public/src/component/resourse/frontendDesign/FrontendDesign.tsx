import React, { useState } from "react";
import "./frontend.css";
import designResources from "./Data";

type Resource = {
  name: string;
  url: string;
  desc?: string; 
};

type ResourceCategory = {
  category: string;
  resources: Resource[];
};

// ✅ Tell TypeScript what your data looks like
const typedResources = designResources as ResourceCategory[];

const FrontendDesign: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...typedResources.map((r) => r.category)];

  const filteredResources =
    activeCategory === "All"
      ? typedResources
      : typedResources.filter((r) => r.category === activeCategory);

  return (
    <section id="design-resources" className="resources-section">
      <div className="resources-container">
        <header className="resources-header">
          <h2 className="resources-title">All Resources You Need</h2>
          <p className="resources-subtitle">
            Everything you need for learning, certification, design, and
            deployment.
          </p>
        </header>

        {/* Category Filter Buttons */}
        <div className="resources-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="resources-grid">
          {filteredResources.map((category) => (
            <div key={category.category} className="resource-card">
              <h3 className="resource-category">{category.category}</h3>
              <div className="resource-list">
                {category.resources.map((resource) => (
                  <div key={resource.name} className="resource-item">
                    <div className="resource-info">
                      <p className="resource-name">{resource.name}</p>
                      {resource.desc && (
                        <p className="resource-desc">{resource.desc}</p>
                      )}
                    </div>
                    <button
                      className="resource-btn"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      Visit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrontendDesign;
