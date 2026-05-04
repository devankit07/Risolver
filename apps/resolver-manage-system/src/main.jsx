import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { hydrateAuthFromStorage } from './bootstrapAuth.js'
import { refreshAuthFromApi } from './authRefresh.js'
import '@resolver/ui/styles.css'
import './theme.css'
import App from './App.jsx'

hydrateAuthFromStorage(store)
refreshAuthFromApi(store)

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
