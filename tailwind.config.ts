import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        qurra: {
          green: '#176B4D',
          'green-light': '#2E8B67',
          'green-dark': '#0D4D38',
          navy: '#102A43',
          'navy-light': '#183E5A',
          gold: '#D6A84B',
          'gold-light': '#F2D48A',
          cream: '#FFF8E7',
          sand: '#F1E5C8',
          ink: '#153047',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'serif'],
      },
      boxShadow: {
        lantern: '0 12px 40px rgb(214 168 75 / 18%)',
        card: '0 18px 60px rgb(16 42 67 / 12%)',
      },
    },
  },
}
