const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
//const { Tokendata, History } = require("../helpers/classes");

router.get('/transactions', (req, res) => {
    let address = req.query.address;
    let chain_id = req.query.chain_id;

    if (address === undefined) {
        apiResponse.errResponse(res, "No Address Defined")
    } else {
        chain_id === undefined ? null : chain_id = chain_id.replace(/'|"/g, "")

        getTransactions(address, chain_id)
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

async function getTransactions(address, chain_id = 1) {
    return new Promise((resolve, reject) => {

    });
}
