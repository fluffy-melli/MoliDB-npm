const axios = require('axios');
const crypto = require('crypto');
const zlib = require('zlib');

const AES_BLOCK_SIZE = 16;

class Molidb {
    constructor(SERVER_URL = "http://127.0.0.1:17233", SECRET_KEY = "ThisIs32byteAESkeyForThisExample", API_TOKEN = 'ThisIsExampleAPIKey') {
        this.SERVER_URL = SERVER_URL;
        this.SECRET_KEY = SECRET_KEY;
        this.API_TOKEN = API_TOKEN;
    }

    getHeaders() {
        return {
            'Authorization': this.API_TOKEN,
            'Content-Type': 'application/json'
        };
    }

    aesEncrypt(data) {
        const iv = crypto.randomBytes(AES_BLOCK_SIZE);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.SECRET_KEY, 'utf-8'), iv);
        let encryptedData = cipher.update(data);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        return Buffer.concat([iv, encryptedData]);
    }

    aesDecrypt(data) {
        const iv = data.slice(0, AES_BLOCK_SIZE);
        const encryptedData = data.slice(AES_BLOCK_SIZE);
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.SECRET_KEY, 'utf-8'), iv);
        let decryptedData = decipher.update(encryptedData);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        return decryptedData;
    }

    gzipCompress(data) {
        return zlib.gzipSync(data);
    }

    gzipDecompress(data) {
        return zlib.gunzipSync(data);
    }

    async listCollection() {
        try {
            const response = await axios.get(`${this.SERVER_URL}/collection`, { headers: this.getHeaders() });
            if (response.status === 200) {
                const encryptedDataBase64 = response.data.data;
                const encryptedData = Buffer.from(encryptedDataBase64, 'base64');
                const decryptedData = this.aesDecrypt(encryptedData);
                const decompressedData = this.gzipDecompress(decryptedData);
                return JSON.parse(decompressedData.toString());
            }
        } catch (error) {
            throw new Error(`HTTP FAIL: ${error.response.data}`);
        }
    }

    async getCollection(id) {
        try {
            const response = await axios.get(`${this.SERVER_URL}/collection/${id}`, { headers: this.getHeaders() });
            if (response.status === 200) {
                const encryptedDataBase64 = response.data.data;
                const encryptedData = Buffer.from(encryptedDataBase64, 'base64');
                const decryptedData = this.aesDecrypt(encryptedData);
                const decompressedData = this.gzipDecompress(decryptedData);
                return JSON.parse(decompressedData.toString());
            }
        } catch (error) {
            throw new Error(`HTTP FAIL: ${error.response.data}`);
        }
    }

    async updateCollection(id, data) {
        try {
            const jsonData = JSON.stringify(data);
            const compressedData = this.gzipCompress(Buffer.from(jsonData));
            const encryptedData = this.aesEncrypt(compressedData);
            const encryptedDataBase64 = encryptedData.toString('base64');

            const response = await axios.put(`${this.SERVER_URL}/collection/${id}`, {}, {
                headers: {
                    ...this.getHeaders(),
                    'body': encryptedDataBase64
                }
            });

            if (response.status === 200) {
                const encryptedDataBase64 = response.data.data;
                const encryptedData = Buffer.from(encryptedDataBase64, 'base64');
                const decryptedData = this.aesDecrypt(encryptedData);
                const decompressedData = this.gzipDecompress(decryptedData);
                return JSON.parse(decompressedData.toString());
            }
        } catch (error) {
            throw new Error(`HTTP FAIL: ${error.response.data}`);
        }
    }

    async deleteCollection(id) {
        try {
            const response = await axios.delete(`${this.SERVER_URL}/collection/${id}`, { headers: this.getHeaders() });
            if (response.status !== 200) {
                throw new Error(`HTTP FAIL: ${response.data}`);
            }
        } catch (error) {
            throw new Error(`HTTP FAIL: ${error.response.data}`);
        }
    }
}

module.exports = Molidb;
