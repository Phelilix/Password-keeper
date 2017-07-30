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
        const iterations = 100000;
        const keylength = 512;


        return {
            verifyPass: verifyPass,
//            pbkdf2Hex: pbkdf2Hex,
            changePassword: changePassword,
            isAuthorized: isAuthorized,
            login: login,
            loadPockets: getPockets,
            savePockets: savePockets
//            generateSalt: randomHexString
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
                    }, () => {
                        AuthEventBroadcastService.loginFailed();
                        reject();
                    });
            function getUserData(credentials) {
                credentials.roles = [USER_ROLES.accountHolder];
                return credentials;
            }
            function verifyCred(credentials) {
                return verifyPass(credentials.password);
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
            return $q.all({
                salt: randomHexString(saltSize),
                savedDigest: fetchCurrentDigest()
            }).then((parts) => {
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
                                console.log('if you read this, it means that i have already passed on.');
                            }, rejectReason => {
                                console.log('if you read this, it means that i did not pass on?');
                            });

                });
            }, function (rejectReason) {
                console.log(rejectReason);
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
                            reject(pass);
                        }
                    });
        }

        function savePockets(pockets, pass) {
            return savePockets(pockets, pass);

            function savePockets(pockets, pass) {
                var saltPromises = pockets.map(function (pocket) {
                    return randomHexString(16);
                });

                return $q.all(saltPromises).then((salts) => {
                    pockets.forEach(function (pocket, index, array) {
                        pocket.salt = salts[index];
                        pocket.data = encrypt(pass + pocket.salt, JSON.stringify(pocket.data));
                    });
                    return pockets || [/*{data: "", salt: ""}*/];
                }).then(pockets => {
                    return saveJSON(pockets)
                });
            }

            function encrypt(pass, encryptable) {
                var cipher = crypto.createCipher(algorithm, pass);
                var crypted = cipher.update(encryptable, textFormat, cryptedFormat);
                crypted += cipher.final(cryptedFormat);
                return crypted;
            }

            function saveJSON(information) {
                fs.writeFileSync(vaultLocation, JSON.stringify(information));
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