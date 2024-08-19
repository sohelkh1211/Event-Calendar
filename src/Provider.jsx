import { useState, createContext } from "react"

export const GlobalContext = createContext();

const Provider = ({ children }) => {
  const [events, setEvents] = useState([]);
  console.log("Provider: ", events);

  return (
    <GlobalContext.Provider value={{
        events,
        setEvents
    }}>
        {children}
    </GlobalContext.Provider>
  )
}

export default Provider
