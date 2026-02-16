import React from 'react';
import './pricing.css';

function Pricing() {
  const pricingPlans = [
    {
      id: 1,
      name: "Self-Learning",
      price: "$30",
      period: "lifetime access",
      description: "Perfect for independent learners who prefer studying at their own pace.",
      features: [
        "Full course access (lifetime)",
        "All video lessons",
        "Written materials",
        "Downloadable resources",
        "Project source code",
        "Community forum access",
        "Certificate of completion"
      ],
      notIncluded: [
        "No mentor support",
        "No code reviews",
        "No scheduled meetings"
      ],
      buttonText: "Start Learning",
      popular: false
    },
    {
      id: 2,
      name: "Week with Mentor",
      price: "$44",
      period: "one week mentor",
      description: "Get guided support for a week to accelerate your learning.",
      features: [
        "Everything in Self-Learning",
        "7 days of mentor access",
        "2 scheduled sessions (1hr each)",
        "Code review for 2 projects",
        "Personalized feedback",
        "Email support during week",
        "Q&A sessions"
      ],
      notIncluded: [
        "No support after week ends",
        "Limited to 2 scheduled sessions"
      ],
      buttonText: "Get Mentored",
      popular: true
    },
    {
      id: 3,
      name: "Full Mentor Support",
      price: "$5",
      period: "per hour",
      description: "Comprehensive guidance with flexible scheduling for intensive learning.",
      features: [
        "Everything in Self-Learning",
        "Pay-as-you-go mentor sessions",
        "Twice weekly meetings (2hrs each)",
        "Unlimited code reviews",
        "24/7 WhatsApp support",
        "Career guidance",
        "Interview preparation",
        "Project architecture help"
      ],
      notIncluded: [
        "Hourly billing",
        "Requires scheduling in advance"
      ],
      buttonText: "Book Mentor",
      popular: false
    }
  ];

  const handleSelectPlan = (planName: string) => {
    alert(`You selected the ${planName} plan! More details coming soon.`);
  };

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Choose Your <span className="hero-highlight">Learning Path</span>
          </h1>
          <p className="hero-subtitle">
            Flexible pricing options designed for different learning styles and goals. 
            Whether you prefer independent study or guided mentorship, we have a plan for you.
          </p>
          <blockquote className="hero-quote">
            "The right support at the right time can transform your learning journey."
          </blockquote>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">
            Simple, <span className="section-highlight">Transparent Pricing</span>
          </h2>
          <p className="section-subtitle">
            No hidden fees, no complicated tiers. Choose what works best for your learning needs.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              
              <div className="card-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="card-content">
                <div className="features-section">
                  <h4 className="features-title">What's Included:</h4>
                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span className="feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="not-included-section">
                  <h4 className="not-included-title">Not Included:</h4>
                  <ul className="not-included-list">
                    {plan.notIncluded.map((item, index) => (
                      <li key={index} className="not-included-item">
                        <span className="not-included-icon">✗</span>
                        <span className="not-included-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="select-btn"
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="comparison-section">
          <h3 className="comparison-title">Plan Comparison</h3>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Self-Learning</th>
                  <th>Week with Mentor</th>
                  <th>Full Mentor Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Course Access</td>
                  <td>✓ Lifetime</td>
                  <td>✓ Lifetime</td>
                  <td>✓ Lifetime</td>
                </tr>
                <tr>
                  <td>Mentor Support</td>
                  <td>✗ None</td>
                  <td>✓ 7 days</td>
                  <td>✓ Hourly</td>
                </tr>
                <tr>
                  <td>Scheduled Sessions</td>
                  <td>✗ None</td>
                  <td>✓ 2 sessions</td>
                  <td>✓ Twice weekly</td>
                </tr>
                <tr>
                  <td>Code Reviews</td>
                  <td>✗ None</td>
                  <td>✓ 2 projects</td>
                  <td>✓ Unlimited</td>
                </tr>
                <tr>
                  <td>Direct Communication</td>
                  <td>✗ None</td>
                  <td>✓ Email only</td>
                  <td>✓ 24/7 WhatsApp</td>
                </tr>
                <tr>
                  <td>Price</td>
                  <td>$30 once</td>
                  <td>$44 once</td>
                  <td>$5/hour</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3 className="faq-title">Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I upgrade my plan later?</h4>
              <p>Yes! You can upgrade from Self-Learning to a mentor plan at any time. The $30 will be deducted from your new plan's cost.</p>
            </div>
            <div className="faq-item">
              <h4>How are mentor sessions scheduled?</h4>
              <p>After purchase, you'll receive a calendar link to book sessions based on both your and the mentor's availability.</p>
            </div>
            <div className="faq-item">
              <h4>What if I need more mentor hours?</h4>
              <p>With the hourly plan, you can purchase additional hours as needed. For the weekly plan, you can extend for another week.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a refund policy?</h4>
              <p>Self-Learning: 7-day refund. Mentor plans: 24-hour refund after first session if not satisfied.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h3 className="cta-title">Still Not Sure?</h3>
          <p className="cta-subtitle">
            Try our free HTML course first, or contact us for personalized recommendations.
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-btn primary"
              onClick={() => window.open('/html', '_blank')}
            >
              Try Free Course
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => window.open('mailto:josephteka213@gmail.com', '_blank')}
            >
              Contact for Advice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;