function VisaNoticeBanner({ notice }) {
  if (!notice) return null;
  return (
    <div className="region-alert" role="note">
      {notice}
    </div>
  );
}
export default VisaNoticeBanner;