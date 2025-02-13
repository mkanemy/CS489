
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingView from './views/landingView/LandingView'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<LandingView />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
