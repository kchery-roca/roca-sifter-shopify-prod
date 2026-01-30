module.exports = {
    content: [
      './layout/*.liquid',
      './templates/**/*.liquid',
      './sections/*.liquid',
      './snippets/*.liquid',
    ],
    prefix: 'tw-',
    corePlugins: {
      preflight: false,
    },
    theme: {
      extend: {},
    },
    plugins: [],
  };