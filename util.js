const crypto = require('crypto'); 

let util = {};
util.getSalt = () => {
   let salt;
    salt = crypto.randomBytes(16).toString('base64'); 
    return salt;
 }  
 util.getHash = (salt, password) => {
     let hash = crypto.createHmac('sha512', salt.toString()); 
     hash.update(password);
     var value = hash.digest('hex');
     return value; 
 } 
  
 module.exports = util;