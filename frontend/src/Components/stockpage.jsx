import { Tab, TabGroup, TabList, LineChart, Card, Button } from '@tremor/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import GlobalContext from '../ContextWrapper';
import Loading from './loading';

export default function StockInformationPage({displayModal}){

  const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"
  const {token, sides, stockSymbol} = useContext(GlobalContext)
  const wasCalled = useRef(false);
  const [stockInformation, setStockInformation] = useState(null)
  const [displayedChartData, setDisplayChartData] = useState({})
  const [readMore, setReadMore] = useState(true)

  useEffect( () => {
    if (wasCalled.current) return;
    getStockData()
    wasCalled.current = true;
  },[])

  async function getStockData(){
    let url = `${URL}/finance/stockPage?stock=${stockSymbol}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    const result = await response.json();
    let timeStamps = ["1d", "5d", "1mo", "6mo", "ytd", "1y", "5y", "max"]
    const chartData = timeStamps.map( (ts, i) => {
      var time = result.chartIntervals[ts].chart.result[0].timestamp.map( t => {
        let timeDate = new Date(t * 1000)
        if (i < 2){
          // convert to hour:minute
          let hour =  timeDate.getHours().toString().padStart(2, '0');
          let minute =  timeDate.getMinutes().toString().padStart(2, '0');
          return hour + ":" + minute
        }
        else if (i >= 2 && i < 5){
          // convert to day/month
          let month = (1 + timeDate.getMonth()).toString().padStart(2, '0');
          let day = timeDate.getDate().toString().padStart(2, '0');
          return month + '/' + day
        }
        else {
          // day/month/year
          let month = (1 + timeDate.getMonth()).toString().padStart(2, '0');
          let day = timeDate.getDate().toString().padStart(2, '0');
          let year = timeDate.getFullYear().toString().substring(2)
          return month + '/' + day + '/' + year
        }
      })
      var value = result.chartIntervals[ts].chart.result[0].indicators.quote[0].close.map( v => v.toFixed(2))
      return value.map( (v, i) => {
        return {
          date : time[i],
          price : v,
        }
      })
    })
    let today = new Date();
    let todayMonth = today.toLocaleString('default', { month: 'long' });
    let todayDay = today.getDate().toString().padStart(2, '0');
    let todayYear = today.getFullYear().toString()
    setStockInformation({
      price: result.stockInformation[0].regularMarketPrice,
      volume: result.stockInformation[0].regularMarketVolume,
      change: result.stockInformation[0].regularMarketChange,
      changePercent: result.stockInformation[0].regularMarketChangePercent,
      summary: result.companyInformation.quoteSummary.result[0].assetProfile.longBusinessSummary,
      chartData: chartData,
      today: todayMonth + " " + todayDay + "," + todayYear,
    })
    setDisplayChartData(chartData[0])
  }

  return (
    <>
      {stockInformation === null && <Loading></Loading>}
      { stockInformation && <div className="container mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">{stockSymbol}</h1>
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">${stockInformation.price.toFixed(2)}</h2>
            <p className="text-gray-400">{stockInformation.today}</p>
          </div>
          <div className="flex items-center w-48">
            <Button color="blue" variant="primary" onClick={() =>  displayModal(stockSymbol, sides.buy)} >
              Buy
            </Button>
          </div>
        </div>
        <Card decorationColor="indigo">
          <TabGroup
            defaultIndex={0}
            onIndexChange={(i) => setDisplayChartData(stockInformation.chartData[i])}
          >
              <TabList variant="line" defaultValue={0}>
                  <Tab value={0}>1D</Tab>
                  <Tab value={1}>5D</Tab>
                  <Tab value={2}>1M</Tab>
                  <Tab value={3}>6M</Tab>
                  <Tab value={4}>YTD</Tab>
                  <Tab value={5}>1Y</Tab>
                  <Tab value={6}>5Y</Tab>
                  <Tab value={7}>Max</Tab>
              </TabList>
          </TabGroup>
          <LineChart
            className="h-80"
            data={displayedChartData}
            index="date"
            categories={['price']}
            colors={['indigo', 'rose']}
            minValue = {Math.min(...displayedChartData.map(o => parseFloat(o.price)))}
            maxValue = {Math.max(...displayedChartData.map(o => parseFloat(o.price)))}
            xAxisLabel="Date"
            yAxisLabel="Price"    
          />
        </Card>
        <p className="text-gray-300 mt-8 mb-6">{readMore ? stockInformation.summary.substring(0, 100) : stockInformation.summary}
          <span className='text-gray-400' onClick={() => setReadMore(!readMore)}> {readMore ? "...Read More" : "Read Less"}</span>
        </p>
        <div className="flex justify-between">
          <div className="text-gray-400">
            <p>Volume</p>
            <p className="font-bold">{stockInformation.volume}</p>
          </div>
          <div className="text-gray-400">
            <p>Change</p>
            <p className={`font-bold ${stockInformation.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stockInformation.change >= 0 ? '+' : '-'}${Math.abs(stockInformation.change).toFixed(2)} ({Math.abs(stockInformation.changePercent).toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>
      }
    </>
  );
};
