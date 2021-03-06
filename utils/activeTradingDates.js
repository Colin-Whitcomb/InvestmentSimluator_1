const DateUtils = require("../utils/dateUtils")

module.exports = function activeTrading(stockData, startDate, endDate, symbol, blPerc, bhPerc, slPerc, shPerc) {
    var dateArr = Object.keys(stockData);
    // var dateArr = [];
    var buying = true;
    const buyDateArr = [];
    const sellDateArr = [];
    var buyPrice;
    var blPerc = eval(blPerc);
    var bhPerc = eval(bhPerc);
    var slPerc = eval(slPerc);
    var shPerc = eval(shPerc);

    console.log('dateArr leng = ' + dateArr.length);
    console.log('dateArr 0 = ' + dateArr[0]);

    // goes through all dates to buy or sell
    for (var i=0; i < dateArr.length; i++) {
        if (buying) {
            console.log("dateArr leng " + dateArr.length);
            console.log("activeTrading date Arr = " + dateArr[i])
            nextBuyDate(dateArr)

        } else {
            findSellDate(dateArr)
            console.log("dateArr leng " + dateArr.length);

        }

        function nextBuyDate(dateArr) {
            var date1 = findDateBuyLow(stockData, dateArr, blPerc)[0];
            var date2 = findDateBuyHigh(stockData, dateArr, bhPerc)[0];

            var buyPrice1 = findDateBuyLow(stockData, dateArr, slPerc)[1];
            var buyPrice2 = findDateBuyHigh(stockData, dateArr, slPerc)[1];

            var date1NoDash = eval(DateUtils.removeDateDashes(date1));
            var date2NoDash = eval(DateUtils.removeDateDashes(date2));


            if (date1NoDash < date2NoDash) {
                buyDateArr.push(date1);
                console.log("pushing " + date1 + " into buyDateArr. date1 BUYLOW");
                buyPrice = buyPrice1;
                dateArr = fastForwardHistory(dateArr, date1);
                buying = false;
            }
            else {
                buyDateArr.push(date2);
                console.log("pushing " + date2 + " into buyDateArr. date2 BUYHIGH");
                buyPrice = buyPrice2;
                dateArr = fastForwardHistory(dateArr, date2);
                // console.log("adjusted DateArr = " + dateArr);
                buying = false;
            }
        }

        function findSellDate(dateArr) {
            var date1 = findDateSellLow(stockData, dateArr, slPerc);
            var date2 = findDateSellHigh(stockData, dateArr, shPerc, buyPrice);

            var date1NoDash = DateUtils.removeDateDashes(date1);
            var date2NoDash = DateUtils.removeDateDashes(date2);

            if (date1NoDash < date2NoDash) {
                sellDateArr.push(date1)
                console.log("pushing " + date1 + " into sellDateArr. date1 SELL LOW");
                dateArr = fastForwardHistory(dateArr, date1)
                buying = true
            }
            else {
                sellDateArr.push(date2)
                console.log("pushing " + date2 + " into sellDateArr. date2 SELL HIGH");
                dateArr = fastForwardHistory(dateArr, date2)
                buying = true
            }


        }

        function fastForwardHistory(dateArr, date) {
            const indexOfDate = dateArr.indexOf(date);
            console.log("ff index of Date = " + indexOfDate);
            dateArr.splice(0, (parseInt(indexOfDate)));
            console.log('ff dateArr leng = ' + dateArr.length);
            return dateArr;
        }

        // takes in an integer (5) and returns the decimal equivalent subtracted from 100% (.95)
        function calcPercentChangeDown(percent) {
            var firstStep = 100 - percent;
            var secondStep = firstStep * 0.01;
            return secondStep;
        }

        // takes in an integer (10) and returns the decimal equivalent added to 100% (1.10)
        function calcPercentChangeUp(percent) {
            var firstStep = 100 + percent;
            var secondStep = firstStep * 0.01;
            return secondStep;
        }

        // 100 , 20 
        function calcSellPrice(highPrice, percentDecrease) {

            // integer of 20(%) returns 0.80
            var percentOf = calcPercentChangeDown(percentDecrease);
            // 100 * 0.8 = 80;
            var sellPrice = (highPrice * percentOf).toFixed(2);
            return sellPrice;

        }

        // function takes in date range - returns date to buy when stock value has decreased a specified percentage
        function findDateBuyLow(stockData, dateArr, percentDecrease) {
            // console.log("activeTradingDates percent = " + parseInt(percentDecrease));
            // console.log('findBuyDateLow running');
            var highPrice = 0;
            var buyPrice;
            // const dateArr = dateArr;

            var percentOf = calcPercentChangeDown(percentDecrease);
            //    console.log('percentOf dateUtils = ' + percentOf);

            // iterate through dates
            for (const date of dateArr) {

                // find the price for each day
                const currentPrice = eval(stockData[date]["markPrice"]);
                // console.log('currentDay = ' + date + ' currentPrice = ' + currentPrice + ' highPrice = ' + highPrice + ' buyPrice = ' + buyPrice);

                // if that price is greater than the previous day, make new high
                if (currentPrice > highPrice) {
                    highPrice = currentPrice;
                    buyPrice = (highPrice * percentOf).toFixed(2);
                }

                // if the current price is 5% less than high price - push date
                if (currentPrice <= buyPrice) {
                    // console.log('Buy Low currentDay = ' + date + ' currentPrice = ' + currentPrice + ' buyPrice = ' + buyPrice);

                    // once it finds the first dip date, stop searching
                    // console.log("buy date Utils = " + date);
                    return [date, buyPrice];
                }

            }
            return [endDate, buyPrice];
        }

        // function takes in date range - returns date to buy when stock value has increased a specified percentage
        function findDateBuyHigh(stockData, dateArr, priceIncrease) {
            var startPrice = eval(stockData[dateArr[0]].markPrice);
            var highPrice = 0;
            var percentOf = calcPercentChangeUp(priceIncrease);
            var buyPrice = (startPrice * percentOf).toFixed(2);
            console.log("activeTradeDate buy Price = " + buyPrice);
            // const dateArr = dateArr;

           
            // console.log('percentOf dateUtils = ' + percentOf);

            // iterate through dates
            for (const date of dateArr) {

                // find the price for each day
                const currentPrice = eval(stockData[date]["markPrice"]);
                // console.log('currentDay = ' + date + ' currentPrice = ' + currentPrice + ' highPrice = ' + highPrice + ' buyPrice = ' + buyPrice);


                // if the current price is 5% more than high price - push date
                if (currentPrice >= buyPrice) {

                    // console.log('Buy High currentDay = ' + date + ' currentPrice = ' + currentPrice + ' buyPrice = ' + buyPrice);
                    // once it finds the first dip date, stop searching

                    return [date, buyPrice];
                }

            }
            return [endDate, buyPrice];
        }

        // function takes in date range - returns date to buy when stock value has decreased a specified percentage
        function findDateSellLow(stockData, dateArr, percentDecrease) {
            var highPrice = 0;
            var sellPrice;
            // var startPrice = eval(stockData[dateArr[0]].markPrice); 
            // const dateArr = dateArr;

            // iterate through dates
            for (const date of dateArr) {

                // find the price for each day
                const currentPrice = eval(stockData[date]["markPrice"]);


                // if sets highPrice and sell Price
                if (currentPrice > highPrice) {
                    highPrice = currentPrice;
                    sellPrice = calcSellPrice(highPrice, percentDecrease);
                }

                // if the current price is 5% less than high price - push date
                if (currentPrice <= sellPrice) {
                    // once it finds the first dip date, stop searching
                    console.log('Sell Low currentDay = ' + date + ' currentPrice = ' + currentPrice + ' sellPrice = ' + sellPrice + ' & highPrice = ' + highPrice);
                    return date;
                }

            }
            return endDate;
        }

        // function takes in date range - returns date to buy when stock value has decreased a specified percentage
        function findDateSellHigh(stockData, dateArr, percentIncrease, buyPrice) {
            var sellPrice = 0;

            // input 20(%), returns 1.20
            var percentOf = calcPercentChangeUp(percentIncrease);

            // 100 * 1.2 = 120 (sell!);
            var sellPrice = (buyPrice * percentOf).toFixed(2);


            // iterate through dates
            for (const date of dateArr) {

                // find the price for each day
                const currentPrice = eval(stockData[date]["markPrice"]);


                // if the current price is 5% less than high price - push date
                if (currentPrice >= sellPrice) {
                    console.log('Sell High currentDay = ' + date + ' currentPrice = ' + currentPrice + ' sellPrice = ' + sellPrice + ' & buyPrice = ' + buyPrice);
                    return date;
                }

            }
            return endDate;
        }

    }
    console.log(buyDateArr, sellDateArr)
    return [buyDateArr, sellDateArr];
}

