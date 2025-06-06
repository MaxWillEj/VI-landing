import React, { useState, useEffect, useRef, useCallback } from "react";
import { trackEvent } from "./trackEvent";
import VisaNoticeBanner from "./components/VisaNoticeBanner";
import SelfTransferGuarantee from "./components/SelfTransferGuarantee";
import HeroSection from "./components/HeroSection";
import FaqSection from "./components/FaqSection";
import IntroSection from "./components/IntroSection";
import FlipCardGrid from "./components/FlipCardGrid";
import LanguageToggle from "./components/LanguageToggle";

function SelfTransferPage() {
  const [cards, setCards] = useState([]);
  const [guaranteeContent, setGuaranteeContent] = useState(null);
  const [heroContent, setHeroContent] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [regionNotice, setRegionNotice] = useState(null);
  const [flippedStates, setFlippedStates] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [checklist, setChecklist] = useState([]);
  const [introContent, setIntroContent] = useState({});
  const [labels, setLabels] = useState({});
  const [sectionLabels, setSectionLabels] = useState({});
  const [lang, setLang] = useState(() => {
    const maybeLang = window.location.pathname.split("/")[1];
  return maybeLang && maybeLang.length === 2 ? maybeLang : "en";
    });
  const beforeRef = useRef(null);
  const duringRef = useRef(null);

  const contentMap = import.meta.glob('/src/lang/**/**/*.json');


  const loadLanguage = useCallback(async (selectedLang) => {
  try {
    const paths = [
      'hero.json',
      'intro.json',
      'faq.json',
      'cards.json',
      'labels.json',
      'sections.json',
      'notice.json',
      'guarantee.json'
    ];

    const data = await Promise.all(
      paths.map(async (file) => {
        const res = await fetch(`/lang/${selectedLang}/${file}?t=${Date.now()}`);
        if (!res.ok) throw new Error(`Failed to load ${file} for ${selectedLang}`);
        return res.json();
      })
    );

    const [hero, intro, faq, cards, labels, sections, notice, guarantee] = data;

    setHeroContent(hero.hero);
    setIntroContent(intro.intro);
    setFaqs(faq.faq);
    setCards(cards.cards);
    setLabels(labels.labels);
    setSectionLabels(sections.sections);
    setRegionNotice(notice.notice);
    setGuaranteeContent(guarantee.guarantee);
    setFlippedStates(cards.cards.map(() => false));
    setChecklist(
      JSON.parse(localStorage.getItem("selfTransferChecklist")) ||
      cards.cards.map(() => false)
    );

    trackEvent("Language Loaded", { lang: selectedLang });
  } catch (err) {
    console.warn("Fallback to English:", err);
    if (selectedLang !== "en") {
      loadLanguage("en");
    } else {
      console.error("❌ Even English content failed to load.");
    }
  }
}, []);
  useEffect(() => {
    loadLanguage(lang);
  }, [lang, loadLanguage]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    const debounceResize = debounce(handleResize, 200);
    window.addEventListener("resize", debounceResize);
    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const toggleFlip = useCallback((index, title) => {
  if (!isDesktop) {
    const updated = [...flippedStates];
    updated[index] = !updated[index];
    setFlippedStates(updated);
    trackEvent("Card Flip", {
      title,
      direction: updated[index] ? "to back" : "to front",
      device: "mobile"
    });
  }
}, [isDesktop, flippedStates]);

const toggleChecklist = useCallback((index, title) => {
  const updated = [...checklist];
  updated[index] = !updated[index];
  setChecklist(updated);
  localStorage.setItem("selfTransferChecklist", JSON.stringify(updated));
  trackEvent("Checklist Toggled", {
    title,
    checked: updated[index]
  });
}, [checklist]);

  return (
    <main className="container">
      <VisaNoticeBanner notice={regionNotice} />
      <HeroSection content={heroContent} />
      <IntroSection
        title={introContent.title}
        lead={introContent.lead}
        body={introContent.body}
      />
      <SelfTransferGuarantee content={guaranteeContent} />
      <FlipCardGrid
        sectionName={sectionLabels.before || "Before Your Trip"}
        cards={cards}
        flippedStates={flippedStates}
        checklist={checklist}
        isDesktop={isDesktop}
        toggleFlip={toggleFlip}
        toggleChecklist={toggleChecklist}
        labels={labels}
      />
      <FlipCardGrid
        sectionName={sectionLabels.during || "During Your Trip"}
        cards={cards}
        flippedStates={flippedStates}
        checklist={checklist}
        isDesktop={isDesktop}
        toggleFlip={toggleFlip}
        toggleChecklist={toggleChecklist}
        labels={labels}
      />
      <FaqSection faqs={faqs} lang={lang} />
      <LanguageToggle currentLang={lang} onChange={setLang} />
    </main>
  );
}

export default SelfTransferPage;
