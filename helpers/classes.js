// for Tokens page
function Tokendata(
    contract_name,
    contract_ticker_symbol,
    logo_url,
    balance,
    quote,
    quote_rate,
    quote_percentage,
    stddev_24h,
    quote_currency,
    historycal_value
) {
    this.contract_name = contract_name;
    this.contract_ticker_symbol = contract_ticker_symbol;
    this.logo_url = logo_url;
    this.balance = balance;
    this.quote = quote;
    this.quote_rate = quote_rate;
    this.quote_percentage = quote_percentage;
    this.stddev_24h = stddev_24h;
    this.quote_currency = quote_currency;
    this.historycal_value = historycal_value
}

function history(
    timestamp,
    balance,
    quote,
    quote_rate,
    quote_percentage
) {
    this.timestamp = timestamp;
    this.balance = balance;
    this.quote = quote;
    this.quote_rate = quote_rate;
    this.quote_percentage = quote_percentage;
}

// for nfts page

// for transactions page

module.exports = { Tokendata, history }