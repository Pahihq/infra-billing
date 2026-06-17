import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Brand palette adopted from ascella.cloud (Mantine `brand` color).
const brand: MantineColorsTuple = [
  '#fff0fb',
  '#fbddf2',
  '#f3b8e1',
  '#ec90cf',
  '#e66ec0',
  '#e358b7',
  '#fb7be2',
  '#c83fa1',
  '#b3348f',
  '#9d287d',
];

// 'Twemoji Country Flags' must come FIRST so the polyfill renders flag emojis on
// Windows; non-flag glyphs fall through to Mulish. See main.tsx.
const FONT = "'Twemoji Country Flags', Mulish, -apple-system, Segoe UI, sans-serif";

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 8,
  autoContrast: true,
  luminanceThreshold: 0.45,
  colors: { brand },
  fontFamily: FONT,
  headings: { fontFamily: FONT },
  defaultRadius: 'md',
});
