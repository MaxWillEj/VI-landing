import React, { useState, useEffect, useRef } from "react";
import "./FaqSection.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import { trackEvent } from "./trackEvent.js";

function FaqSection({ faqs, lang = "en" }) {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);
  const [hasSeen, setHasSeen] = useState(false);

  const toggle = (index) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);

    if (isOpening) {
      trackEvent("FAQ Question Opened", {
        question: faqs[index].question,
        index,
        language: lang,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleCTA = () => {
    trackEvent("FAQ CTA Clicked", {
      action: "Still need help?",
      language: lang,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (!sectionRef.current || hasSeen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("FAQ Section Viewed", {
            language: lang,
            timestamp: new Date().toISOString()
          });
          setHasSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasSeen, lang]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section
      className="faq-section"
      aria-labelledby="faq-heading"
      ref={sectionRef}
    >
      <h2 id="faq-heading" className="section-heading">
        Frequently Asked Questions
      </h2>
      <ul className="faq-list">
        {faqs.map((item, index) => (
          <li key={index} className="faq-item">
            <button
              onClick={() => toggle(index)}
              className="faq-question"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {item.question}
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="faq-answer"
                role="region"
                aria-live="polite"
              >
                {item.answer}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="faq-cta">
        <p>Still need help?</p>
        <button onClick={handleCTA} className="cta-button">
          Contact Support
        </button>
      </div>
    </section>
  );
}

export default FaqSection;