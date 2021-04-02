const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const {Tokendata, history} = require("../helpers/classes");


//async function get and send tokens
async function sendTokens(address, chain_id = 1, currency) {
    return new Promise((resolve, reject) => {

        fetch(url + `${chain_id}/address/${address}/portfolio_v2/?`)
            .then(response => response.json())
            .then(data => {
                const tokens_data = data.items;
                createResp(tokens_data).then(res => {
                    console.log(res)
                    console.log(res[0])
                    resolve(res)
                })
            })
            .catch(error => {
                resolve(console.log("[]"))
                throw error;
            });
    });
}

async function createResp(tokens_data) {
    return new Promise((resolve, reject) => {
        let allItems = [];
        tokens_data.forEach(element => {
            let arr = []
            element.holdings.forEach(el =>{
                let eachHistoricalValue = new history(
                    el.timestamp,
                    el.close.balance,
                    el.close.quote
                )
                arr.push(eachHistoricalValue)
            })
            let itemData = new Tokendata(
                element.contract_name,
                element.contract_ticker_symbol,
                element.contract_address,
                element.logo_url,
                element.holdings[0].close.balance,
                element.contract_decimals,
                element.holdings[0].close.quote,
                arr)
            allItems.push(itemData);
        })
        resolve(allItems)
    });
}


module.exports = { sendTokens };