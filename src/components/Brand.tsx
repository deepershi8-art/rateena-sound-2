import { useEffect } from "react";
import { Link } from "react-router-dom";
// The first official asset placed in this slot is used unchanged. No generated logo.
const officialAssets = import.meta.glob<string>(
  "../assets/logo/*.{jpg,jpeg,png,webp,svg}",
  { eager: true, query: "?url", import: "default" },
);
const official = Object.values(officialAssets)[0];
export function OfficialLogo({ className = "" }: { className?: string }) {
  return official ? (
    <img
      className={className}
      src={official}
      alt="Official RATEENA SOUND logo"
    />
  ) : (
    <span>RATEENA SOUND</span>
  );
}
export function Brand() {
  useEffect(() => {
    if (!official) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.append(link);
    }
    link.href = official;
  }, []);
  return (
    <Link
      to="/"
      className={`wordmark ${official ? "official-brand" : ""}`}
      aria-label="RATEENA SOUND 2 home"
    >
      {official ? (
        <>
          <img src={official} alt="Official RATEENA SOUND logo" />
          <div className="brand-edition">
            <span>2</span>
            <small>ENGINEERING & DESIGN WORKSPACE</small>
          </div>
        </>
      ) : (
        <>
          <span>
            RATEENA SOUND<span className="wordmark-two">2</span>
          </span>
          <small>ENGINEERING & DESIGN WORKSPACE</small>
        </>
      )}
    </Link>
  );
}
