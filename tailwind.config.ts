import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {"spacing-sm":"0.75rem","touch-target-min":"3rem","spacing-xs":"0.5rem","spacing-xl":"2rem","spacing-4xs":"0.125rem","spacing-2xs":"0.375rem","screen-padding-mobile":"1rem","spacing-3xs":"0.25rem","spacing-3xl":"3rem","spacing-lg":"1.5rem","spacing-2xl":"2.5rem","screen-padding-tablet":"1.5rem","spacing-md":"1rem","screen-padding-desktop":"2rem"},
      fontFamily: {"title-sm":["Inter"],"body-lg":["Inter"],"body-sm":["Inter"],"label-sm":["Inter"],"headline-md":["Plus Jakarta Sans"],"label-md":["Inter"],"display-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"label-lg":["Inter"],"body-md":["Inter"],"title-lg":["Inter"],"headline-lg-mobile":["Plus Jakarta Sans"],"display-lg":["Plus Jakarta Sans"],"title-md":["Inter"],"headline-sm":["Plus Jakarta Sans"]},
      fontSize: {"title-sm":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"600"}],"body-lg":["16px",{"lineHeight":"24px","letterSpacing":"0.01em","fontWeight":"400"}],"body-sm":["12px",{"lineHeight":"16px","letterSpacing":"0.02em","fontWeight":"400"}],"label-sm":["11px",{"lineHeight":"14px","letterSpacing":"0.05em","fontWeight":"600"}],"headline-md":["24px",{"lineHeight":"32px","letterSpacing":"0em","fontWeight":"600"}],"label-md":["12px",{"lineHeight":"16px","letterSpacing":"0.03em","fontWeight":"600"}],"display-md":["36px",{"lineHeight":"44px","letterSpacing":"-0.015em","fontWeight":"700"}],"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],"label-lg":["14px",{"lineHeight":"20px","letterSpacing":"0.01em","fontWeight":"500"}],"body-md":["14px",{"lineHeight":"20px","letterSpacing":"0.015em","fontWeight":"400"}],"title-lg":["18px",{"lineHeight":"26px","letterSpacing":"0em","fontWeight":"600"}],"headline-lg-mobile":["26px",{"lineHeight":"34px","letterSpacing":"-0.01em","fontWeight":"600"}],"display-lg":["44px",{"lineHeight":"52px","letterSpacing":"-0.02em","fontWeight":"700"}],"title-md":["16px",{"lineHeight":"24px","letterSpacing":"0.005em","fontWeight":"600"}],"headline-sm":["20px",{"lineHeight":"28px","letterSpacing":"0em","fontWeight":"600"}]},
      colors: {
        ...Object.fromEntries(Object.entries({"on-tertiary-fixed-variant":"#334f00","surface-container-lowest":"#ffffff","surface-bright":"#f9f9ff","surface-tint":"#316858","surface-dim":"#d3daef","secondary-container":"#a0f399","error-container":"#ffdad6","primary-container":"#134e3f","on-primary":"#ffffff","surface-container-high":"#e1e8fd","on-primary-container":"#86beab","inverse-primary":"#99d2be","secondary-fixed":"#a3f69c","inverse-on-surface":"#edf0ff","on-tertiary-fixed":"#121f00","surface-container":"#e9edff","outline-variant":"#bfc9c3","on-secondary-container":"#217128","on-surface":"#141b2b","on-error-container":"#93000a","on-primary-fixed-variant":"#155041","primary-fixed":"#b5efda","tertiary":"#203500","on-tertiary":"#ffffff","on-background":"#141b2b","surface-container-low":"#f1f3ff","on-secondary":"#ffffff","tertiary-fixed-dim":"#98da27","on-secondary-fixed":"#002204","surface-container-highest":"#dce2f7","secondary-fixed-dim":"#88d982","inverse-surface":"#293040","on-tertiary-container":"#85c505","on-secondary-fixed-variant":"#005312","surface":"#f9f9ff","primary-fixed-dim":"#99d2be","tertiary-fixed":"#b2f746","on-primary-fixed":"#002018","on-error":"#ffffff","error":"#ba1a1a","outline":"#707975","surface-variant":"#dce2f7","on-surface-variant":"#404945","tertiary-container":"#314d00"})),
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        ripple: "ripple 600ms linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
