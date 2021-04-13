const envVar = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");
const key = envVar.parsed.API_KEY
const url = envVar.parsed.Covalent_URL
const { TransactionsData } = require("../helpers/classes");

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
        console.time("fetch Transactions time from covalent API");
        let tnx = [];
        fetch(url + `${chain_id}/address/${address}/transactions_v2/`)
            .then(response => response.json())
            .then(data => {
                console.timeEnd("fetch Transactions time from covalent API");
                console.time("filter Transactions");
                if (data.data && data.data.items && data.error == false) {
                    data.data.items.forEach(el => {
                                let transaction = new TransactionsData(
                                    el.block_signed_at.slice(0,10),
                                    el.block_signed_at.slice(-9,-1)+" UTC",
                                    el.tx_hash,
                                    el.to_address,
                                    Number((el.value / (10 ** 18)).toFixed(6)),
                                    el.gas_spent,
                                    Number((el.gas_price / (10 ** 9)).toFixed(0)),
                                    Number(((el.gas_price*el.gas_spent )/ (10 ** 18)).toFixed(6)),
                                    Number((el.value_quote + el.gas_quote).toFixed(2)),
                                    Number(((el.value / (10 ** 18)) + ((el.gas_price*el.gas_spent )/ (10 ** 18))).toFixed(6)),
                                )
                                tnx.push(JSON.parse(JSON.stringify(transaction)))

                    });
                        console.timeEnd("filter Transactions");
                        console.log("--------------------------------------");
                        resolve(tnx)
                } else {
                    reject(data.error_message)
                }

            }).catch(error => {
                resolve("")
                throw error;
            });

    });
}

module.exports = router;