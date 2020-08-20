import Axios from "axios"

const API = {
    getActionDates(interval, startDate, endDate, symbol) {
        return Axios({
            method: "POST",
            url: "/api/simulation/getIntervalDates",
            data: {
                symbol: symbol,
                startDate: startDate,
                endDate: endDate,
                interval: interval
            }
        }).then(res => {
            return res.data
        })
    },

    runSimulation(symbol, startDate, endDate, investment, strategyFuncName, strategyParams) {
        return Axios({
            method: "POST",
            url: "/api/simulation/new",
            data: {
                symbol: symbol,
                startDate: startDate,
                endDate: endDate,
                investment: investment,
                strategyFuncName: strategyFuncName,
                strategyParams: strategyParams
            }
        }).then(res => {
            return res.data
        })
    },

    runMultipleSimulations(arr) {
        const simulations = [];
        var counter = 0;
        var finished = false;
        var API = this;
        function gatherData() {
            if (counter === arr.length) {
                return simulations
            } else {
                return API.runSimulation(...arr[counter])
                    .then(res => {
                        simulations.push(res)
                        counter += 1;
                        return gatherData()
                    })
            }
        }
        return gatherData();
    }
}

export default API