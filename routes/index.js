var express = require('express');
var router = express.Router();
const Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var contractAddr = '0x510a7C7b72479B078B5582C1bf137A74c800b1a7';
var abi =
  [
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

function init() {
  var TxObj = Tx.Transaction;
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  web3.eth.getAccounts(console.log);
  let contractInstance = new web3.eth.Contract(abi, contractAddr);
  console.log("contractInstance");

  const account = '0x40e4DF6C1D3e226c52F2A21c964EBe94830504AD';
  const privateKey = Buffer.from('b19731332f9dfd1a6c37cb073fa3ecec4837c3beeebeac300cada8b733836c75', 'hex');
  //const newAddress = '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157';
  //var TestContract = new web3.eth.Contract([YOUR_ABI], contractAddress);
  const _data = contractInstance.methods.set(10).encodeABI();
  console.log(_data);
  var rawTx = {};
  web3.eth.getTransactionCount(account).then(nonce => {
    rawTx = {
      nonce: nonce,
      gasPrice: '0x20000000000',
      gasLimit: '0x41409',
      to: contractAddr,
      value: 0,
      data: _data
    }
 

    var tx = new TxObj(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log);

  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  init();
  res.render('index', { title: 'Express' });
});

module.exports = router;
