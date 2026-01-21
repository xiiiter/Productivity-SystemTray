// frontend/theme.ts - Sistema de temas escalável e profissional

export interface Theme {
  name: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
    active: string;
    modal: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };
  accent: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    glow: string;
    glowStrong: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    divider: string;
  };
  shadow: {
    small: string;
    medium: string;
    large: string;
    glow: string;
  };
  animation: {
    timing: string;
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
  };
}

export const lightTheme: Theme = {
  name: 'light',
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f7',
    tertiary: '#e8e8ed',
    hover: '#f0f0f5',
    active: '#e5e5ea',
    modal: 'rgba(255, 255, 255, 0.98)',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  text: {
    primary: '#1d1d1f',
    secondary: '#6e6e73',
    tertiary: '#86868b',
    disabled: '#c7c7cc',
    inverse: '#ffffff',
  },
  accent: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    glow: 'rgba(0, 122, 255, 0.25)',
    glowStrong: 'rgba(0, 122, 255, 0.4)',
  },
  border: {
    primary: '#d2d2d7',
    secondary: '#e5e5ea',
    focus: '#007AFF',
    divider: 'rgba(0, 0, 0, 0.1)',
  },
  shadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    large: '0 8px 32px rgba(0, 0, 0, 0.16)',
    glow: '0 0 20px rgba(0, 122, 255, 0.3)',
  },
  animation: {
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  background: {
    primary: '#000000',
    secondary: '#1c1c1e',
    tertiary: '#2c2c2e',
    hover: '#2c2c2e',
    active: '#3a3a3c',
    modal: 'rgba(28, 28, 30, 0.98)',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#98989d',
    tertiary: '#636366',
    disabled: '#48484a',
    inverse: '#000000',
  },
  accent: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',
    glow: 'rgba(10, 132, 255, 0.3)',
    glowStrong: 'rgba(10, 132, 255, 0.5)',
  },
  border: {
    primary: '#38383a',
    secondary: '#48484a',
    focus: '#0A84FF',
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  shadow: {
    small: '0 2px 8px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.4)',
    large: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(10, 132, 255, 0.4)',
  },
  animation: {
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;