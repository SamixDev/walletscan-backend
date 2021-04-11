// for Tokens page
function Tokendata(
    contract_name,
    contract_ticker_symbol,
    logo_url,
    balance,
    quote,
    quote_rate,
    quote_percentage,
    change24h,
    change24h_percentage,
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
    this.change24h = change24h;
    this.change24h_percentage = change24h_percentage;
    this.quote_currency = quote_currency;
    this.historycal_value = historycal_value
}

function History(
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
function NftCat(
    id,
    contract_address,
) {
    this.id = id;
    this.contract_address = contract_address;
}

function NftData(
    title,
    description,
    media_link,
) {
    this.title = title;
    this.description = description;
    this.media_link = media_link;
}
// for transactions page

module.exports = { Tokendata, History, NftData,NftCat }