// for Tokens page
function Tokendata(
    contract_name,
    contract_ticker_symbol,
    logo_url,
    balance,
    quote,
    historycal_value
) {
    this.contract_name = contract_name;
    this.contract_ticker_symbol = contract_ticker_symbol;
    this.logo_url = logo_url;
    this.balance = balance;
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

// for nfts page

// for transactions page

module.exports = { Tokendata, history }