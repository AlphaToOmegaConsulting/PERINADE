import type { VisitThemeTokens } from "../types/visits";

/**
 * Shared visits page theme — CSS tokens identical across all locales.
 * Kept in code (not CMS) per project convention.
 */
export const visitsTheme: VisitThemeTokens = {
  accent: {
    primary: "#cc8a2f",
    soft: "#f3e5d2",
    onDark: "#e4a24c"
  },
  radius: {
    sm: "0.85rem",
    md: "1.05rem",
    lg: "1.35rem",
    xl: "1.75rem"
  },
  spacing: {
    sectionDesktop: "6.35rem",
    sectionTablet: "5.2rem",
    sectionMobile: "3.95rem"
  },
  typography: {
    eyebrow: {
      fontSize: "0.74rem",
      lineHeight: "1.35",
      letterSpacing: "0.24em",
      fontWeight: 500
    },
    titleDisplay: {
      fontSize: "clamp(2.72rem, 4.75vw, 4.45rem)",
      lineHeight: "1.02",
      letterSpacing: "-0.02em",
      fontWeight: 500
    },
    titleSection: {
      fontSize: "clamp(2.15rem, 3.1vw, 3.02rem)",
      lineHeight: "1.08",
      letterSpacing: "-0.02em",
      fontWeight: 500
    },
    body: {
      fontSize: "1.01rem",
      lineHeight: "1.64",
      letterSpacing: "0",
      fontWeight: 400
    },
    caption: {
      fontSize: "0.83rem",
      lineHeight: "1.45",
      letterSpacing: "0.08em",
      fontWeight: 500
    }
  },
  stroke: {
    subtle: "rgba(44, 44, 44, 0.1)",
    strong: "rgba(44, 44, 44, 0.2)"
  }
};
