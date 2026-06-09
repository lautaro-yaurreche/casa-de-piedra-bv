import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de Casa de Piedra (mantener identidad visual)
        primary: {
          DEFAULT: '#D1B16D', // Dorado principal
          dark: '#B39855',
          50: '#FAF8F3',
          100: '#F5F0E7',
          200: '#EBE1CF',
          300: '#E0D2B7',
          400: '#D6C39F',
          500: '#D1B16D',
          600: '#C5A055',
          700: '#B39855',
          800: '#8A7542',
          900: '#6B5A33',
        },
        secondary: {
          DEFAULT: '#2F4E56', // Azul oscuro/teal
          50: '#E8ECEE',
          100: '#D1D9DC',
          200: '#A3B3B9',
          300: '#758D96',
          400: '#476773',
          500: '#2F4E56',
          600: '#263E45',
          700: '#1C2F34',
          800: '#131F23',
          900: '#0A1012',
        },
        accent: {
          DEFAULT: '#1D1202', // Marrón oscuro
          50: '#F5F3F0',
          100: '#EBE7E1',
          200: '#D7CFC3',
          300: '#C3B7A5',
          400: '#AF9F87',
          500: '#9B8769',
          600: '#7A6C54',
          700: '#5A503E',
          800: '#3A3428',
          900: '#1D1202',
        },
        beige: {
          DEFAULT: '#E8D9A8', // Beige claro
          50: '#FDFCF9',
          100: '#FBF9F3',
          200: '#F7F3E7',
          300: '#F3EDDB',
          400: '#EFE7CF',
          500: '#E8D9A8',
          600: '#D4C285',
          700: '#C0AB62',
          800: '#AC9440',
          900: '#8A7633',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
