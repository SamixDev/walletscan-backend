const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { Tokendata, History } = require("../helpers/classes");

router.get('/portfolio', (req, res) => {
    let address = req.query.address;
    let chain_id = req.query.chain_id;
    let currency = req.query.currency;
    let decimal = req.query.decimal;

    if (address === undefined) {
        apiResponse.errResponse(res, "No Address Defined")
    } else {
        chain_id === undefined ? null : chain_id = chain_id.replace(/'|"/g, "")
        currency === undefined ? null : currency = currency.replace(/'|"/g, "")
        decimal === undefined ? null : decimal = decimal.replace(/'|"/g, "")

        sendTokens(address, chain_id, currency, decimal)
            .then(r => {
                if (r === "") {
                    apiResponse.errResponse(res, "No Data")
                } else {
                    apiResponse.successResponse(res, r)
                }
            }, reason => {
                apiResponse.errResponse(res, reason)
            });

    }
});

//async function get and send tokens
async function sendTokens(address, chain_id = 1, currency = "usd", decimal = 5) {
    return new Promise((resolve, reject) => {

        let arrTickers = [];
        console.time("fetch Protfolio from covalent API");
        fetch(url + `${chain_id}/address/${address}/portfolio_v2/?quote-currency=${currency}&key=${key}`)
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    console.timeEnd("fetch Protfolio from covalent API");
                    const tokens_data = data.items;
                    console.time("creating objects to send (my code)");
                    createResp(tokens_data, decimal, arrTickers, currency).then(res => {
                        console.timeEnd("creating objects to send (my code)");
                        console.time("creating portfolio (my code)");
                        totalPortfolio(res, decimal, currency).then(res2 => {
                            console.timeEnd("creating portfolio (my code)");
                            console.time("creating percentages (my code)");
                            quotePercentages(res2, decimal).then(res3 => {
                                standardDeviation(res3, decimal).then(res4 => {
                                    console.timeEnd("creating percentages (my code)");
                                    //   console.time("image check time from covalent API");
                                    resolve(res4)
                                    // checkImages(res4).then(res5 => {
                                    //     console.timeEnd("image check time from covalent API");
                                    //     console.log("--------------------------------------");
                                    //     resolve(res5)
                                    // })
                                })
                            })

                        })
                    })
                } else {
                    console.timeEnd("fetch Protfolio from covalent API");
                    reject(data.error_message)
                    //   apiResponse.ErrorResponse(res, data.error_message)
                }
            })
            .catch(error => {
                resolve("")
                throw error;
            });
    });
}

//async function to fill array with data from Covalent at first
async function createResp(tokens_data, decimal, arrTickers, currency) {
    return new Promise((resolve, reject) => {

        let allItems = [];

        tokens_data.forEach(element => {

            let arr = []

            element.holdings.forEach(el => {
                let eachHistoricalValue = new History(
                    el.timestamp,
                    Number((el.close.balance / (10 ** element.contract_decimals)).toFixed(decimal)),
                    el.close.quote ? Number(el.close.quote.toFixed(decimal)) : 0,
                    el.quote_rate ? Number(el.quote_rate.toFixed(decimal)) : 0,
                    0
                )
                arr.push(JSON.parse(JSON.stringify(eachHistoricalValue)))

            })

            let itemData = new Tokendata(
                element.contract_name,
                element.contract_ticker_symbol,
                element.logo_url,
                Number((element.holdings[0].close.balance / (10 ** element.contract_decimals)).toFixed(decimal)),
                element.holdings[0].close.quote ? element.holdings[0].close.quote : 0,
                element.holdings[0].quote_rate ? element.holdings[0].quote_rate : 0,
                0,
                0,
                0,
                currency,
                arr
            )

            arrTickers.push(JSON.parse(JSON.stringify(itemData.contract_ticker_symbol)));
            allItems.push(JSON.parse(JSON.stringify(itemData)));
        })
        resolve(allItems)
    }).catch(error => {
        resolve("")
        console.log("error fetching data to fill class ", error)
    });
}

//async function to calculate all coins together for PORTFOLIO
async function totalPortfolio(tokens_data, decimal, currency) {
    return new Promise((resolve, reject) => {
        try {

            let arr2 = [];
            let totalBalance = 0;
            let totalQuote = 0;

            // if Portfolio historical data array is empty generate array with only timestamps
            if (!(arr2.length = 0)) {

                histVal = tokens_data[0].historycal_value

                for (let i = 0; i < histVal.length; i++) {

                    let eachHistoricalValue2 = new History(
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
                //  el.stddev_24h = el.historycal_value[0] - el.historycal_value[1]
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
                1,
                0,
                0,
                currency,
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
            tokens_data[i].quote_percentage = Number((tokens_data[i].quote / tokens_data[tokens_data.length - 1].quote).toFixed(decimal)) ? Number((tokens_data[i].quote / tokens_data[tokens_data.length - 1].quote).toFixed(decimal)) : 0

            for (let j = 0; j < tokens_data[i].historycal_value.length; j++) {
                tokens_data[i].historycal_value[j].quote_percentage = Number((tokens_data[i].historycal_value[j].quote / tokens_data[tokens_data.length - 1].historycal_value[j].quote).toFixed(decimal)) ? Number((tokens_data[i].historycal_value[j].quote / tokens_data[tokens_data.length - 1].historycal_value[j].quote).toFixed(decimal)) : 0
            }
        }
        resolve(tokens_data)
    })
}

//async function to add standard deviation over 24hrs (change24h)
async function standardDeviation(tokens_data, decimal) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < tokens_data.length; i++) {
            tokens_data[i].change24h = Number((tokens_data[i].historycal_value[0].quote_rate - tokens_data[i].historycal_value[1].quote_rate).toFixed(decimal))
            tokens_data[i].change24h_percentage = Number(((tokens_data[i].historycal_value[0].quote_rate / tokens_data[i].historycal_value[1].quote_rate) - 1).toFixed(decimal))

        }
        resolve(tokens_data)
    })
}

//check if image valid
// async function checkImages(data) {
//     if (data !== "") {
//         let promises = data.map(i => {
//             if (!(i.logo_url == "")) {
//                 return new Promise((resolve, reject) => {
//                     fetch(i.logo_url, { method: 'HEAD' })
//                         .then(res => {
//                             if (res.ok) {
//                                 resolve();
//                             } else {
//                                 i.logo_url = ""
//                                 resolve();
//                             }
//                         }).catch(err => {
//                             console.log('Error:', err)
//                             i.logo_url = ""
//                             resolve();
//                         });
//                 }).catch(err => {
//                     console.log("image fetch err ", err)
//                     resolve();
//                 })
//             }
//         })
//         return Promise.all(promises).then(() => {
//             return data;
//         });
//     } else {

//     }
// }

module.exports = router;