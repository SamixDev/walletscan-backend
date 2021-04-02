const apiResponse = require("../helpers/apiResponse");
const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const Tokendata = require("../helpers/classes");
const addr = "0x8c97e535313ed467db86a661f9a79ed6725c2c49"



//async function get and send tokens
async function sendTokens(address, chain_id = 1, currency) {
    return new Promise((resolve, reject) => {

        fetch(url + `${chain_id}/address/${address}/balances_v2/?`)
            .then(response => response.json())
            .then(data => {
                const tokens_data = data.data.items;
                switch (currency) {
                    case "usd":
                        createRespUSD(tokens_data).then(res => {
                            console.log(res)
                            resolve(res)
                        })
                        break;
                    case "eur":
                        // code block
                        break;
                    case "eth":
                        // code block
                        break;
                    default:
                        createRespUSD(tokens_data).then(res => {
                            console.log(res)
                            resolve(res)
                        })
                }
            })
            .catch(error => {
                resolve(console.log("[]"))
                throw error;
            });
    });
}

async function createRespUSD(tokens_data) {
    return new Promise((resolve, reject) => {
        let allItems = [];
        tokens_data.forEach(element => {
            let itemData = new Tokendata(element.contract_name,
                element.contract_ticker_symbol,
                element.contract_address,
                element.logo_url,
                element.balance,
                element.contract_decimals,
                element.quote,
                element.quote_rate)
            allItems.push(itemData);
        })
        resolve(allItems)
    });
}

async function createRespEUR(tokens_data) {
    return new Promise((resolve, reject) => {
        let allItems = [];
        tokens_data.forEach(element => {
            let itemData = new Tokendata(element.contract_name,
                element.contract_ticker_symbol,
                element.contract_address,
                element.logo_url,
                element.balance,
                element.contract_decimals,
                element.quote,
                element.quote_rate)
            allItems.push(itemData);
        })
        resolve(allItems)
    });
}


module.exports = { sendTokens };