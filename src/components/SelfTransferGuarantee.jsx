import React from "react";
import { RefreshCw, Bed, Utensils, Info } from "lucide-react";
import { trackEvent } from "./trackEvent.js";
import "./SelfTransferGuarantee.css";

const iconComponents = {
  "refresh-cw": <RefreshCw size={28} />,
  "bed": <Bed size={28} />,
  "utensils": <Utensils size={28} />,
  "info": <Info size={28} />
};

function SelfTransferGuarantee({ content }) {
  if (!content) return null;

  const handleTermsClick = () => {
    trackEvent("Clicked Guarantee Terms", {
      timestamp: new Date().toISOString()
    });
  };

  return (
    <section className="guarantee-section" aria-labelledby="guarantee-heading">
      <h2 id="guarantee-heading" className="section-heading">{content.heading}</h2>
      <p className="guarantee-lead">{content.lead}</p>

      <ul className="guarantee-items">
        {content.items.map((item, i) => (
          <li className="guarantee-item" key={i}>
            <div className="guarantee-icon">{iconComponents[item.icon]}</div>
            <div className="guarantee-text">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="guarantee-note">{content.note}</p>
      <a
        href={content.linkUrl}
        className="guarantee-link"
        onClick={handleTermsClick}
      >
        {content.linkText}
      </a>
    </section>
  );
}

export default SelfTransferGuarantee;