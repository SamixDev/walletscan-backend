const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { NftData } = require("../helpers/classes");
const e = require('express');

router.get('/nfts', (req, res) => {
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
            }, reason => {
                apiResponse.ErrorResponse(res, reason)
            });

    }
});

async function getNfts(address, chain_id) {
    return new Promise((resolve, reject) => {
        console.time("fetch NFT time from covalent API");
        fetch(url + `${chain_id}/address/${address}/balances_v2/?nft=true`)
            .then(response => response.json())
            .then(data => {
                console.timeEnd("fetch NFT time from covalent API");
                console.time("filter NFTs");
                if (data.data && data.error == false) {
                    filterNFTs(data).then(res => {
                        console.timeEnd("filter NFTs");
                        console.log("--------------------------------------");
                        resolve(res)
                    });
                } else {
                    reject(data.error_message)
                }
            }).catch(error => {
                resolve("")
                throw error;
            });
    });
}

//async function to add quote_percentage to the data
async function filterNFTs(data) {
    return new Promise((resolve, reject) => {
        let nfts = [];
        data.data.items.forEach(el => {
            if (el.type === "nft") {
                let eachNFT = new NftData(
                    el.nft_data[0].external_data.name,
                    el.nft_data[0].external_data.description,
                    el.nft_data[0].external_data.image
                )
                nfts.push(JSON.parse(JSON.stringify(eachNFT)))
            }
        });
        resolve(nfts)
    })
}

module.exports = router;