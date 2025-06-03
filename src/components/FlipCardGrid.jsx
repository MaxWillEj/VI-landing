import React, { useEffect, useRef, useState } from "react";
import {
  PlaneTakeoff, BadgeCheck, Briefcase, Clock,
  RefreshCw, ShieldCheck, Ban, FileText
} from "lucide-react";
import { trackEvent } from "./trackEvent.js";

const iconMap = {
  checkin: <PlaneTakeoff size={28} strokeWidth={1.5} />,
  visa: <BadgeCheck size={28} strokeWidth={1.5} />,
  pack: <Briefcase size={28} strokeWidth={1.5} />,
  plan: <Clock size={28} strokeWidth={1.5} />,
  bags: <RefreshCw size={28} strokeWidth={1.5} />,
  security: <ShieldCheck size={28} strokeWidth={1.5} />,
  cabin: <Ban size={28} strokeWidth={1.5} />,
  guarantee: <FileText size={28} strokeWidth={1.5} />
};

const labelColors = {
  Required: { bg: "#e0e7ff", color: "#1e3a8a" },
  Important: { bg: "#fef3c7", color: "#92400e" },
  Tip: { bg: "#d1fae5", color: "#065f46" },
  Obligatory: { bg: "#e0e7ff", color: "#1e3a8a" },
  Viktigt: { bg: "#fef3c7", color: "#92400e" },
  Tips: { bg: "#d1fae5", color: "#065f46" }
};

function FlipCardGrid({
  sectionName,
  cards,
  flippedStates,
  checklist,
  isDesktop,
  toggleFlip,
  toggleChecklist,
  labels
}) {
  const sectionRef = useRef(null);
  const [hasTrackedSection, setHasTrackedSection] = useState(false);
  const [seenCards, setSeenCards] = useState({}); // key: index

  // Track section viewed
  useEffect(() => {
    if (!sectionRef.current || hasTrackedSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("Card Section Viewed", {
            section: sectionName,
            timestamp: new Date().toISOString()
          });
          setHasTrackedSection(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasTrackedSection, sectionName]);

  // Track card impressions
  useEffect(() => {
    const cardElements = document.querySelectorAll(`[data-section="${sectionName}"]`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = entry.target.getAttribute("data-index");
          const title = entry.target.getAttribute("data-title");
          if (entry.isIntersecting && !seenCards[index]) {
            trackEvent("Card Impression", {
              section: sectionName,
              title,
              index,
              timestamp: new Date().toISOString()
            });
            setSeenCards((prev) => ({ ...prev, [index]: true }));
          }
        });
      },
      { threshold: 0.4 }
    );

    cardElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cards, sectionName, seenCards]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={sectionName.replace(/\s+/g, "-").toLowerCase()}
    >
      <h2 className="section-heading">{sectionName}</h2>
      <div className="grid">
        {cards
          .map((card, index) => ({ ...card, index }))
          .filter((card) => card.section === sectionName)
          .map(({ key, title, front, back, label, index }) => (
            <div
              key={index}
              data-section={sectionName}
              data-title={title}
              data-index={index}
              className={`flip-card ${
                isDesktop
                  ? checklist[index] ? "flipped" : "hover-flip"
                  : flippedStates[index] || checklist[index] ? "flipped" : ""
              }`}
              onClick={() => {
                if (!isDesktop) {
                  toggleFlip(index, title);
                  trackEvent("Card Flip", {
                    section: sectionName,
                    title,
                    direction: flippedStates[index] ? "to front" : "to back",
                    device: "mobile"
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleFlip(index, title);
                  if (!isDesktop) {
                    trackEvent("Card Flip", {
                      section: sectionName,
                      title,
                      direction: flippedStates[index] ? "to front" : "to back",
                      device: "keyboard"
                    });
                  }
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={flippedStates[index]}
              aria-label={`${title}. ${front}`}
              aria-checked={checklist[index]}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-icon">{iconMap[key]}</div>
                  <div className="card-title">{title}</div>
                  <div className="card-description">{front}</div>
                  <div
                    className="label"
                    style={{
                      backgroundColor: labelColors[label?.key]?.bg || "#f3f4f6",
                      color: labelColors[label?.key]?.color || "#111827"
                    }}
                  >
                    {label?.text}
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    {labels.whyItMatters || "Why It Matters"}
                  </div>
                  <div className="card-description">{back}</div>
                  <label className="card-checklist">
                    <input
                      type="checkbox"
                      checked={checklist[index]}
                      onChange={() => {
                        toggleChecklist(index, title);
                        trackEvent("Checklist Toggled", {
                          section: sectionName,
                          title,
                          checked: !checklist[index],
                          index
                        });
                      }}
                    />
                    <span>
                      {checklist[index]
                        ? labels.done || "Done"
                        : labels.markAsDone || "Mark as done"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default FlipCardGrid;