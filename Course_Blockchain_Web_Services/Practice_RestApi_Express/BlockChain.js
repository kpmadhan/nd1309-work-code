const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    generateGenesisBlock() {
        console.log('creating genesis block')
        // Add your code here
        let self = this;
        return new Promise((resolve, reject) => {
            self.getBlockHeight().then((blockheight) => {
                if (blockheight === 0) {
                   
                    self.addBlock("First block in the chain - Genesis block").then(function (block) {
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

    // Get block height, it is auxiliar method that return the height of the blockchain
    getBlockHeight() {

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

    // Add new block
    addBlock(data) {
        // Add your code here
        let self = this;

        return new Promise((resolve, reject) => {
            let block = new Block.Block(data);
            self.getBlockHeight().then((blockheight) => {
                let height = parseInt(blockheight);
                console.log(height)
                if (height === 0) {
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    block.previousBlockHash = "";
                    self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockUpdated) => {
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


    // Get Block By Height
    getBlock(height) {
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

}

module.exports.Blockchain = Blockchain;