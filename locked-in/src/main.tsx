
import { createRoot } from 'react-dom/client'
import LandingView from './views/landingView/LandingView'
// import ProtectedHome from './views/protectedHome/ProtectedHome'
import Home from './views/homeView/HomeView'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// toggle between protected and unprotected home by changing comments

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<LandingView />} />
        {/* TODO - SECURITY - Make sure home page is authorized page! */}
        {/* <Route path="home" element={<ProtectedHome />} /> */}
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
