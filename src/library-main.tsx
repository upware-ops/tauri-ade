import { createRoot } from 'react-dom/client'
import './i18n'
import './App.css'
import { LibraryPreview } from './components/component-library/LibraryPreview'

createRoot(document.getElementById('root') as HTMLElement).render(
  <LibraryPreview />
)
