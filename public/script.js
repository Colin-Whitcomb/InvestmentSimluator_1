
// A basic API call which shows that a simulation can be created using these API routes. 
// Run the server in the server.js file and open localhost:3000 to see the result in the console

$.ajax({
    method: "POST",
    url: "/api/joel",
    data: {
        symbol: 'AAPL',
        startDate: "2005-01-03",
        endDate: "2020-06-01",
        investment: 10000,
        strategyFuncName: "stateTaxAffect",
        strategyParams: [13, 0]
    }
}).then(result => {
    console.log(result)

    // logic goes here
})
