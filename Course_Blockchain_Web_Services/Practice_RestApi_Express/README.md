# Project #3. Blockchain Webservices

This is Project 3 on Blockchain Nanodegree, as a part of this project I have extended the previous project on private project and exposed the following api's for an user to consume

1. GET /block/:id - to get the block details of a given index

2. POST /block - to add a new block into our private blockchain network with the given data.

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

4. To get the block details of the genesis block try the API URL -
GET http://localhost:8000/block/0

5. To add a new block try the API URL -
POST http://localhost:8000/block 
with say the following payload

```{
      "body": "Testing block with test string data"
}
```

## Implementation

1) This Project uses Express JS framework !

2) APIs are exposed in 8000 port



## Testing the project

The files __Blockcontroller.js__  -> BlockChain.js__ -> LevelSandbox.js__in the root directory has all the implementation logics to be able to test the project, please review the comments in the file.


core implementation below

GET /block/:index

```

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
        
```

POST /block

```

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
    

```


## What did I learn with this Project

* I was able to Leverage the previous project experience to persist the Blockchain data in LevelDB
* I was able to Use node framework ( ExpressJS in this case ) to create a REST API for the basic create and retrieve operations.

