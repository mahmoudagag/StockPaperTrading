import { RiSearchLine } from "@remixicon/react";
import {
  Accordion,
  AccordionBody,
  AccordionList,
  Tab,
  TabGroup,
  TabList,
  TextInput,
} from "@tremor/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import GlobalContext from "../../ContextWrapper";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
  const { user, token, pages, setPage, setStockSymbol } = useContext(GlobalContext);

  const [autoComplete, setAutoComplete] = useState([]);
  const wasCalled = useRef(false);
  const [displaySettings, setDisplaySettings] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if(wasCalled.current) return;
    wasCalled.current = true;
    //event listener when clicking on text input and outside
    document.body.addEventListener("click", (event) => {
      const autoCompleteResults = document.getElementById("autoCompleteResults");
      if (autoCompleteResults === null) return;
      if (document.getElementById("searchBar").contains(event.target)) {
        autoCompleteResults.classList.remove("hidden");
      } else {
        autoCompleteResults.classList.add("hidden");
      }
      if (!document.getElementById("userName").contains(event.target)) {
        setDisplaySettings(false)
      }
    });
  },[]);

  useEffect(()=>{
    document.querySelectorAll("#stockName").forEach(el =>{
      el.addEventListener( 'click', (event)=>{
        var stockInfo = autoComplete.filter(el => el.name === event.target.textContent)
        setPage(pages.stockPage)
        setStockSymbol(stockInfo[0].symbol)
      })
    })
  },[autoComplete])

  function getAutoComplete(value) {
    if (value === "") {
      setAutoComplete([]);
      return;
    }
    setTimeout(async () => {
      // wait a second, if the search bar didn't change then send the request
      const search = document.getElementById("searchBar").value;
      if (value === search) {
        let url = `${URL}/finance/autocomplete?query=${value}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setAutoComplete(result.ResultSet.Result);
        }
      }
    }, 500);
  }
  
  function handleSignout(){
    localStorage.removeItem("Token");
    navigate("/login");
  }

  return (
    <>
      <div className="bg-[#090927] flex justify-center top-0 h-14 text-xl">
        <div className="text-start ps-8 pt-3 text-[#084B8F] font-bold ">
          Trading App
        </div>
        <div className="text-end pr-7 pt-3 text-[#084B8F] font-bold flex justify-end">
          {user && <div id="userName" onClick={() => setDisplaySettings(!displaySettings)} className="w-fit cursor-pointer">{user.username}</div>}
          <Accordion className={`z-50 fixed w-fit mt-9 right-3 ${displaySettings ? "" : "hidden"}`} defaultOpen>
            <AccordionBody onClick={handleSignout} className="flex px-5 py-1 cursor-pointer">
              <IoLogOutOutline className="w-fit h-8 text-end text-[#084B8F]" />
              <div className="py-2"> Sign Out </div>
            </AccordionBody>
          </Accordion>
        </div>
      </div>
      {/** Container for the tabs and search*/}
      <div className="py-[40px] flex flex-nowrap">
        {/** max-w-lg  */}
        <div className="items-center realtive ">
          <TabGroup
            className="max-w-lg ml-8"
            defaultIndex={pages.home}
            onIndexChange={(v) => setPage(v)}
          >
            <TabList variant="solid">
              <Tab tabIndex={pages.home}>Overview</Tab>
              <Tab tabIndex={pages.holding}>Holding</Tab>
              <Tab tabIndex={pages.activity}>Activity</Tab>
              <Tab tabIndex={pages.trending}>Trending</Tab>
            </TabList>
          </TabGroup>
        </div>
        <div className="items-center realtive ml-auto mr-8 max-w-md">
          <TextInput
            id="searchBar"
            icon={RiSearchLine}
            placeholder="Search..."
            onValueChange={(v) => getAutoComplete(v)}
            autoComplete="off"
          />
          <AccordionList
            id="autoCompleteResults"
            className="z-40 fixed max-w-md hidden"
          >
            {autoComplete.map((el) => {
              return (
                <Accordion id="stockName" key={el.name} defaultOpen>
                  <AccordionBody id="stockName" className="py-2"><div id="stockName">{el.name}</div></AccordionBody>
                </Accordion>
              );
            })}
          </AccordionList>
        </div>
      </div>
    </>
  );
}
