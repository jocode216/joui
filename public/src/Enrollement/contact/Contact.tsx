import { useState } from "react";
import "./contact.css";
import {
  FaEnvelope,
  FaPhone,
  FaTelegram,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";

function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  const contactInfo = [
    {
      id: 1,
      title: "Email",
      value: "contact@josephteka.com",
      icon: <FaEnvelope className="contact-icon" />,
      subIcon: <SiGmail className="contact-sub-icon" />,
      description: "For detailed inquiries and support, this is best way to reach me out",
      color: "#EA4335",
      copyText: "contact@josephteka.com",
    },
    {
      id: 2,
      title: "Phone",
      value: "+251721103660",
      icon: <FaPhone className="contact-icon" />,
      description: "Call or WhatsApp for immediate assistance",
      color: "#25D366",
      copyText: "+251962561350",
    },
    {
      id: 3,
      title: "Telegram",
      value: "@jocode",
      icon: <FaTelegram className="contact-icon" />,
      description: "For quick messages and direct communication",
      color: "#0088cc",
      copyText: "@jocode",
    },
  ];

  const handleCopy = (text: string, type: "email" | "phone" | "telegram") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === "phone") {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedTelegram(true);
        setTimeout(() => setCopiedTelegram(false), 2000);
      }
    });
  };

  return (
    <div className="contact-container" id="contact">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p className="contact-subtitle">
          Reach out through any of these channels. I typically respond within 24
          hours.
        </p>
      </div>

      <div className="contact-cards-grid">
        {contactInfo.map((item) => {
          const isCopied =
            (item.id === 1 && copiedEmail) ||
            (item.id === 2 && copiedPhone) ||
            (item.id === 3 && copiedTelegram);

          return (
            <div
              key={item.id}
              className="contact-card"
              style={
                {
                  "--card-color": item.color,
                } as React.CSSProperties
              }
            >
              <div className="card-header">
                <div className="icon-wrapper">
                  {item.icon}
                  {item.subIcon && (
                    <div className="sub-icon">{item.subIcon}</div>
                  )}
                </div>
                <h2 className="card-title">{item.title}</h2>
              </div>

              <div className="card-body">
                <p className="contact-value">{item.value}</p>
                <p className="contact-description">{item.description}</p>
              </div>

              <div className="card-footer">
                <button
                  className={`copy-button ${isCopied ? "copied" : ""}`}
                  onClick={() =>
                    handleCopy(
                      item.copyText,
                      item.id === 1
                        ? "email"
                        : item.id === 2
                        ? "phone"
                        : "telegram"
                    )
                  }
                >
                  {isCopied ? (
                    <>
                      <FaCheck className="copy-icon" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="copy-icon" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Contact;
