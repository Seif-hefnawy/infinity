export const theme = {
  colors: {
    // القديمة
    primary: '#011E42',
    secondary: '#F8C2CD',
    background: '#FCE0E4',
    error: '#FC2546',
    success: '#22C55E',
    // الجديدة
    ruby: '#66021F',
    roseIvory: '#FFE9EC',
    white: '#FFFFFF',
    black: '#000000',
  },
  fonts: {
    heading: 'Quintessential, cursive',
    body: 'Luxurious Roman, serif',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    soft: '0 4px 20px rgba(1, 30, 66, 0.08)',
    medium: '0 8px 32px rgba(1, 30, 66, 0.12)',
    strong: '0 16px 48px rgba(1, 30, 66, 0.16)',
    glow: '0 0 40px rgba(248, 194, 205, 0.3)',
  },
  blur: {
    light: 'blur(8px)',
    medium: 'blur(16px)',
    strong: 'blur(24px)',
  },
} as const;

export type Theme = typeof theme;