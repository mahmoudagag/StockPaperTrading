import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Text,
  DonutChart,
  Legend,
  Divider,
  AreaChart,
} from "@tremor/react";
import GlobalContext from "../ContextWrapper";

export default function Home() {
  const [donutChartData, setDonutChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [sectorCategories, setSectorCategories] = useState(null);


  const { dashboardData, user } = useContext(GlobalContext);

  useEffect(() => {
    // setup donut chart
    if(dashboardData !== null){
      if (donutChartData === null){
        var tmpDonuteCart = []
        var tmpSectorCategories = []
        for (const [key, value] of Object.entries(dashboardData.diversityGraph)){
          tmpDonuteCart.push({
            sector: key,
            value : parseFloat(value.toFixed(2))
          })
          tmpSectorCategories.push(key)
        }
        setDonutChartData(tmpDonuteCart)
        setSectorCategories(tmpSectorCategories)
      }
      // setup line chart
      if (lineChartData === null){
        if (dashboardData.performaceGraph.netWorthList.length  === 0 ){
          dashboardData.performaceGraph.netWorthList = new Array(dashboardData.performaceGraph.snpPrice.length).fill(0);
        }
        if(dashboardData.performaceGraph.netWorthList.length !== dashboardData.performaceGraph.snpPrice.length){
          const lengthdifference = dashboardData.performaceGraph.snpPrice.length - dashboardData.performaceGraph.netWorthList.length
          let filledInArray = new Array(lengthdifference).fill(dashboardData.performaceGraph.netWorthList[0]);
          dashboardData.performaceGraph.netWorthList = filledInArray.concat(dashboardData.performaceGraph.netWorthList)
        }
        let tmpLineData = []
        let startingNetworth = dashboardData.performaceGraph.netWorthList[0]
        let startingSNP = dashboardData.performaceGraph.snpPrice[0]
        for (let i=0; i<dashboardData.performaceGraph.netWorthList.length; i++){
          let time = new Date(dashboardData.performaceGraph.timeStamp[i] * 1000)
          let month = (1 + time.getMonth()).toString().padStart(2, '0');
          let day = time.getDate().toString().padStart(2, '0');
          tmpLineData.push({
            date: month + '/' + day,
            Networth: startingNetworth === 0 ? 0 : parseFloat((dashboardData.performaceGraph.netWorthList[i] - startingNetworth)*100/startingNetworth).toFixed(2),
            "S&P 500":  parseFloat((dashboardData.performaceGraph.snpPrice[i] - startingSNP)*100/startingSNP).toFixed(2),
          })
        }
        setLineChartData(tmpLineData)
      }
    }
  });

  const valueFormatter = (number) =>
    `$ ${Intl.NumberFormat("us").format(number).toString()}`;
  
  const percentFormat = (number) => {
    let num = number.toString() + "%"
    if (number > 0){
      num = "+" + num
    }
    return num
  }
  
  return (
    <>
    {dashboardData && <div className="w-[100%]">
      {/** Container for Data */}
      <div className="grid grid-cols-3 gap-10 ">
        <div>
          <Card
            className="mx-auto max-w-xs"
            decoration="top"
            decorationColor="indigo"
          >
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Cash
            </p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              ${parseFloat(user.cash).toFixed(2)}
            </p>
          </Card>
        </div>
        <div>
          <Card
            className="mx-auto max-w-xs"
            decoration="top"
            decorationColor="indigo"
          >
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Assets
            </p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              ${parseFloat(dashboardData.assetsWorth).toFixed(2)}
            </p>
          </Card>
        </div>

        <div>
          <Card
            className="mx-auto max-w-xs"
            decoration="top"
            decorationColor="indigo"
          >
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Networth
            </p>
            <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
              ${parseFloat(user.cash + dashboardData.assetsWorth).toFixed(2)}
            </p>
          </Card>
        </div>
      </div>

      <div>
        <Divider className="gap-0 text-center mt-10 mb-10 pl-16 pr-16"></Divider>
      </div>

      {/** Container for Charts utilzing termor */}
      <div className="grid grid-cols-2 gap-10 px-[5px]">
        <Card
          className="mx-auto max-w-xl flex flex-col"
          decoration="top"
          decorationColor="indigo"
        >
          <Text className="h-10"> Asset Allocation </Text>
          <div className="flex items-center justify-center space-x-6 text-2xl flex-auto">
            {/** Data => Look into docs (tremor) =>
             * category refers to the keys in the data dict that have the numbers
             * index refers to the keys in the data dict that have the names
             * In our case, we can have the asset name in index and the amount in the category
             */}
            {donutChartData && <DonutChart
              data={donutChartData}
              category="value"
              index="sector"
              valueFormatter={valueFormatter}
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              className="w-50 "
            /> }
            { sectorCategories && <Legend
              categories={sectorCategories}
              colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
              className="max-w-xs"
            /> }
          </div>
        </Card>
        <Card className="max-w-xl" decoration="top" decorationColor="indigo">
          {lineChartData && <AreaChart
            className="h-80"
            data={lineChartData}
            index="date"
            categories={["Networth", "S&P 500"]}
            colors={["indigo", "rose"]}
            valueFormatter={percentFormat}
            yAxisWidth={60}
            onValueChange={(v) => console.log(v)}
            showXAxis = {true}
          />}
        </Card>
      </div>
    </div>
    }
    </>
  );
}
