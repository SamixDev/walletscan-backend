const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { NftData } = require("../helpers/classes");

router.get('/portfolio', (req, res) => {
    let address = req.query.address;
    let chain_id = req.query.chain_id;

    if (address === undefined) {
        apiResponse.ErrorResponse(res, "No Address Defined")
    } else {
        chain_id === undefined ? null : chain_id = chain_id.replace(/'|"/g, "")

        getNfts(address, chain_id)
            .then(r => {
                if (r === "") {
                    apiResponse.ErrorResponse(res, "No Data")
                } else {
                    apiResponse.successResponse(res, r)
                }
            });

    }
});

async function getNfts(address, chain_id){
    return new Promise((resolve, reject) => {

    });
}

module.exports = router;