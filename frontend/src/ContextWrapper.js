import { useState, createContext } from "react"

const GlobalContext = createContext()

export function ContextWrapper(props){
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [holding, setHolding] = useState(null)
    const [activity, setActivity] = useState(null)
    const [dashboardData, setDashboardData] = useState(null)
    const [trending, setTrending] = useState(null)
    const [stockSymbol, setStockSymbol] = useState("")
    const sides = {
        buy: 0,
        sell: 1,
      };
    const pages = {
        home: 0,
        holding: 1,
        activity: 2,
        trending: 3,
        loading: 4,
        stockPage: 5,
      };
    const [page, setPage] = useState(pages.loading);

    return (
        <GlobalContext.Provider value ={{
            token, 
            setToken,
            user,
            setUser,
            holding,
            setHolding,
            activity,
            setActivity,
            dashboardData,
            setDashboardData,
            trending,
            setTrending,
            sides,
            pages,
            page,
            setPage,
            stockSymbol,
            setStockSymbol
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext