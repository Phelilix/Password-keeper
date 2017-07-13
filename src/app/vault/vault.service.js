(function() {
    'use strict';

    angular
        .module('app.vaultService', [])
        .factory('vaultService', vaultService);

    /* @ngInject */
    vaultService.$inject = ['$q', 'logger'];
    function vaultService($q, logger){
        var crypto = require('crypto');
        var fs = require('fs');
        
        const algorithm = 'aes-256-ctr';
        const location = 'src/app/vault/vault.json';
        const digestLoc = ''
        const digest = 'sha512';
        const textFormat = 'utf8';
        const cryptedFormat = 'hex';
        
        return {
            fetchPockets: getJSONData,
            savePockets: saveJSON,
            generateSalt: randomHexString,
            decryptPockets: decryptPockets,
            encryptPockets: encryptPockets,
            pbkdf2: pbkdf2
        };
        
        function decryptPockets(pockets, pass){
            pockets.forEach(function(pocket){
                try{
                    pocket.data = JSON.parse(decrypt(pass+pocket.salt, pocket.data));
                }catch(SyntaxError){
                    pocket.data = {subject: pocket.salt};
                    logger.warning('could not decrypt: ', pocket.salt,'decryption');
                }
            });
            return pockets;
        }
        
        function encryptPockets(pockets, pass){
            var saltPromises = pockets.map(pocket => () => randomHexString(16));
            
            return $q.all(saltPromises)
                    .then(function(salts){
                pockets.forEach(function(pocket, index, array) {
                    pocket.salt = salts[index];
                    pocket.data = encrypt(pass+pocket.salt, JSON.stringify(pocket.data));
                });
                return pockets
            });
        }
        
        
        function randomHexString(size){
            return randomBytes(size).then((buffer) => {
                return buffer.toString(cryptedFormat);
            });
        }

        function saveJSON(information){
            fs.writeFileSync(location, JSON.stringify(information));
        }

        function pbkdf2(pass, salt, iterations, keylength, digest){
            return new Promise(function(resolve, reject){
                crypto.pbkdf2(pass, salt, iterations, keylength, digest, (err, derivedKey) => {
                    if (err) reject(err); else resolve(derivedKey);
                });
            });
        }

        function readFile(location){
            return new Promise(function (resolve, reject){
                fs.readFile(location, function (err, data){
                    if (err) reject(err); else resolve(data);
                });
            });
        }

        function randomBytes(size){
            return new Promise(function(resolve, reject){
                crypto.randomBytes(size, function(err, buf){
                    if(err) reject(err); else resolve(buf);
                });
            });
        }

        function decrypt(pass, text){
            var decipher = crypto.createDecipher(algorithm,pass);
            try{
                var dec = decipher.update(text, cryptedFormat, textFormat);
                dec += decipher.final(textFormat);
                return dec;
            }catch(SyntaxError){
                logger.error('could not decrypt');
            }
        }

        function encrypt(pass, encryptable){
            var cipher = crypto.createCipher(algorithm,pass);
            var crypted = cipher.update(encryptable, textFormat, cryptedFormat);
            crypted += cipher.final(cryptedFormat);
            return crypted;
        }
        
        function getJSONData(){
            return new Promise(function(resolve, reject){
                return readFile(location).then(function(data){
                    resolve(JSON.parse(data));
                }).catch(function(err){
                    reject(err);
                });
            });
        }
    }
})();
