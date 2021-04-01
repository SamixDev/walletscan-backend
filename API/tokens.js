const apiResponse = require("./helpers/apiResponse");
const classes = require("./helpers/classes");
const envVar = require('dotenv').config() 
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL

//async function get and send tokens
async function sendTokens(address) {
    return new Promise((resolve, reject) => {


        resolve(resp)
    });
}


module.exports = sendTokens;