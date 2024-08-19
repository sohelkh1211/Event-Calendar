import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import EventCalendar from "./Calendar"
import Provider from "./Provider"

function App() {

  return (
    <BrowserRouter>
      <Toaster toastOptions={{
        className: 'font-bold border-[2px]',
        success: {
          duration: 2000,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
          style: {
            color: '#047857',
            borderColor: '#059669',
          },
        },
        error: {
          duration: 2000,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#FFFAEE'
          },
          style: {
            color: '#f52f2f',
            borderColor: '#EF4444',
          },
        }
      }}
      />
      <Routes>
        <Route path="/" element={<Provider><EventCalendar /></Provider>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
