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
                    resolve(res)
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

module.exports = sendTokens;