module.exports = {
    content: [
      './layout/*.liquid',
      './templates/**/*.liquid',
      './sections/*.liquid',
      './snippets/*.liquid',
    ],
    prefix: 'tw-',
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    corePlugins: {
      preflight: false,
    },
    theme: {
      extend: {},
    },
    plugins: [],
  };