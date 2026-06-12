/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        'bg-1':"var(--bg-1)",
        'bg-2':"var(--bg-2)",
        'text-strong':"var(--text-strong)",
        'text-weak':"var(--text-weak)",
        'primary':"var(--primary)",
        'border':"var(--border)"
      }
    },
  },
  plugins: [],
}

