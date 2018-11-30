/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.get(key, (err, value) => {
                if (err) {
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    } else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                } else {
                    resolve(value);
                }
            });

            // Add your code here, remember un Promises you need to resolve() or reject()
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {

        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.put(key, value, function (err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });

    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        let count = 0;
        return new Promise(function (resolve, reject) {
            self.db.createReadStream()
                .on('data', function (data) {
                    // count each object isnerted
                    count = count + 1
                })
                .on('error', function (err) {
                    // reject with error
                    console.log('Oh my!', err)
                })
                .on('close', function () {
                    // resolve with the count value
                    // console.log('Stream closed')
                    resolve(count)
                });
        });
    }


}

module.exports.LevelSandbox = LevelSandbox;