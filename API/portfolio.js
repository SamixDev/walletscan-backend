const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { Tokendata, history } = require("../helpers/classes");

router.get('/portfolio', (req, res) => {
    let address = req.query.address;
    let chain_id = req.query.chain_id;
    let currency = req.query.currency;
    let decimal = req.query.decimal;

    if (address === undefined) {
        apiResponse.ErrorResponse(res, "No Address Defined")
    } else {
        chain_id === undefined ? null : chain_id = chain_id.replace(/'|"/g, "")
        currency === undefined ? null : currency = currency.replace(/'|"/g, "")
        decimal === undefined ? null : decimal = decimal.replace(/'|"/g, "")

        sendTokens(address, chain_id, currency, decimal)
            .then(r => {
                if (r === "") {
                    apiResponse.ErrorResponse(res, "No Data")
                } else {
                    apiResponse.successResponse(res, r)
                }
            })

    }
});

//async function get and send tokens
async function sendTokens(address, chain_id = 1, currency = "usd", decimal = 5) {
    return new Promise((resolve, reject) => {

        let arrTickers = [];

        fetch(url + `${chain_id}/address/${address}/portfolio_v2/?quote-currency=${currency}`)
            .then(response => response.json())
            .then(data => {

                const tokens_data = data.items;

                createResp(tokens_data, decimal, arrTickers).then(res => {
                    totalPortfolio(res, decimal).then(res2 => {
                        quotePercentages(res2, decimal).then(res3 => {
                            standardDeviation(res3, decimal, arrTickers.join("%2C")).then(res4 => {
                                resolve(res4)
                            })
                        })

                    })
                })
            })
            .catch(error => {
                resolve("")
                throw error;
            });
    });
}

//async function to fill array with data from Covalent at first
async function createResp(tokens_data, decimal, arrTickers) {
    return new Promise((resolve, reject) => {

        let allItems = [];

        try {
            tokens_data.forEach(element => {

                let arr = []

                element.holdings.forEach(el => {
                    let eachHistoricalValue = new history(
                        el.timestamp,
                        Number((el.close.balance / (10 ** element.contract_decimals)).toFixed(decimal)),
                        Number(el.close.quote.toFixed(decimal)),
                        Number(el.quote_rate.toFixed(decimal)),
                        0,
                        0
                    )
                    arr.push(JSON.parse(JSON.stringify(eachHistoricalValue)))
                })

                let itemData = new Tokendata(
                    element.contract_name,
                    element.contract_ticker_symbol,
                    element.logo_url,
                    Number((element.holdings[0].close.balance / (10 ** element.contract_decimals)).toFixed(decimal)),
                    element.holdings[0].close.quote,
                    element.holdings[0].quote_rate,
                    0,
                    0,
                    arr
                )

                arrTickers.push(JSON.parse(JSON.stringify(itemData.contract_ticker_symbol)));
                allItems.push(JSON.parse(JSON.stringify(itemData)));
            })
            resolve(allItems)
        } catch {
            resolve("")
        }

    });
}

//async function to calculate all coins together for PORTFOLIO
async function totalPortfolio(tokens_data, decimal) {
    return new Promise((resolve, reject) => {
        try {

            let arr2 = [];
            let totalBalance = 0;
            let totalQuote = 0;

            // if Portfolio historical data array is empty generate array with only timestamps
            if (!(arr2.length = 0)) {

                histVal = tokens_data[0].historycal_value

                for (let i = 0; i < histVal.length; i++) {

                    let eachHistoricalValue2 = new history(
                        histVal[i].timestamp,
                        0,
                        0,
                        0,
                        1
                    )
                    arr2.push(JSON.parse(JSON.stringify(eachHistoricalValue2)));
                }
            }

            // loop over the data and fill the portfolio historical data
            tokens_data.forEach(el => {

                totalBalance += el.balance;
                totalQuote += el.quote;

                for (let i = 0; i < el.historycal_value.length; i++) {
                    arr2[i].balance += el.historycal_value[i].balance
                    arr2[i].quote += el.historycal_value[i].quote
                }
            })

            //put decimal in the arr2 to the defined one
            for (let i = 0; i < arr2.length; i++) {
                arr2[i].balance = Number(arr2[i].balance.toFixed(decimal))
                arr2[i].quote = Number(arr2[i].quote.toFixed(decimal))
            }

            let itemData2 = new Tokendata(
                "Entire Portfolio",
                "PORTFOLIO",
                "",
                Number(totalBalance.toFixed(decimal)),
                Number(totalQuote.toFixed(decimal)),
                0,
                0,
                0,
                arr2
                )

            tokens_data.push(JSON.parse(JSON.stringify(itemData2)))
            resolve(tokens_data)
        } catch {
            resolve("")
        }
    });
}

//async function to add quote_percentage to the data
async function quotePercentages(tokens_data, decimal) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < tokens_data.length - 1; i++) {

            tokens_data[i].quote_percentage = Number((tokens_data[i].quote / tokens_data[tokens_data.length - 1].quote).toFixed(decimal))
            
            for (let j = 0; j < tokens_data[i].historycal_value.length; j++) {
                tokens_data[i].historycal_value[j].quote_percentage = Number((tokens_data[i].historycal_value[j].quote / tokens_data[tokens_data.length - 1].historycal_value[j].quote).toFixed(decimal))
            }
        }
        resolve(tokens_data)
    })
}

//async function to add standard deviation over 24hrs (stddev_24h)
async function standardDeviation(tokens_data, decimal, arrTickers) {
    return new Promise((resolve, reject) => {
    //    console.log(url + `pricing/volatility/?tickers=${arrTickers}`)
        fetch(url + `pricing/volatility/?tickers=${arrTickers}`)
            .then(response => response.json())
            .then(data => {

                const tiker_data = data.data.items;

            //    console.log(tiker_data)
                resolve(tokens_data)
            })
            .catch(error => {
                resolve("")
                throw error;
            });
    })
}

module.exports = router;