/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    /* ==== Rubricks 3 =======
addBlock function updated to store newBlock within LevelDB 
==========================*/

    // Auxiliar method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock() {
        console.log('creating genesis block')
        // Add your code here
        let self = this;
        return new Promise((resolve, reject) => {
            self.getBlockHeight().then((blockheight) => {
                if (blockheight === 0) {
                    let genBlock = new Block.Block("Genesis Block");
                    self.addBlock(genBlock).then(function (block) {
                        console.log("Genesis Block Added");
                        console.log(block);
                        resolve(block);
                    }, reason => {
                        reject("Error Creating Genesis Block");
                        console.log(reason); // Error!
                    });
                } else {
                    resolve("Genesis Block created already");
                }

            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

    /* ==== Rubricks 7 =======
   added  getBlockHeight() function that retreives the block height from the levelDB

==========================*/

    // Get block height, it is auxiliar method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.getBlocksCount().then((count) => {
                resolve(parseInt(count));
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

    /* ==== Rubricks 2 , 3 =======
#2 - addBlock function updated to store newBlock within LevelDB 
#3 - Logic to check if the genesis block exist if not add the 'genesis block'
==========================*/

    // Add new block
    addBlock(block) {
        // Add your code here
        let self = this;

        return new Promise((resolve, reject) => {

            self.getBlockHeight().then((blockheight) => {
                let height = parseInt(blockheight);
                console.log(height)
                if (height === 0) {
                    block.time = new Date().getTime().toString().slice(0, -3);
                    block.height = height;
                    block.hash = SHA256(JSON.stringify(block)).toString();

                    self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockUpdated) => {
                        // console.log(`Added Block id: ${height} , hash: ${blockUpdated.hash} , prevHash: ${blockUpdated.previousBlockHash}`)
                        resolve(blockUpdated);
                    }).catch((err) => {
                        console.log(err);
                        reject(err)
                    });

                } else {
                    self.getBlock(height - 1).then((_prevBlock) => {
                        // console.log(prevBlock);
                        let prevBlock = JSON.parse(_prevBlock)
                        block.previousBlockHash = prevBlock.hash;
                        block.time = new Date().getTime().toString().slice(0, -3);
                        block.height = height;
                        block.hash = SHA256(JSON.stringify(block)).toString();

                        self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockUpdated) => {
                            console.log(`Added new Block #${height}`)
                            resolve(blockUpdated);
                        }).catch((err) => {
                            console.log(err);
                            reject(err)
                        });
                    });
                }
            });
        });
    }


    /* ==== Rubricks 6 =======
   added  getBlock() function that retreives the block details for the given height from the levelDB

==========================*/




    // Get Block By Height
    getBlock(height) {
        // Add your code here
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.getLevelDBData(height).then((block) => {
                //  console.log(`Retreiving block# ${height}`);
                //  console.log(block);
                resolve(block);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }


    /* ==== Rubricks 4 =======
   added implementation to  validateBlock() function to validate a block stored within levelDB
==========================*/




    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        return new Promise((resolve, reject) => {
            // console.log('validateBlock() with ' + blockHeight);
            // get block object
            var blockHeight = parseInt(height);

            this.getBlock(blockHeight).then((parsedRetBlock) => {
                let blockObject = JSON.parse(parsedRetBlock);
                let blockHash = blockObject.hash;
                // remove block hash to test block integrity
                blockObject.hash = '';
                // generate block hash
                let validBlockHash = SHA256(JSON.stringify(blockObject)).toString();
                // Compare
                if (blockHash === validBlockHash) {
                    resolve(true);
                    /*
                    if(blockHeight === 0) { 
                        resolve(true);
                    }

					else if (blockHeight > 0) {
						this.getBlock(blockHeight - 1).then((prevParsedRetBlock) => {
							let prevBlockObject = JSON.parse(prevParsedRetBlock);
							let prevBlockHash = prevBlockObject.hash;
							// previousBlock.hash and block.previousBlockHash
							if (prevBlockHash === blockObject.previousBlockHash) {
								// console.log('Link is valid.');
								resolve(true);
							} else {
                                console.log(`Link ${blockHeight-1} and ${blockHeight} is tampered.`)
								resolve(false);
							}
						},(err) => {
							reject('getBlock() failed to retrieve previous block.');
						});
					}
                */
                } else {

                    console.log(`Block ${blockHeight} has invalid hash ${blockHash} should have been ${validBlockHash}`)
                    resolve(false);
                }
            }, (err) => {
                console.log('validateBlock() failed.');
                reject(err);
            });
        });
    }

    /* ==== Rubricks 5 =======
   added implementation to  validateChain() function to validate all the blocks stored within levelDB
==========================*/

    // Validate Blockchain
    validateChain() {

        return new Promise((resolve, reject) => {



            this.getBlockHeight().then((blockHeight) => {


                let arrayValidation = [];
                // Create an array of promises
                for (var i = 0; i < blockHeight; i++) {
                    arrayValidation.push(this.validateBlock(i))
                }
                return Promise.all(arrayValidation).then(function (values) {

                    console.log(values);
                    resolve(values.every(function (item) {
                        return item === true
                    }))
                });
            }, (err) => {
                reject(false);
                console.log('validateChain() failed because: ' + err);

            });

        });


    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

}

module.exports.Blockchain = Blockchain;