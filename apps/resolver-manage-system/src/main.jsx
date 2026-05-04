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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/app">
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
