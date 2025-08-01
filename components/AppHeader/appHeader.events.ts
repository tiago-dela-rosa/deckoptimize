import { UIEvents, type ThemeToggledProperties } from '~/types/analytics'

export const trackThemeToggled = (fromTheme: 'light' | 'dark', toTheme: 'light' | 'dark') => {
  const userPreferences = localStorage.getItem('darkMode')
  const preference: 'light' | 'dark' | 'system' = 
    userPreferences === 'true' ? 'dark' : 
    userPreferences === 'false' ? 'light' : 'system'
  
  const eventProperties: ThemeToggledProperties = {
    from_theme: fromTheme,
    to: toTheme,
    user_preferences: preference
  }
  
  umTrackEvent(UIEvents.THEME_TOGGLED, eventProperties)
}