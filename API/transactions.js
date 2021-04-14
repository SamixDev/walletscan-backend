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
    let page_number = req.query.page_number;
    let page_size = req.query.page_size;

    if (address === undefined) {
        apiResponse.errResponse(res, "No Address Defined")
    } else {
        chain_id === undefined ? null : chain_id = chain_id.replace(/'|"/g, "")
        page_number === undefined ? null : page_number = page_number.replace(/'|"/g, "")
        page_size === undefined ? null : page_size = page_size.replace(/'|"/g, "")

        getTransactions(address, chain_id, page_size, page_number)
            .then(({arg1, arg2}) => {
                if (arg2 === "") {
                    apiResponse.errResponse(res, "No Data")
                } else {
                    apiResponse.successResponseTransactions(res, arg1, arg2)
                }
            }, reason => {
                apiResponse.errResponse(res, reason)
            });

    }
});

async function getTransactions(address, chain_id = 1,page_size = 100 , page_number = 0 ) {
    return new Promise((resolve, reject) => {
        console.time("fetch Transactions time from covalent API");
        let tnx = [];
        let has_more = false;
        fetch(url + `${chain_id}/address/${address}/transactions_v2/?page-number=${page_number}&page-size=${page_size}`)
            .then(response => response.json())
            .then(data => {
                console.timeEnd("fetch Transactions time from covalent API");
                console.time("filter Transactions");
                if (data.data && data.data.items && data.error == false) {
                    if (data.data.pagination && data.data.pagination.has_more === true) {
                        has_more = true;
                    } else {
                        has_more = false;
                    }
                    data.data.items.forEach(el => {
                        let transaction = new TransactionsData(
                            el.block_signed_at.slice(0, 10),
                            el.block_signed_at.slice(-9, -1) + " UTC",
                            el.tx_hash,
                            el.to_address,
                            Number((el.value / (10 ** 18)).toFixed(6)),
                            el.gas_spent,
                            Number((el.gas_price / (10 ** 9)).toFixed(0)),
                            Number(((el.gas_price * el.gas_spent) / (10 ** 18)).toFixed(6)),
                            Number((el.value_quote + el.gas_quote).toFixed(2)),
                            Number(((el.value / (10 ** 18)) + ((el.gas_price * el.gas_spent) / (10 ** 18))).toFixed(6)),
                        )
                        tnx.push(JSON.parse(JSON.stringify(transaction)))

                    });
                    console.timeEnd("filter Transactions");
                    console.log("--------------------------------------");
                   // resolve(tnx)
                    resolve({arg1: has_more, arg2: tnx})
                } else {
                 //   reject(data.error_message)
                    reject({arg1: has_more, arg2: data.error_message})
                }

            }).catch(error => {
                resolve({arg1: false, arg2: ""})
                throw error;
            });

    });
}

module.exports = router;