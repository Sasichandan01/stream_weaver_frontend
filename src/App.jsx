// // src/App.jsx
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import useWebSocket from './hooks/useWebSocket'
// import Overview from './pages/Overview'
// import OptionDetail from './pages/OptionDetail'
// import Alerts from './pages/Alerts'

// const App = () => {
//   // Single WebSocket connection for entire app
//   useWebSocket()

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Overview />} />
//         <Route path="/option/:strike/:expiry" element={<OptionDetail />} />
//         <Route path="/alerts" element={<Alerts />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App

// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useMockWebSocket from './hooks/useMockWebSocket'  // ← Mock instead of real
import Overview from './pages/Overview'
import OptionDetail from './pages/OptionDetail'
import Alerts from './pages/Alerts'

const App = () => {
  // Use mock WebSocket until backend is ready
  useMockWebSocket()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/option/:strike/:expiry" element={<OptionDetail />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App