const axios = require('axios');


const getGasFees = (req, res, next) => {
    axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_GWEI_API_KEY}`)
    .then(response => {
        const gwei = response.data.result.ProposeGasPrice;
        console.log(gwei);

        res.send({gwei: gwei});
    })
    .catch(error => console.log(error))

}

const getEthPrice = async (req, res) => {
    axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_ETH_API_KEY}`)
    .then(response => {
        const eth = response.data.result.ethusd;
        console.log(eth);

        res.send({eth: eth});
    })
    .catch(error => console.log(error))

}

const getAmpPrice = async (req, res) => {
    axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=amp-token&vs_currencies=usd`)
    .then(response => {
        const ampPrice = response.data['amp-token'].usd.toFixed(3);
        console.log(ampPrice);

        res.send({ampPrice: ampPrice});
    })
    .catch(error => console.log(error))

}

const ampStakeExample = async (req, res) => {
    promise1 = axios.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_GWEI_API_KEY}`);
    promise2 = axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_ETH_API_KEY}`);
    promise3 = axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=amp-token&vs_currencies=usd`);

    try {
        Promise.all([promise1, promise2, promise3])
        .then(values => {
            const exampleObj = {
                current_gas_fees: `${values[0].data.result.ProposeGasPrice} gwei`,
                current_eth_price: `1 ETH = $${values[1].data.result.ethusd}`,
                currect_amp_price: `1 AMP = $${values[2].data['amp-token'].usd.toFixed(3)}`
            }

            res.header("Content-Type",'application/json');
            res.send(JSON.stringify(exampleObj, null, 4));
        })
    } catch (error) {
        res.send(error);
    }

}


module.exports = { getEthPrice, getGasFees, getAmpPrice, ampStakeExample };