import SecureStorage from 'secure-web-storage';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'mysecretkey';

const secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
        key = CryptoJS.SHA256(key, SECRET_KEY);
        return key.toString();
    },
    encrypt: function encrypt(data) {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);
        data = data.toString();
        return data;
    },
    decrypt: function decrypt(data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        data = data.toString(CryptoJS.enc.Utf8);
        return data;
    }
});
 

  export default  class Authentication {
        static getitem (key){
           return  secureStorage.getItem(key);
        }
    

        static setItem(key,item){
          secureStorage.setItem(key, item);
        }

        static remove(key){
          secureStorage.removeItem(key);
        }

        
    }

    