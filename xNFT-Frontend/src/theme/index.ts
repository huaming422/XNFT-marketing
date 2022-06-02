import { black, purple, teal, grey, red, white } from './colors';

const theme = {
  maxWidth: 1200,
  borderRadius: 8,
  color: {
    black,
    grey,
    purple,
    primary: {
      light: red[200],
      main: '#0079FF',
    },
    secondary: {
      main: teal[200],
    },
    white,
    teal,
    lineColor: '#DCDCDC',
    barBackground: '#151824',
  },
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
  topBarSize: 80,
  footerSize: 328,
};

export default theme;
