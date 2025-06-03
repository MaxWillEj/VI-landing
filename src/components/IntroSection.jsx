import React, { useRef, useEffect, useState } from "react";
import { trackEvent } from "./trackEvent.js";

function IntroSection({ title, lead, body }) {
  const sectionRef = useRef(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || hasTracked) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("Intro Section Viewed", {
            title,
            timestamp: new Date().toISOString()
          });
          setHasTracked(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasTracked, title]);

  return (
    <section className="intro-section" ref={sectionRef} aria-labelledby="intro-title">
      <h1 className="section-heading" id="intro-title">{title}</h1>
      <p className="intro-lead">{lead}</p>
      {body?.map((p, i) => (
        <p className="intro-body" key={i}>{p}</p>
      ))}
    </section>
  );
}

export default IntroSection;