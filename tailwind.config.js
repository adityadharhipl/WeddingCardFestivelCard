/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx,jsx}',
    './components/**/*.{js,ts,tsx,jsx}',
    './pages/**/*.{js,ts,tsx,jsx}',
    './src/**/*.{js,ts,tsx,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark palette from user
        background: '#0b0c10',
        foreground: '#ffffff',
        surface: '#ffffff0a',
        night: '#1a1c23',
        "ink-soft": '#ffffffb8',
        "border-soft": '#ffffff1f',
        "shadow-soft": '0 30px 80px #00000080',
      },
      borderRadius: {
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
