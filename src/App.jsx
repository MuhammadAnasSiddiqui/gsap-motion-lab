import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import LabIndex from './pages/LabIndex'
import CambridgeHome from './pages/CambridgeHome'

// Start each route at the top; the sections set up their own ScrollTriggers
// on mount and tear them down on unmount.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* <Route path="/" element={<LabIndex />} /> */}
        <Route path="/" element={<CambridgeHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
