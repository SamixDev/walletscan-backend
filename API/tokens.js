const apiResponse = require("../helpers/apiResponse");
const envVar = require('dotenv').config(); 
const fetch = require('node-fetch');
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const Tokendata = require("../helpers/classes");
const addr = "0x8c97e535313ed467db86a661f9a79ed6725c2c49"



//async function get and send tokens
async function sendTokens(address) {
    return new Promise((resolve, reject) => {
    //let items = [];
    fetch(url + `address/${address}/balances_v2/?`)
    .then(response => response.json())
    .then(data => {
        const tokens_data = data.data.items;
        console.log(tokens_data)
        // data.data.items.forEach(element =>{
        //     let itemData = new Tokendata(element.cotract_name,
        //         element.contract_ticker_symbol,
        //         element.contract_address,
        //         element.logo_url,
        //         element.balance,
        //         element.contract_decimals,
        //         element.quote,
        //         element.quote_rate)
        //     items.push(itemData);   
        // })
        //console.log(items)
        resolve(tokens_data)   
    });

    });
}



 module.exports = {sendTokens};