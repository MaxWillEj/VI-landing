function LanguageToggle({ currentLang, onChange }) {
  return (
    <div className="language-toggle">
      <button
        onClick={() => onChange("en")}
        className={currentLang === "en" ? "active" : ""}
      >
        EN
      </button>
      <button
        onClick={() => onChange("sv")}
        className={currentLang === "sv" ? "active" : ""}
      >
        SV
      </button>
    </div>
  );
}
export default LanguageToggle;