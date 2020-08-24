import React, { useState, useEffect } from 'react';
import Axios from "axios"
import ChartHandler from "../../chartComponents/ChartHandler"
import API from "../../utils/API"


export default function Colin() {

    const [data, setData] = useState([]);

    useEffect(() => {
        // params startDate, endDate, symbol, blPerc, bhPerc, slPerc, shPerc
      API.runActiveTrading("2010-08-21", "2020-02-14", "TWTR", 12, 30, 10, 20)
      // check this. 
        .then(res => {
          console.log("buyDate = " + res[0]);
          console.log("buyPrice = " + parseInt(res[1]));
           API.runMultipleSimulations([
             ["TWTR", "2010-08-21", "2020-02-14", 60000, "buyAndWait", []],
             ["TWTR", "2010-08-21", "2020-02-14", 60000, "buyLow", [res[0], parseInt(res[1])]],
    
             ])
             .then(res => {
              console.log(res)
                setData([...data, ...res])
             })
        })

    }, [])

  return (
    <div>
       {data.length > 0 ? <ChartHandler func={"decrease5Percent"} simulations={data} labels={["Buy And Wait", "Buy Low"]} borderColor={["#8A2BE2", "Red"]} fill={[false, false]} pointRadius={[0,0]} /> : "Waiting for data"}
    </div>
  )

}