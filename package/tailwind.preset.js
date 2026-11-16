const t = require("./tokens.json");
module.exports = {
  theme: { extend: {
    colors: { st: {
      bg: t.color.bg, raised: t.color.bgRaised, surface: t.color.surface,
      border: t.color.border, "border-strong": t.color.borderStrong, "border-hover": t.color.borderHover,
      text: t.color.text, soft: t.color.textSoft, dim: t.color.textDim, faint: t.color.textFaint, muted: t.color.textMuted,
      brand: t.color.brand, violet: t.color.violet, fuchsia: t.color.fuchsia,
    } },
    fontFamily: {
      display: [t.font.display, "system-ui", "sans-serif"],
      ui: [t.font.ui, t.font.base, "system-ui", "sans-serif"],
      base: [t.font.base, "system-ui", "sans-serif"],
    },
    borderRadius: { "st-lg": t.radius.lg, "st-xl": t.radius.xl, "st-2xl": t.radius["2xl"], "st-3xl": t.radius["3xl"] },
    boxShadow: { "st-card": t.shadow.card, "st-violet": t.shadow.violet, "st-cta": t.shadow.cta },
    transitionTimingFunction: { "st-out": t.ease.out, "st-card": t.ease.card, "st-spring": t.ease.spring },
  } },
};
