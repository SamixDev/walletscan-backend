function Tokendata(
    contract_name,
    contract_ticker_symbol,
    contract_address,
    logo_url,
    balance,
    contract_decimals,
    quote,
    historycal_value
) {
    this.contract_name = contract_name;
    this.contract_ticker_symbol = contract_ticker_symbol;
    this.contract_address = contract_address;
    this.logo_url = logo_url;
    this.balance = balance;
    this.contract_decimals = contract_decimals;
    this.quote = quote;
    this.historycal_value = historycal_value
}

function history(
    timestamp,
    balance,
    quote
    ) {
    this.timestamp = timestamp;
    this.balance = balance;
    this.quote = quote;
}

module.exports = {Tokendata, history}