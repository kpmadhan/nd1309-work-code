const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        //this.blocks = [];
        this.myBlockChain = new BlockChain.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /*
    GET Block Endpoint - 
    Configured a GET request using URL path with a block height parameter.
    The response for the endpoint provides block object in a JSON format. 
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // Add your code here
            this.myBlockChain.getBlock(req.params.index).then((block) => {
                console.log(JSON.stringify(block));
                if(block) {
                res.setHeader('Content-Type', 'application/json');
                res.send(block);
                }
                else {
                    res.status(404).send('No such block exist ')
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }

 
     /*
    POST Block Endpoint - 
    Configured a POST request using body with a block data.
    that allows posting a new block with the data payload option to add data to the block body.
    On Missing Data appropriate error will be thrown with a status code of 500.
    The response for the endpoint provides block object in a JSON format. 
     */

    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here
            if (!req.body.body) {
                res.status(500).send('Data Missing')

            } else {
                this.myBlockChain.addBlock(req.body.body).then((result) => {
                    console.log(result);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(result);
                });
            }
        });
    }



}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => {
    return new BlockController(app);
}