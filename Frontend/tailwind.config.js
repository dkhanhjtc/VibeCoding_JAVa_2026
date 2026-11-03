/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bảng màu 8 màu chính thức của website:
        palette: {
          bg: '#f0f4f8',        // Primary Background: Nền chính của website
          light: '#a1c0d1',     // Light Blue: Nền phụ, vùng highlight nhẹ
          soft: '#6b99ab',      // Soft Blue: Màu phụ, icon, trạng thái phụ
          primary: '#3b7a8c',   // Primary Blue: Primary actions, button, link
          deep: '#2e5e73',      // Deep Blue: Hover state, heading, active elements
          darkTeal: '#1f4f5a',  // Dark Teal: Navigation, emphasis
          deepTeal: '#0f383f',  // Deep Teal: Dark sections, strong contrast
          navy: '#00203d',      // Navy: Text chính, sidebar, footer, dark elements
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 32, 61, 0.05), 0 1px 2px -1px rgba(0, 32, 61, 0.05)',
        'card': '0 4px 20px -2px rgba(15, 56, 63, 0.06)',
        'floating': '0 10px 25px -3px rgba(0, 32, 61, 0.08), 0 4px 6px -2px rgba(0, 32, 61, 0.04)',
        'elevated': '0 14px 35px -5px rgba(0, 32, 61, 0.12)',
      }
    },
  },
  plugins: [],
}
