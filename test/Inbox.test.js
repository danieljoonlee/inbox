const assert                  = require('assert');
const ganache                 = require('ganache-cli');
const Web3                    = require('web3');
const { interface, bytecode } = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider); // Can provide other networks 

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';
const SET_MESSAGE = "Bye there!";

beforeEach(async () => {
  /* Get a list of all unlocked accounts ganache provides
  [ '0xec5961d52Abb6aC9B4E26568aD9333277306fd8D',
  '0x1f748d7A9c471d283CA235BE4f7EF724bA56Fc0f',
  '0xcdc3929De7a7Bf7E83c3dc06D3B1FEf68240A6A3',
  '0xd554496BEB01BD722D9A9E654cFBBf8BcC7daC91',
  '0xedE3d4AF3a7Ad3f8767B4755e5AF69C23289c642',
  '0xc5Ee668B86571194CC92cad85f44bcc5C3278d2d',
  '0xEEd145034E5e0872eC39C7A1285A11d27cd072f9',
  '0x8b0b39E5Eed2C596F16F6fb396cde66dCC175226',
  '0xB93518F12f4bce1aFcD240798664519fd24A3c5E',
  '0xA8dA9D7b2704F041F2ad24d23EE15EDEC7B9D65f' ]
  */

  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // ABI = JSON.parse(interface) - interface between javascript and solidity
     // Tells web3 that we want to deploy a new copy of this contract; 
     // data takes bytecode; spread array arguments into constructor function; 
     // calling deploy does not deploy, starts to create an object that can be deployed into network
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] }) 
     // send triggers communication from web3 to network/provider;1 million; instructs web3 to send out a transaction that creates this contract
    .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage(SET_MESSAGE).send({ from: accounts[0] }); // accounts[0] pays for fee
    const message = await inbox.methods.message().call();
    assert.equal(message, SET_MESSAGE);
  });
});

/* Inbox Blockchain
 Inbox
Contract { **Constructed from web3 library
  currentProvider: [Getter/Setter], **communication layer with blockchain
  _requestManager:  **tied to provider, faciliates communication with blockchain
   RequestManager {
     provider: null,
     providers: **3 types of providers
      { WebsocketProvider: [Function: WebsocketProvider],
        HttpProvider: [Function: HttpProvider],
        IpcProvider: [Function: IpcProvider] }, **network on same machine as test setup
     subscriptions: {} },
  givenProvider: null,
  providers: 
   { WebsocketProvider: [Function: WebsocketProvider],
     HttpProvider: [Function: HttpProvider],
     IpcProvider: [Function: IpcProvider] },
  _provider: null,
  setProvider: [Function],
  BatchRequest: [Function: bound Batch],
  extend: 
   { [Function: ex]
     formatters: 
      { inputDefaultBlockNumberFormatter: [Function: inputDefaultBlockNumberFormatter],
        inputBlockNumberFormatter: [Function: inputBlockNumberFormatter],
        inputCallFormatter: [Function: inputCallFormatter],
        inputTransactionFormatter: [Function: inputTransactionFormatter],
        inputAddressFormatter: [Function: inputAddressFormatter],
        inputPostFormatter: [Function: inputPostFormatter],
        inputLogFormatter: [Function: inputLogFormatter],
        inputSignFormatter: [Function: inputSignFormatter],
        outputBigNumberFormatter: [Function: outputBigNumberFormatter],
        outputTransactionFormatter: [Function: outputTransactionFormatter],
        outputTransactionReceiptFormatter: [Function: outputTransactionReceiptFormatter],
        outputBlockFormatter: [Function: outputBlockFormatter],
        outputLogFormatter: [Function: outputLogFormatter],
        outputPostFormatter: [Function: outputPostFormatter],
        outputSyncingFormatter: [Function: outputSyncingFormatter] },
     utils: 
      { _fireError: [Function: _fireError],
        _jsonInterfaceMethodToString: [Function: _jsonInterfaceMethodToString],
        randomHex: [Function: randomHex],
        _: [Function],
        BN: [Function],
        isBN: [Function: isBN],
        isBigNumber: [Function: isBigNumber],
        isHex: [Function: isHex],
        isHexStrict: [Function: isHexStrict],
        sha3: [Function],
        keccak256: [Function],
        soliditySha3: [Function: soliditySha3],
        isAddress: [Function: isAddress],
        checkAddressChecksum: [Function: checkAddressChecksum],
        toChecksumAddress: [Function: toChecksumAddress],
        toHex: [Function: toHex],
        toBN: [Function: toBN],
        bytesToHex: [Function: bytesToHex],
        hexToBytes: [Function: hexToBytes],
        hexToNumberString: [Function: hexToNumberString],
        hexToNumber: [Function: hexToNumber],
        toDecimal: [Function: hexToNumber],
        numberToHex: [Function: numberToHex],
        fromDecimal: [Function: numberToHex],
        hexToUtf8: [Function: hexToUtf8],
        hexToString: [Function: hexToUtf8],
        toUtf8: [Function: hexToUtf8],
        utf8ToHex: [Function: utf8ToHex],
        stringToHex: [Function: utf8ToHex],
        fromUtf8: [Function: utf8ToHex],
        hexToAscii: [Function: hexToAscii],
        toAscii: [Function: hexToAscii],
        asciiToHex: [Function: asciiToHex],
        fromAscii: [Function: asciiToHex],
        unitMap: [Object],
        toWei: [Function: toWei],
        fromWei: [Function: fromWei],
        padLeft: [Function: leftPad],
        leftPad: [Function: leftPad],
        padRight: [Function: rightPad],
        rightPad: [Function: rightPad],
        toTwosComplement: [Function: toTwosComplement] },
     Method: [Function: Method] },
  clearSubscriptions: [Function],
  options: **information from contract deployed.  address property
   { address: [Getter/Setter], **where it exists on blockchain
     jsonInterface: [Getter/Setter],
     data: undefined,
     from: undefined,
     gasPrice: undefined,
     gas: undefined },
  defaultAccount: [Getter/Setter],
  defaultBlock: [Getter/Setter],
  methods: **functions we can interact with contract
   { setMessage: [Function: bound _createTxObject],
     '0x368b8772': [Function: bound _createTxObject],
     'setMessage(string)': [Function: bound _createTxObject],
     message: [Function: bound _createTxObject],
     '0xe21f37ce': [Function: bound _createTxObject],
     'message()': [Function: bound _createTxObject] },
  events: { allEvents: [Function: bound ] },
  _address: '0x94273db9956F202C384Ba396dF45820CeE8654e8',
  _jsonInterface: 
   [ { constant: false,
       inputs: [Array],
       name: 'setMessage',
       outputs: [],
       payable: false,
       stateMutability: 'nonpayable',
       type: 'function',
       signature: '0x368b8772' },
     { constant: true,
       inputs: [],
       name: 'message',
       outputs: [Array],
       payable: false,
       stateMutability: 'view',
       type: 'function',
       signature: '0xe21f37ce' },
     { inputs: [Array],
       payable: false,
       stateMutability: 'nonpayable',
       type: 'constructor',
       signature: 'constructor' } ] }
*/