require('dotenv').load();
const HDWalletProvider = require('truffle-hdwallet-provider'); 
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// specifies which account to unlock and where to use ether from.  what outside node/api to connect to
const provider = new HDWalletProvider(
  process.env.ACCOUNT_MNEMONIC,
  process.env.INFURA_LINK
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] }) 
    .send({ from: accounts[0], gas: '1000000' }); // 1 million

  console.log('Contract deployed to: ', result.options.address);
};

deploy();