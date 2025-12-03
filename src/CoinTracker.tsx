import { useState, useEffect } from 'react'

const CoinTracker = () => {
    const [loading, setLoading] = useState(true);

    const [coins, setCoins] = useState([])

    useEffect(() => {
        fetch("https://api.coinpaprika.com/v1/tickers")
        .then((response) => response.json()).
        then((json) => {
            setCoins(json);
            setLoading(false);
        });
    }, []);

    return (
    <>
        <h1>The Coins! ({coins.length})</h1>
        {loading ? <strong>Loading...</strong> : null}
        <ul>
            {coins.map((coin) => <li key={coin.id}>{coin.name} ({coin.symbol} : {coin.quotes.USD.price})</li>)}
        </ul>
    </>
    );
}

export default CoinTracker