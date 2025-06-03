import React, { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "./trackEvent.js";
import "./HeroSection.css";

function HeroSection({ content }) {
  const sectionRef = useRef(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || hasTracked) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("Hero Section Viewed", {
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
  }, [hasTracked]);

  if (!content) return null;

  return (
    <section
      className="hero-section"
      role="banner"
      ref={sectionRef}
      aria-labelledby="hero-headline"
    >
      <div className="hero-content">
        <h1 id="hero-headline" className="hero-headline">
          {content.headline}
        </h1>
        <p className="hero-subheadline">{content.subheadline}</p>
        <a
          href={content.ctaLink}
          className="hero-cta"
          aria-label={content.ctaLabel}
          onClick={() =>
            trackEvent("Hero CTA Clicked", {
              label: content.ctaLabel,
              link: content.ctaLink,
              timestamp: new Date().toISOString()
            })
          }
        >
          {content.ctaLabel} <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}

export default HeroSection;