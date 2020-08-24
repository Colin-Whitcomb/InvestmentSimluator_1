var SimControl = require("../simulations/SimControl")
var path = require("path")
const API = require("../utils/API")
const DateUtils = require("../utils/dateUtils")
const Historicals = require("../controllers/stockcontroller")

module.exports = function (app) {

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "/public/index.html"))
    })

    app.get('/api/stockdata/:symbol', (req, res) => {
        const symbol = req.params.symbol
        API.getStockData(symbol).then(response => {
            if (response.data['Error Message']) {
                res.json(null)
            }
            else {
                Historicals.findHistory(symbol).then(databaseData => {
                    if (!(databaseData)) {
                        var reversedHistoricals = response.data["Time Series (Daily)"]
                        // Remove the periods from the keys of the historical data. Mongo doesnt like the character "." in object keys.
                        var historicals = DateUtils.processHistoricals(reversedHistoricals)
                        Historicals.createHistory(symbol, historicals).then(_ => {
                            res.json(historicals)
                        })
                    }
                    else {
                        res.json(databaseData)
                    }
                })
            }

        })
    })

    // This is a basic api call for simulation data. In the request comes the information needed to create a simulation. 
    //The simulation is instantiated and run, and the data is sent back to the client
    app.post('/api/simulation/new', (req, res) => {
        const { symbol, startDate, endDate, investment, strategyFuncName, strategyParams } = req.body
        const simControl = new SimControl(symbol, startDate, endDate, investment, strategyFuncName, strategyParams)
        simControl.runSimulation().then(data => {
            res.json(simControl.simulationResult)
        })
    })

    app.post("/api/simulation/getIntervalDates", (req, res) => {
        const { symbol, startDate, endDate, interval } = req.body

        Historicals.findHistory(symbol).then(databaseData => {
            if (!databaseData) {
                API.getStockData(symbol)
                    .then(response => {
                        const reversedHistoricals = response.data["Time Series (Daily)"]
                        var historicals = DateUtils.processHistoricals(reversedHistoricals)
                        const resultDates = DateUtils.findIntervalDates(historicals, startDate, endDate, interval)
                        Historicals.createHistory(symbol, historicals).then(data => {
                            res.json(resultDates);
                        })

                    })
            }
            else {
                console.log("Grabbing from database")
                const historicals = databaseData.historicals
                const resultDates = DateUtils.findIntervalDates(historicals, startDate, endDate, interval)
                res.json(resultDates)
            }

        })
    })

    app.post("/api/simulation/getBuyDate", (req, res) => {
        const { symbol, startDate, endDate } = req.body
        console.log(req.body)
        Historicals.findHistory(symbol).then(databaseData => {
            if (!databaseData) {
                API.getStockData(symbol)
                    .then(response => {
                        const reversedHistoricals = response.data["Time Series (Daily)"]
                        var historicals = DateUtils.processHistoricals(reversedHistoricals);
                        const resultDate = DateUtils.findBuyDate(historicals, startDate, endDate);
                        Historicals.createHistory(symbol, historicals).then(data => {
                            res.json(resultDate);
                        })

                    })
            }
            else {
                console.log("Grabbing from database")
                const historicals = databaseData.historicals
                const resultDate = DateUtils.findBuyDate(historicals, startDate, endDate);
                res.json(resultDate);
            }

        })
    })

}