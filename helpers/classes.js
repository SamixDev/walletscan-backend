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
    historycal_value,
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
    this.historycal_value = historycal_value;
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
function TransactionsData(
    time,
    date,
    tx_hash,
    receiver,
    amount,
    gas_units,
    gas_price,
    fee,
    total_balance,
    total_quote,
) {
    this.time = time;
    this.date = date;
    this.tx_hash = tx_hash;
    this.receiver = receiver;
    this.amount = amount;
    this.gas_units = gas_units;
    this.gas_price = gas_price;
    this.fee = fee;
    this.total_balance = total_balance;
    this.total_quote = total_quote;
}

module.exports = { Tokendata, History, NftData, NftCat, TransactionsData }