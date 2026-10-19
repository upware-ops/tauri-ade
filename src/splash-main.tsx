import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './i18n'
import './App.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeProvider } from './components/ThemeProvider'
import { StartupSplash } from './components/splash/StartupSplash'
import { queryClient } from './lib/query-client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <ThemeProvider>
        <StartupSplash />
      </ThemeProvider>
    </ErrorBoundary>
  </QueryClientProvider>
)
