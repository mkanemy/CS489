
import { createRoot } from 'react-dom/client'
import LandingView from './views/landingView/LandingView'
import HomeView from './views/homeView/HomeView'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<LandingView />} />
        {/* TODO - SECURITY - Make sure home page is authorized page! */}
        <Route path="home" element={<HomeView />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
