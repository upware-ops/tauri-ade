import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ComponentLibrary } from './ComponentLibrary'
import { LibraryInspector } from './LibraryInspector'
import { LibraryNavigation } from './LibraryNavigation'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProviderContext, type Theme } from '@/lib/theme-context'

export function LibraryPreview() {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () =>
      document.documentElement.classList.toggle(
        'dark',
        theme === 'dark' || (theme === 'system' && query.matches)
      )
    applyTheme()
    query.addEventListener('change', applyTheme)
    return () => query.removeEventListener('change', applyTheme)
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      <div className="library-browser-window">
        <nav
          className="library-sidebar library-browser-nav"
          aria-label={t('library.navigation.library')}
        >
          <LibraryNavigation />
        </nav>
        <div className="min-h-0 min-w-0 overflow-y-auto overscroll-contain">
          <ComponentLibrary />
        </div>
        <div className="library-sidebar library-browser-inspector">
          <LibraryInspector />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </ThemeProviderContext.Provider>
  )
}
