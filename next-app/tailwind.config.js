const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
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
      colors: {
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
        // gray Skala entfernt, nur neutral bleibt
        brand: {
          sun: 'var(--color-solar-500)',
          sunSoft: 'var(--color-solar-200)',
          graphite: '#1d2227',
          emerald: '#10b981'
        },
        surface: {
          base: 'hsl(var(--background))',
          elevated: 'rgba(255,255,255,0.85)',
          inverted: '#121518'
        }
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        pill: "9999px",
      },
      spacing: {
        '0': '0',
        '0.5': 'var(--space-1)',
        '1': 'var(--space-2)',
        '1.5': 'var(--space-3)',
        '2': 'var(--space-4)',
        '2.5': 'var(--space-5)',
        '3': 'var(--space-6)',
        '3.5': 'var(--space-7)',
        '4': 'var(--space-8)',
        '5': 'var(--space-9)',
        '6': 'var(--space-10)',
        '7': 'var(--space-12)',
        '8': 'var(--space-14)',
        '9': 'var(--space-16)',
        '10': 'var(--space-20)',
        '11': 'var(--space-24)'
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'glow': 'var(--shadow-glow)',
        'focus': '0 0 0 2px rgba(255,255,255,0.6), 0 0 0 4px rgba(244,169,0,0.55)'
      },
      screens: {
        'xs': '420px'
      },
      spacing: {
        'section-sm': '3.5rem',
        'section': '5rem',
        'section-lg': '7rem'
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
