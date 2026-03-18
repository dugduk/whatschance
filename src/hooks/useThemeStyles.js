import { useTheme } from '../App.jsx'

export function useThemeStyles() {
  const { theme } = useTheme()
  const d = theme === 'dark'
  return {
    bg: d ? '#0a0a0a' : '#f7f5f0',
    cardBg: d ? '#1a1a1a' : '#ffffff',
    cardBorder: d ? '#333' : '#e0ddd5',
    text: d ? '#ffffff' : '#1a1a1a',
    textMuted: d ? '#999' : '#777',
    textDim: d ? '#666' : '#aaa',
    accent: '#c8ff00',
    accentHover: '#d4ff33',
    isDark: d
  }
}
