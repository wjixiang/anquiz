/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'anquiz-',
  content: [
	"./src/**/*.{ts,tsx,html}",
	"./main.ts"
  ],
  important:  '.anquiz-scope',
  theme: {
    extend: {},
  },
  plugins: [],
  outfile: './dist/styles.css'
}

