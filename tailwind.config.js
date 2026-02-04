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
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        fontSize: {
          'xs': '12.5px',
          'sm': '15px',
          'base': '16px',
          'lg': '25px',
          'xl': '34px'
        },
      }
    },
    plugins: [],
  };