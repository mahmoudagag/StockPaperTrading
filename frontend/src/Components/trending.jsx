import { useContext } from "react";
import GlobalContext from "../ContextWrapper";
import { BadgeDelta, Card } from "@tremor/react";

export default function Trending() {
  const { trending, pages, setPage, setStockSymbol } = useContext(GlobalContext);

  function naviatgeStockPage(sym){
    setStockSymbol(sym)
    setPage(pages.stockPage)
  }

  return (
    <div className="grid grid-cols-5 grid-rows-3 px-16">
      {trending.map((el) => {
        return (
          <Card
            onClick={ () => naviatgeStockPage(el.symbol)}
            key={el.symbol}
            className="mx-auto max-w-xs h-128 w-128 mb-8 cursor-pointer"
            decoration="top"
            decorationColor="indigo"
          >
            <div className="flex ">
              <div>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  {el.symbol}
                </p>
                <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                  ${el.regularMarketPrice.toFixed(2)}
                </p>
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  {el.longName}
                </p>
              </div>
              <div className="flow-root">
                <BadgeDelta
                  className="float-right"
                  deltaType={
                    el.regularMarketChangePercent >= 0 ? "increase" : "decrease"
                  }
                >
                  {el.regularMarketChangePercent.toFixed(2)}%
                </BadgeDelta>
                <p className="float-right text-right mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  Asset Type: {el.typeDisp}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
