var SimControl = require("../simulations/SimControl")
var path = require("path")


//All routes should have form of /api/joel/...
    
module.exports = function(app) {

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "/public/index.html"))
    })

    // This is a basic api call for simulation data. In the request comes the information needed to create a simulation. 
    //The simulation is instantiated and run, and the data is sent back to the client
    app.post('/api/joel', (req, res) => {
    const {symbol, startDate, endDate, investment, strategyFuncName, strategyParams} = req.body
        const simControl = new SimControl(symbol, startDate, endDate, investment, strategyFuncName, strategyParams)
        simControl.runSimulation().then(data => {
            setTimeout(() => {
                res.json(simControl.simulationResult)    
            }, 2000)
        })
    })
}