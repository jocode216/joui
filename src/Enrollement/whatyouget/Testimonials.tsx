import React from "react";
import "./testimonials.css";

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Samuel T.",
      quote:
        "Went from civil engineering to junior developer at Dashen Bank in 4 months. Finally understood how to connect frontend and backend properly.",
    },
    {
      id: 2,
      name: "Meron A.",
      quote:
        "The 1-on-1 mentorship made all the difference. I was stuck after bootcamp but now I can build complete applications from scratch.",
    },
    {
      id: 3,
      name: "Daniel K.",
      quote:
        "Finally learned professional project structure and deployment. My portfolio now has real, working applications that impressed employers.",
    },
    {
      id: 4,
      name: "Hana S.",
      quote:
        "The practical approach helped me understand the 'why' behind the code. No more just copying tutorials without understanding.",
    },
    {
      id: 5,
      name: "Yonas M.",
      quote:
        "From knowing pieces to building complete apps. The mentorship filled all the gaps my bootcamp missed.",
    },
    {
      id: 6,
      name: "Eyerus K.",
      quote:
        "The deployment guidance was priceless. I now have 3 live projects on my portfolio that actually work.",
    },
  ];

  // Duplicate the testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="testimonials-section">
      <h2>What My Students Say</h2>
      {/* <p className="testimonials-subtitle">
        Bootcamp graduates who bridged the gap
      </p> */}

      <div className="testimonials-container">
        <div className="testimonials-track">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="testimonial-card"
            >
              <div className="testimonial-header">
                <h4>{testimonial.name}</h4>
              </div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
