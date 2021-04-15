const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { NftData, NftCat } = require("../helpers/classes");
const e = require('express');

router.get('/nfts', (req, res) => {
    let address = req.query.address;
    let chain_id = req.query.chain_id;

    if (address === undefined) {
        apiResponse.errResponse(res, "No Address Defined")
    } else {
        chain_id === undefined ? null : chain_id = chain_id.replace(/'|"/g, "")

        getNfts(address, chain_id)
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

async function getNfts(address, chain_id = 1) {
    return new Promise((resolve, reject) => {
        console.time("fetch NFT time from covalent API");
        let nfts_ids = [];
        fetch(url + `${chain_id}/address/${address}/balances_v2/?nft=true&no-nft-fetch=true`)
            .then(response => response.json())
            .then(data => {
                console.timeEnd("fetch NFT time from covalent API");
                console.time("filter NFTs");
                if (data.data && data.data.items && data.error == false) {
                    data.data.items.forEach(el => {
                        if (el.type === "nft") {
                            el.nft_data.forEach(el2 => {
                                let eachNft = new NftCat(
                                    el2.token_id,
                                    el.contract_address
                                )
                                nfts_ids.push(JSON.parse(JSON.stringify(eachNft)))
                            }
                            )
                        }
                    });
                    filterNFTs(nfts_ids, chain_id, address).then(res => {
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
async function filterNFTs(data, chain_id) {
    if (data.length > 0) {
        let nftMeta = [];
        let promises = data.map(i => {
            return new Promise((resolve, reject) => {
                fetch(url + `${chain_id}/tokens/${i.contract_address}/nft_metadata/${i.id}/`)
                    .then(response => response.json())
                    .then(res => {
                        let eachNft = new NftData(
                            res.data.items[0].nft_data[0].external_data.name,
                            res.data.items[0].nft_data[0].external_data.description,
                            res.data.items[0].nft_data[0].external_data.image,
                        )
                        nftMeta.push(JSON.parse(JSON.stringify(eachNft)))
                        resolve();
                    }).catch(err => {
                        resolve();
                    });
            }).catch(err => {
                console.log("nft fetch err ", err)
                resolve();
            })
        })
        return Promise.all(promises).then(() => {
            return nftMeta;
        });
    } else {

    }

}

module.exports = router;