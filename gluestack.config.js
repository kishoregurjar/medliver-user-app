import { config } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-ui/themed';

export const customConfig = createConfig({
  ...config,
  theme: {
    ...config.theme,
    fonts: {
      body: 'LexendDeca_400Regular',
      heading: 'LexendDeca_700Bold',
      mono: 'LexendDeca_300Light',
    },
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
});
