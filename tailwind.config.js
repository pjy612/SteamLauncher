const aspectRatio = require('@tailwindcss/aspect-ratio');
const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const typography = require('@tailwindcss/typography');

/**
 * @type {import("@types/tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  content: [
    './src/render/src/**/*.{ts,html}',
    './node_modules/bootstrap/js/dist/modal.js',
    './node_modules/markdown-it/dist/markdown-it.js',
  ],
  plugins: [
    forms({
      strategy: 'class',
    }),
    typography,
    lineClamp,
    aspectRatio,
  ],
  theme: {
    extend: {
      colors: {
        primary: '#161920',
        secondary: '#1f232e',
      },
    },
  },
};
