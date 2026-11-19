import { useState, useEffect } from "react";

/**
 * Custom hooks for MainLanding 3D Experience
 */

export function useLandingLanguage() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang");
    if (saved === "ar" || saved === "en") {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("preferred_lang", next);
  };

  const isRTL = lang === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  return { lang, isRTL, dir, toggleLanguage };
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
