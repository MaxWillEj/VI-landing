import React, { useState } from "react";

const AccordionFallback = ({ cards }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="accordion">
      {cards.map((card, i) => (
        <div key={i} className="accordion-item">
          <button onClick={() => toggle(i)}>{card.icon} {card.title}</button>
          {openIndex === i && <div>{card.back}</div>}
        </div>
      ))}
    </div>
  );
};

export default AccordionFallback;
