import uiPreset from '../../packages/ui/tailwind.preset.js'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiPreset],
  content: ['./index.html', './src/**/*.{js,jsx}', '../../packages/ui/src/**/*.{js,jsx}'],
  theme: {
    extend: {
      "colors": {
        "on-secondary": "#ffffff",
        "tertiary-fixed-dim": "#ffb695",
        "primary-container": "#4f46e5",
        "tertiary-fixed": "#ffdbcc",
        "surface-bright": "#f9f9ff",
        "on-primary-fixed-variant": "#3323cc",
        "surface-dim": "#d3daef",
        "secondary-fixed": "#e1e3e4",
        "primary-fixed-dim": "#c3c0ff",
        "primary": "#3525cd",
        "on-surface-variant": "#464555",
        "outline-variant": "#c7c4d8",
        "surface-container": "#e9edff",
        "on-tertiary-container": "#ffd2be",
        "surface-container-low": "#f1f3ff",
        "surface-container-high": "#e1e8fd",
        "surface-tint": "#4d44e3",
        "surface": "#f9f9ff",
        "secondary-fixed-dim": "#c5c7c8",
        "surface-container-highest": "#dce2f7",
        "on-secondary-fixed": "#191c1d",
        "surface-container-lowest": "#ffffff",
        "on-primary": "#ffffff",
        "on-surface": "#141b2b",
        "error": "#ba1a1a",
        "primary-fixed": "#e2dfff",
        "on-primary-fixed": "#0f0069",
        "background": "#f9f9ff",
        "outline": "#777587",
        "inverse-surface": "#293040",
        "on-background": "#141b2b",
        "tertiary-container": "#a44100",
        "on-tertiary-fixed": "#351000",
        "error-container": "#ffdad6",
        "surface-variant": "#dce2f7",
        "secondary": "#5c5f60",
        "on-secondary-fixed-variant": "#454748",
        "on-primary-container": "#dad7ff",
        "on-tertiary-fixed-variant": "#7b2f00",
        "on-error-container": "#93000a",
        "inverse-primary": "#c3c0ff",
        "secondary-container": "#e1e3e4",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "tertiary": "#7e3000",
        "inverse-on-surface": "#edf0ff",
        "on-secondary-container": "#626566"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "grid-gutter": "20px",
        "container-padding": "24px",
        "element-gap": "12px",
        "list-item-padding": "16px"
      },
      "fontFamily": {
        "label-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-xl": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"]
      },
      "fontSize": {
        "label-lg": ["14px", {"lineHeight": "20px", "fontWeight": "500"}],
        "label-sm": ["11px", {"lineHeight": "12px", "fontWeight": "600"}],
        "headline-xl": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
        "body-sm": ["12px", {"lineHeight": "16px", "fontWeight": "400"}],
        "headline-md": ["18px", {"lineHeight": "24px", "fontWeight": "600"}]
      }
    }
  }
}
