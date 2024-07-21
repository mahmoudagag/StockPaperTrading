import React, { useContext, useEffect, useState } from "react";
import Header from "./Header/header.jsx";
import Home from "./home.jsx";
import Holding from "./holding.jsx";
import Activity from "./activity.jsx";
import Trending from "./trending.jsx";
import Loading from "./loading.jsx"
import StockInformationPage from "./stockpage.jsx";
import GlobalContext from "../ContextWrapper.js";
import { useNavigate } from "react-router-dom";
import BuySellModal from "./buySellModal.jsx";

export default function Dashboard() {
  const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"

  const {
    setToken,
    setUser,
    setHolding,
    setActivity,
    setDashboardData,
    setTrending,
    sides,
    pages,
    page,
    setPage,
    stockSymbol,
    setStockSymbol,
  } = useContext(GlobalContext);

  const [openModal, setOpenModal] = useState(false)
  const [side, setSide] = useState(sides.buy)
  const [loadingErrorMessage, setLoadingErrorMessage] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    if (storedToken === null) {
      navigate("/login");
    }else{
      LoginWithToken(storedToken);
    }
  },[]);

  function displayModal(stock,side){
    setOpenModal(true)
    setStockSymbol(stock)
    setSide(side)
  }

  async function LoginWithToken(storedToken) {
    await fetch(`${URL}/auth/loginAuthToken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: storedToken,
      },
    })
    .then(response => {
      if (response.ok){
        return response.json()
      }
      localStorage.removeItem("Token");
      navigate("/login");
    })
    .then(async (result) => {
      setToken(storedToken);
      setUser(result.user);
      if (await GetAllData(storedToken)){
        setPage(pages.home)
      }
    })
    .catch( () => {
      // this means the token expired (currently expires after 24 hours)
      localStorage.removeItem("Token");
      navigate("/login");
    });
  }

  async function GetAllData(token) {
    let url = `${URL}/api/getAllData`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    if (response.ok) {
      var result = await response.json();
      setUser(result.user)
      setActivity(result.activities === null ? [] : result.activities );
      setHolding(result.holdings === null ? [] : result.holdings );
      setTrending(result.trending);
      if (result.dashboard.performaceGraph.netWorthList === null){
        result.dashboard.performaceGraph.netWorthList = []
      }
      setDashboardData(result.dashboard);
      return true
    } 
    setLoadingErrorMessage("Something went wrong (probably ran out of API requests)")
    return false
  }

  return (
    <div className="h-screen dark">
      {page === pages.loading && <Loading errorMessage={loadingErrorMessage}/>}
      {page !== pages.loading && <Header />}
      {page === pages.home && <Home />}
      {page === pages.holding && <Holding displayModal={displayModal}/>}
      {page === pages.activity && <Activity />}
      {page === pages.trending && <Trending />}
      {page === pages.stockPage && <StockInformationPage displayModal={displayModal}/>}
      <BuySellModal shouldOpen={openModal} setShouldOpen={setOpenModal} side={side} setSide={setSide} getAllData={GetAllData}/>
    </div>
  );
}
