import React from "react";
import "./sampleprice.css";

export default function SamplePricing() {
  const pricingPlans = [
    {
      name: "Self-Learning",
      price: "$30",
      period: "lifetime access",
      description:
        "Perfect for independent learners who prefer studying at their own pace.",
      features: [
        "Full course access (lifetime)",
        "All video lessons",
        "Written materials",
      ],
      buttonText: "Start Learning Now",
    },
    {
      name: "Week with Mentor",
      price: "$44",
      period: "one week mentor",
      description: "Get guided support for a week to accelerate your learning.",
      features: [
        "Everything in Self-Learning",
        "7 days of mentor access",
        "2 scheduled sessions (hr each)",
        "Code review for 2 projects",
        "Personalized feedback",
        "Email support during week",
      ],
      buttonText: "Get Mentored",
    },
    {
      name: "Full Mentor Support",
      price: "$5",
      period: "per hour",
      description:
        "Comprehensive guidance with flexible scheduling for intensive learning.",
      features: [
        "Everything in Self-Learning",
        "Pay-as-you-go mentor sessions",
        "Twice weekly meetings (2hrs each)",
        "Unlimited code reviews",
        "24/7 WhatsApp support",
        "Career guidance",
        "Interview preparation",
      ],
      buttonText: "Book Mentor",
    },
  ];

  const handleSelectPlan = (planName: string) => {
    alert(`You selected the ${planName} plan!`);
  };

  return (
    <section className="pricing-section">
      <header className="pricing-header">
        <h2>Simple, Transparent Pricing</h2>
        <p>
          Choose the learning path that fits your style. All plans include
          lifetime course access.
        </p>
      </header>

      <div className="pricing-grid">
        {pricingPlans.map((plan, index) => (
          <article key={index} className="pricing-card">
            <h3>{plan.name}</h3>
            <div className="price-display">
              <span className="price">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <p className="description">{plan.description}</p>

            <ul className="features-list">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <button
              className="select-button"
              onClick={() => handleSelectPlan(plan.name)}
            >
              {plan.buttonText}
            </button>
          </article>
        ))}
      </div>

      <footer className="pricing-footer">
        <p>
          <strong>All plans include:</strong> Lifetime course access, project
          source code, and community forum.
        </p>
        <p>
          Need help deciding?{" "}
          <a href="mailto:josephteka213@gmail.com">Contact us for advice</a>
        </p>
      </footer>
    </section>
  );
}
