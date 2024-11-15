/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	"./src/**/*.{ts,tsx,html}",
	"./main.ts"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  outfile: './dist/styles.css'
}

