import { Button, Dialog, DialogPanel, NumberInput, Tab, TabGroup, TabList } from "@tremor/react";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../ContextWrapper";
import { Slider } from "@mui/material";

export default function BuySellModal({shouldOpen, setShouldOpen, side, setSide, getAllData}){

    const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"

    const {token, user, holding, sides, stockSymbol} = useContext(GlobalContext)
    const [stockInformation, setStockInformation] = useState(null)
    const [buyRange,setBuyRange] = useState(0)
    const [sellRange,setSellRange] = useState(0)
    const [value, setValue] = useState(0)
    const [color,setColor] = useState(side === sides.buy ? "blue" : "rose")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect( () => {
        // Because this Modal is always mounted in the parent element, the setColor useState is only ran once.
        // Therefore the default color when opening the modal is not updated.
        // Use shouldOpen as a dependency to set the default color when opening the modal.
        if(shouldOpen){
            setColor(side === sides.buy ? "blue" : "rose")
            setValue(0)
            GetModalInformation()
        }
        else{
            setStockInformation(null)
        }
    },[shouldOpen])

    useEffect( () => {
        setColor(side === sides.buy ? "blue" : "rose")
        setValue(0)
    },[side])

    async function GetModalInformation(){
        let url = `${URL}/finance/stock?stocks=${stockSymbol}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        if (response.ok) {
            const result = await response.json();
            const info = result.res[0]
            setStockInformation({
                symbol: info.symbol,
                regularMarketPrice : info.regularMarketPrice,
                longName : info.longName
            })
            setBuyRange(Math.floor(user.cash / info.regularMarketPrice))
            for(var i = 0; i < holding.length; i++){
                if (holding[i].symbol === info.symbol){
                    setSellRange(holding[i].quantity)
                    break
                }
            }
        }
    }
    function handleSliderChange(v){
        setValue(v.target.value)
    }
    function handleInputChange(v){
        setValue(v)
    }

    async function handleTransaction(){
        if (value === 0){
            setShouldOpen(false)
            return
        }
        const url = `${URL}}/api/` + (side === sides.buy ? "buyStock" : "sellStock")
        const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({
                "quantity": value,
                "symbol": stockSymbol
              }),
          });
        if (response.ok) {
            await getAllData(token)
            // user.cash += value*stockInformation.regularMarketPrice*(side === sides.buy ? -1 : 1)
            setShouldOpen(false)
        }else{
            setErrorMessage("Something went wrong")
        }
    }

    return (
        <>
        {stockInformation && <Dialog open={shouldOpen} onClose={(val) => setShouldOpen(val)} static={true}>
            <DialogPanel>
            <TabGroup defaultIndex={side} onIndexChange={(v) => setSide(v)}>
                <TabList color={color} variant="solid">
                    <Tab value={sides.buy}>BUY</Tab>
                    <Tab value={sides.sell}>SELL</Tab>
                </TabList>
            </TabGroup>
            <div className="flex mt-4 mb-2">
                <div>
                    <p className="mb-.5 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        {stockInformation.symbol}
                    </p>
                    <p className="mb-.5 text-2xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                        ${stockInformation.regularMarketPrice}
                    </p>
                    <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        {stockInformation.longName}
                    </p>
                </div>
  
                <div className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold w-max mt-auto mb-auto">
                    {value === 0 ? "" : (side === sides.buy ? "-" : "+")}${(value*stockInformation.regularMarketPrice).toFixed(2)}
                </div>
            </div>
            <div className="flex">
                <NumberInput
                    className="w-0"
                    value = {typeof value === 'number' ? value : 0}
                    // onSubmit={function noRefCheck(){}}
                    onValueChange= {handleInputChange}
                    min={0}
                    max={side === sides.buy ? buyRange : sellRange}
                    errorMessage={side === sides.buy ? "Not enough cash" : "Not enough stock"}
                />
                <Slider value={Number(value)} onChange={handleSliderChange} className="ml-7" min={0} step={1} max={side === sides.buy ? buyRange : sellRange} style={{ color: side === sides.buy ? '#3b82f6' : '#f43f5e' }}/>
            </div>
            <Button color={color} className="mt-8 w-full" onClick={() => handleTransaction(false)}>
                {side === sides.buy ? "BUY" : "SELL"}
            </Button>
            <div>{errorMessage}</div>
            </DialogPanel>
        </Dialog>}
        </>
    )
}