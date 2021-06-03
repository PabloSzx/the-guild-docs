const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: '#ff0000',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
    },
    extend: {
      colors: {
        'dark-blue': '#15AFD0',
        'light-blue': '#1CC8EE',
      },
      screens: {
        xs: '360px',
      },
      zIndex: {
        1: 1,
      },
      height: {
        4.5: '1.125rem',
      },
      width: {
        4.5: '1.125rem',
        fit: 'fit-content',
      },
      maxWidth: {
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const containerProps = {
        width: '100%',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
      };

      const newUtilities = {
        '.container-max': {
          ...containerProps,
          maxWidth: '1200px',
        },

        '.container-min': {
          ...containerProps,
          maxWidth: '1024px',
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
