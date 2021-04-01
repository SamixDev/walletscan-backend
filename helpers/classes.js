module.exports = function  Tokendata(
    contract_name, 
    contract_ticker_symbol, 
    contract_address, 
    logo_url,
    balance,
    contract_decimals,
    quote,
    quote_rate)
    {        
        this.contract_name = contract_name;
        this.contract_ticker_symbol = contract_ticker_symbol;
        this.contract_address = contract_address;
        this.logo_url = logo_url;
        this.balance = balance;
        this.contract_decimals = contract_decimals;
        this.quote = quote;
        this.quote_rate = quote_rate;
    }
