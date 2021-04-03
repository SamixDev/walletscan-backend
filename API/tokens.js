const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { Tokendata, history } = require("../helpers/classes");

//async function get and send tokens
async function sendTokens(address, chain_id = 1, currency = "usd", decimal = 2) {
    return new Promise((resolve, reject) => {

        fetch(url + `${chain_id}/address/${address}/portfolio_v2/?quote-currency=${currency}`)
            .then(response => response.json())
            .then(data => {
                const tokens_data = data.items;
                createResp(tokens_data, decimal).then(res => {
                    totalPortfolio(res, decimal).then(res2 =>{
                        console.log(res2)
                      resolve(res2)  
                    })
                })
            })
            .catch(error => {
                resolve(console.log("[]"))
                throw error;
            });
    });
}

async function createResp(tokens_data, decimal) {
    return new Promise((resolve, reject) => {
        let allItems = [];
        tokens_data.forEach(element => {
            let arr = []
            element.holdings.forEach(el => {
                let eachHistoricalValue = new history(
                    el.timestamp,
                    Number((el.close.balance / (10 ** element.contract_decimals)).toFixed(decimal)),
                    el.close.quote
                )
                arr.push(JSON.parse(JSON.stringify(eachHistoricalValue)))
            })
            let itemData = new Tokendata(
                element.contract_name,
                element.contract_ticker_symbol,
                element.logo_url,
                Number((element.holdings[0].close.balance / (10 ** element.contract_decimals)).toFixed(decimal)),
                element.holdings[0].close.quote,
                arr)
            allItems.push(JSON.parse(JSON.stringify(itemData)));
        })
        resolve(allItems)
    });
}

//async function to calculate all coins together for PORTFOLIO
async function totalPortfolio(tokens_data) {
    return new Promise((resolve, reject) => {
        let arr2 = [];
       let totalBalance=0;
       let totalQuote=0;
       // if Portfolio historical data array is empty generate array with only timestamps
       if(!(arr2.length = 0)){
           histVal = tokens_data[0].historycal_value
        for(let i=0;i<histVal.length;i++){
            let eachHistoricalValue2 = new history(
                histVal[i].timestamp,
                0,
                0
            )
            arr2.push(JSON.parse(JSON.stringify(eachHistoricalValue2)));  
        }
       }

       // loop over the data and fill the portfolio historical data
       tokens_data.forEach(el =>{
        totalBalance += el.balance;
        totalQuote += el.quote;
        for(let i=0;i<el.historycal_value.length;i++){
            arr2[i].balance += el.historycal_value[i].balance
            arr2[i].quote += el.historycal_value[i].quote
        }
       })
       let itemData2 = new Tokendata(
        "Entire Portfolio",
        "PORTFOLIO",
        "",
        totalBalance,
        totalQuote,
        arr2)
      tokens_data.push(JSON.parse(JSON.stringify(itemData2)))
        resolve(tokens_data)
     // console.log(tokens_data[2])
    });   
}

module.exports = sendTokens;