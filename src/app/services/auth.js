(function () {
    angular
            .module('app.services')
            .factory('AuthService', AuthService);

    AuthService.$inject = ['Session', 'AuthEventBroadcastService', '$q', 'logger', 'USER_ROLES'];
    function AuthService(Session, AuthEventBroadcastService, $q, logger, USER_ROLES) {
        const crypto = require('crypto');
        const fs = require('fs');
        
        const app = requireApp();

        const algorithm = 'aes-256-ctr';
        const vaultLocation = app.getPath('userData').concat('\\vault.json');
        const location = app.getPath('userData').concat('\\password.json');
        const digest = 'sha512';
        const textFormat = 'utf8';
        const cryptedFormat = 'hex';
        const saltSize = 16;
        const iterations = 5000;
        const keylength = 512;


        return {
            changePassword: changePassword,
            isAuthorized: isAuthorized,
            login: login,
            passwordFileExists: passwordFileExists,
            createNewUser: createNewUser,
            loadPockets: getPockets,
            savePockets: savePockets
        };
        
        function requireApp(){
            var electron = require('electron');
            return electron.remote.app;
        }

        function randomHexString(size) {
            return randomHexString(size);

            function randomHexString(size) {
                return randomBytes(size).then((buffer) => {
                    return buffer.toString(cryptedFormat);
                });
            }

            function randomBytes(size) {
                return new Promise(function (resolve, reject) {
                    crypto.randomBytes(size, (err, buf) => {
                        if (err)
                            reject(err);
                        else
                            resolve(buf);
                    });
                });
            }
        }

        function login(credentials) {
            return verifyCred(credentials)
                    .then(() => {
                        Session.create(getUserData(credentials));
                        AuthEventBroadcastService.loginSuccess();
                        return;
                    }, (err) => {
                        AuthEventBroadcastService.loginFailed();
                        throw err;
                    });
            function verifyCred(credentials) {
                return verifyPass(credentials.password);
            }
        }
        
        function getUserData(credentials) {
            credentials.roles = [USER_ROLES.accountHolder];
            return credentials;
        }
        
        function passwordFileExists(){
            return fileExists(location);
            
            function fileExists(location){
                try{
                    fs.accessSync(location);
                    return true;
                }catch(err){
                    return false;
                }
            }
        }
        
        function createNewUser(newPass){
            newPass = newPass || "";
            
            return Promise.resolve([])
                .then(all => randomHexString(saltSize).then(Array.prototype.concat.bind(all)))
                .then(all => pbkdf2Hex(newPass, all[0], iterations, keylength, digest).then(Array.prototype.concat.bind(all)))
            .then(all => {
                destroyUser();
                return saveJSON({digest: all[1], salt: all[0]});
            });
            
            function destroyUser(){
                return $q.all({
                    pockets: savePockets([], ''),
                    session: Session.destroy()
                });
            }
            
            function saveJSON(information) {
                fs.writeFileSync(location, JSON.stringify(information));
            }
        }

        function isAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            if (authorizedRoles.indexOf('*') !== -1)
                return true;
            if (!Session.isAuthenticated() && authorizedRoles.indexOf(USER_ROLES.public) !== -1)
                return true;
            if (Session.isAuthenticated() && authorizedRoles.indexOf(USER_ROLES.public) !== -1)
                return false;
            return Session.isAuthenticated() && Session.getRoles().some(elem => authorizedRoles.indexOf(elem) !== -1);
        }

        function changePassword(pass, newPass) {
            return Promise.resolve({})
                    .then(parts => randomHexString(saltSize).then(salt => {parts.salt = salt; return parts;}))
                    .then(parts => fetchCurrentDigest().then(x => {parts.savedDigest = x; return parts;}))
                    .then(parts => {
                return $q.all({
                    isLoggedIn: verifyPass(pass, parts.savedDigest.salt),
                    digest: pbkdf2Hex(newPass, parts.salt, iterations, keylength, digest)
                }).then((components) => {
                    getPockets(pass)
                            .then(pockets => savePockets(pockets, newPass))
                            .then(response => {
                                saveJSON({digest: components.digest, salt: parts.salt});
                                Session.destroy();
                                AuthEventBroadcastService.logOut();
                            });

                });
            });
            function saveJSON(information) {
                fs.writeFileSync(location, JSON.stringify(information));
            }
        }

        function pbkdf2Hex(pass, salt, iterations, keylength, digest) {
            return pbkdf2(pass, salt, iterations, keylength, digest)
                    .then(digest => {
                        return digest.toString(cryptedFormat);
                    });
            function pbkdf2(pass, salt, iterations, keylength, digest) {
                return new Promise(function (resolve, reject) {
                    crypto.pbkdf2(pass, salt, iterations, keylength, digest, (err, derivedKey) => {
                        if (err)
                            reject(err);
                        else
                            resolve(derivedKey);
                    });
                });
            }
        }

        function fetchCurrentDigest() {
            return getJSONData();

            function getJSONData() {
                return readFile(location).then((data) => {
                    return JSON.parse(data);
                });
            }
            function readFile(location) {
                return new Promise(function (resolve, reject) {
                    fs.readFile(location, function (err, data) {
                        if (err)
                            reject(err);
                        else
                            resolve(data);
                    });
                });
            }
        }

        function verifyPass(pass) {
            return Promise.resolve([])
                    .then(all => fetchCurrentDigest().then(Array.prototype.concat.bind(all)))
                    .then(all => pbkdf2Hex(pass, all[0].salt, iterations, keylength, digest).then(Array.prototype.concat.bind(all)))
                    .then(all => {
                        if (all[1] === all[0].digest) {
                            return;
                        } else {
                            reject('wrong password');
                        }
                    });
        }

        function savePockets(pockets, pass) {
            return savePockets(pockets, pass);

            function savePockets(pockets, pass) {
                return $q.all(pockets.map(pocket => {
                    return randomHexString(16).then(newSalt => {
                        return {
                            salt: newSalt,
                            data: encrypt(pass + newSalt, JSON.stringify(pocket.data))
                        };
                    }).then(pocket => {
                        return JSON.stringify(pocket);
                    });
                })).then(pockets => {
                    pockets = pockets || [];
                    return save('['+pockets+']');
                });
            }

            function encrypt(pass, encryptable) {
                var cipher = crypto.createCipher(algorithm, pass);
                var crypted = cipher.update(encryptable, textFormat, cryptedFormat);
                crypted += cipher.final(cryptedFormat);
                return crypted;
            }
            
            function save(information){
                fs.writeFileSync(vaultLocation, information);
            }
        }

        function getPockets(pass) {
            return getPockets(pass);

            function getPockets(pass) {
                return getJSONData().then(pockets => decryptPockets(pockets, pass));
            }

            function getJSONData() {
                return readFile(vaultLocation).then(data => {return JSON.parse(data);});
            }

            function readFile(vaultLocation) {
                return new Promise(function (resolve, reject) {
                    fs.readFile(vaultLocation, function (err, data) {
                        if (err)
                            reject(err);
                        else
                            resolve(data);
                    });
                });
            }

            function decryptPockets(pockets, pass) {
                pockets.forEach(function (pocket) {
                    try {
                        pocket.data = JSON.parse(decrypt(pass + pocket.salt, pocket.data));
                    } catch (SyntaxError) {
                        pocket.data = pocket.salt;
                        throw SyntaxError;
                    }
                });
                return pockets;
            }

            function decrypt(pass, text) {
                var decipher = crypto.createDecipher(algorithm, pass);
                var dec = decipher.update(text, cryptedFormat, textFormat);
                dec += decipher.final(textFormat);
                return dec;
            }
        }
    }
})();