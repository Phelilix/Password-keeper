(function() {
    'use strict';

    angular
        .module('app.accountService', [])
        .factory('accountService', accountService);

    /* @ngInject */
    accountService.$inject = ['$q', 'logger'];
    function accountService($q, logger){
        var crypto = require('crypto');
        var fs = require('fs');
        
        let pass = '';
        
        const algorithm = 'aes-256-ctr';
        const location = 'src/app/account/passDigest.json';
        const digest = 'sha512';
        const textFormat = 'utf8';
        const cryptedFormat = 'hex';
        const saltSize = 16;
        const iterations = 100000;
        const keylength = 512;
        
        
        
                    
        return {
            changePassword: changePassword,
            verifyPass: verifyPass,
            getPassword: getPassword,
            setPassword: setPassword
        };
        
        const promiseSerial = funcs =>
            funcs.reduce((promise, func) =>
                promise.then(result =>
                    func().then(Array.prototype.concat.bind(result))),
                    Promise.resolve([]));
                    
        function getPassword(){
            return pass;
        }

        function setPassword(password){
            pass = password;
        }
        
        function changePassword(newPass, oldPass){
            return $q.all({
                salt: generateSalt(saltSize),
                savedDigest: fetchCurrentDigest()
            }).then((parts) => {
                return $q.all({
                    isLoggedIn: verifyPass(oldPass, parts.savedDigest.salt),
                    digest: pbkdf2Hex(newPass, parts.salt, iterations, keylength, digest)
                }).then((components) => {
                    if(components.isLoggedIn){
                        saveJSON({
                            digest: components.digest, salt: parts.salt
                        });
                    }else{
                        logger.info('wrong password.')
                    }
                });
            });
        }
        
        function saveJSON(information){
            fs.writeFileSync(location, JSON.stringify(information));
        }
        
        function verifyPass(pass){
            return Promise.resolve([])
                    .then(all => fetchCurrentDigest().then(Array.prototype.concat.bind(all)))
                    .then(all => pbkdf2Hex(pass, all[0].salt, 100000, 512, 'sha512').then(Array.prototype.concat.bind(all)))
                    .then(all => {if(all[1] === all[0].digest) return true; else return false;});
        }
        
        function fetchCurrentDigest(){
            return getJSONData();
        
            function readFile(location){
                return new Promise(function (resolve, reject){
                    fs.readFile(location, function (err, data){
                        if (err) reject(err); else resolve(data);
                    });
                });
            }

            function getJSONData(){
                return readFile(location).then((data) => {
                    return JSON.parse(data);
                });
            }
        }
        
        function generateSalt(size){
            return randomHexString(size);
            
            function randomHexString(size){
                return randomBytes(size).then((buffer) => {
                    return buffer.toString(cryptedFormat);
                });
            }

            function randomBytes(size){
                return new Promise(function(resolve, reject){
                    crypto.randomBytes(size, function(err, buf){
                        if(err) reject(err); else resolve(buf);
                    });
                });
            }
        }

        function pbkdf2Hex(pass, salt, iterations, keylength, digest){
            return pbkdf2(pass, salt, iterations, keylength, digest)
                    .then(digest => {return digest.toString('hex');});
            
            function pbkdf2(pass, salt, iterations, keylength, digest){
                return new Promise(function(resolve, reject){
                    crypto.pbkdf2(pass, salt, iterations, keylength, digest, (err, derivedKey) => {
                        if (err) reject(err); else resolve(derivedKey);
                    });
                });
            }
        }
    }
})();
