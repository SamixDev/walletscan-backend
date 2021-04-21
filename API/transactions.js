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
            .then(({ arg1, arg2, arg3, arg4, arg5 }) => {
                if (arg2 === "") {
                    apiResponse.failResponseTransactions(res, "No Data")
                } else {
                    apiResponse.successResponseTransactions(res, arg1, arg2, arg3, arg4, arg5)
                }
            }, reason => {
                apiResponse.failResponseTransactions(res, reason.arg2)
            });

    }
});

async function getTransactions(address, chain_id = 1, page_size = 1000, page_number = 0) {
    return new Promise((resolve, reject) => {
        console.time("fetch Transactions time from covalent API");
        let tnx = [];
        let total_tx = 0;
        let total_fee = 0;
        let total_in = 0;
        let total_out = 0;
        let adr = 0;
        fetch(url + `${chain_id}/address/${address}/transactions_v2/?page-number=${page_number}&page-size=${page_size}&no-logs=true`)
            .then(response => response.json())
            .then(data => {
                console.timeEnd("fetch Transactions time from covalent API");
                console.time("filter Transactions");
                if (data.data && data.data.items && data.error == false) {
                    adr = data.data.address;
                    data.data.items.forEach(el => {
                        if (el.from_address == data.data.address || el.to_address == data.data.address) {

                            total_tx++;
                            total_fee += el.from_address == adr ? Number(((el.gas_price * el.gas_spent) / (10 ** 18)).toFixed(6)) : 0,
                                total_in += el.from_address == adr ? 0 : Number((el.value / (10 ** 18)).toFixed(6)),
                                total_out += el.from_address == adr ? Number(((el.value / (10 ** 18)) + ((el.gas_price * el.gas_spent) / (10 ** 18))).toFixed(6)) : 0;

                            let transaction = new TransactionsData(
                                el.block_signed_at,
                                el.tx_hash,
                                el.from_address,
                                el.from_address_label ? el.from_address_label : el.from_address,
                                el.to_address,
                                el.to_address_label ? el.to_address_label : el.to_address,
                                Number((el.value / (10 ** 18)).toFixed(6)),
                                el.gas_spent,
                                Number((el.gas_price / (10 ** 9)).toFixed(0)),
                                Number(((el.gas_price * el.gas_spent) / (10 ** 18)).toFixed(6)),
                                Number((el.value_quote + el.gas_quote).toFixed(2)),
                                Number(((el.value / (10 ** 18)) + ((el.gas_price * el.gas_spent) / (10 ** 18))).toFixed(6)),
                                el.successful,
                                el.from_address == adr ? "out" : "in",
                            )
                            tnx.push(JSON.parse(JSON.stringify(transaction)))

                        } else {

                        }

                    });
                    console.timeEnd("filter Transactions");
                    console.log("--------------------------------------");
                    resolve({ arg1: total_tx, arg2: total_fee, arg3: total_in, arg4: total_out, arg5: tnx })
                } else {
                    reject({ arg1: total_tx, arg2: data.error_message })
                }

            }).catch(error => {
                resolve({ arg1: false, arg2: "" })
                throw error;
            });

    });
}

module.exports = router;