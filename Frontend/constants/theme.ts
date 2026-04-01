// Shared design tokens for the web app.

export const Palette = {
  black: "#000000",
  white: "#ffffff",

  neutral: {
    200: "#EEEEEE",
    300: "#E1E1E1",
    500: "#8E8E8E",
    600: "#4B4B4B",
    700: "#1F1F1F",
  },

  deepRaisin: {
    50: "#fdf9fd",
    100: "#f8f4f8",
    200: "#f2eef2",
    300: "#e4e0e4",
    400: "#c1bdc1",
    500: "#a29ea2",
    600: "#797579",
    700: "#656165",
    800: "#454245",
    900: "#242124",
  },

  nutmeg: {
    50: "#ffe1d3",
    100: "#f1bfb4",
    200: "#d29a90",
    300: "#b2756a",
    400: "#9b5a4f",
    500: "#833f34",
    600: "#77362e",
    700: "#77352e",
    800: "#672827",
    900: "#561a1e",
  },

  cherrywood: {
    50: "#f3e2ed",
    100: "#e3b7d2",
    200: "#d38ab5",
    300: "#c75d98",
    400: "#c23a83",
    500: "#bf0e6e",
    600: "#ae1169",
    700: "#991361",
  },

  mandarin: {
    50: "#f8eae9",
    100: "#fbcfc3",
    200: "#f9b09d",
    300: "#f89277",
    400: "#f87b5a",
    500: "#f86540",
    600: "#ed5f3c",
    700: "#df5937",
  },

  lavender: {
    50: "#e4deed",
    100: "#baaed2",
    200: "#8d79b4",
    300: "#614799",
    400: "#402387",
    500: "#150074",
    600: "#040070",
    700: "#000069",
  },

  ultraviolet: {
    50: "#e9ebf3",
    100: "#c8cce3",
    200: "#a5acd0",
    300: "#838bbc",
    400: "#6a71ae",
    500: "#5259a1",
    600: "#4b5197",
    700: "#43478b",
  },

  greenPea: {
    50: "#dbf0ff",
    100: "#b9d7e5",
    200: "#97b9cc",
    300: "#749db2",
    400: "#59879e",
    500: "#3d738c",
    600: "#31647b",
    700: "#235165",
    800: "#153e50",
  },

  appleCider: {
    50: "#e9f4e7",
    100: "#cae3c5",
    200: "#a9d2a1",
    300: "#88c17c",
    400: "#6fb461",
    500: "#58a745",
    600: "#4f993d",
    700: "#438732",
  },

  lime: {
    50: "#fbfbe7",
    100: "#f5f4c3",
    200: "#eeee9c",
    300: "#e7e776",
    400: "#e0e158",
    500: "#dcdc3b",
    600: "#cdca35",
    700: "#bbb42e",
  },

  gin: {
    50: "#dfeaeb",
    100: "#a9cdcf",
    200: "#6bafb1",
    300: "#249193",
    400: "#007c7e",
    500: "#006768",
    600: "#005d5c",
    700: "#004f4d",
  },

  danger: {
    50: "#FFFBFB",
    100: "#FEF2F2",
    200: "#FFEBEE",
    300: "#FFCCD2",
    400: "#F49898",
    500: "#EB6F70",
    600: "#F64C4C",
    700: "#EC2D30",
  },

  warning: {
    50: "#FFFDFA",
    100: "#FFF9EE",
    200: "#FFF7E1",
    300: "#FFEAB3",
    400: "#FFDD82",
    500: "#FFC62B",
    600: "#FFAD0D",
    700: "#FE9B0E",
  },

  success: {
    50: "#FBFEFC",
    100: "#F2FAF6",
    200: "#E5F5EC",
    300: "#C0E5D1",
    400: "#97D4B4",
    500: "#6BC497",
    600: "#47B881",
    700: "#0C9D61",
  },
} as const;

export const Colors = {
  dark: {
    text: Palette.white,
    textSecondary: Palette.neutral[300],
    textTertiary: Palette.neutral[500],
    background: Palette.deepRaisin[900],
    backgroundElevated: Palette.deepRaisin[800],
    backgroundSoft: Palette.deepRaisin[700],
    border: Palette.deepRaisin[600],
    primary: Palette.cherrywood[400],
    primaryStrong: Palette.cherrywood[500],
    primaryMuted: Palette.cherrywood[700],
    accent: Palette.mandarin[400],
    success: Palette.success[500],
  },
} as const;

export const Typography = {
  hero: { fontSize: 72, lineHeight: 0.95, letterSpacing: "-0.04em" },
  h1: { fontSize: 48, lineHeight: 1, letterSpacing: "-0.03em" },
  h2: { fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.02em" },
  subtitle: { fontSize: 18, lineHeight: 1.4, letterSpacing: "0.02em" },
  body: { fontSize: 16, lineHeight: 1.6, letterSpacing: "0em" },
  bodySmall: { fontSize: 14, lineHeight: 1.6, letterSpacing: "0em" },
  accent: { fontSize: 28, lineHeight: 1, letterSpacing: "0.04em" },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const FontFamily = {
  title: "var(--font-dazzle), serif",
  subtitle: "var(--font-dazzle), serif",
  body: "var(--font-din), sans-serif",
  accent: "var(--font-neuebit), monospace",
} as const;

export const Theme = {
  colors: Colors.dark,
  typography: Typography,
  spacing: Spacing,
  fonts: FontFamily,
  maxContentWidth: 1280,
} as const;

export const themeCssVariables = {
  "--color-text": Theme.colors.text,
  "--color-text-secondary": Theme.colors.textSecondary,
  "--color-text-tertiary": Theme.colors.textTertiary,
  "--color-bg": Theme.colors.background,
  "--color-bg-elevated": Theme.colors.backgroundElevated,
  "--color-bg-soft": Theme.colors.backgroundSoft,
  "--color-border": Theme.colors.border,
  "--color-primary": Theme.colors.primary,
  "--color-primary-strong": Theme.colors.primaryStrong,
  "--color-primary-muted": Theme.colors.primaryMuted,
  "--color-accent": Theme.colors.accent,
  "--color-success": Theme.colors.success,
  "--font-title-role": Theme.fonts.title,
  "--font-subtitle-role": Theme.fonts.subtitle,
  "--font-body-role": Theme.fonts.body,
  "--font-accent-role": Theme.fonts.accent,
} satisfies Record<string, string>;
