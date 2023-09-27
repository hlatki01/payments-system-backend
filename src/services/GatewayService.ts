import axios from 'axios';
import crypto from 'crypto';

class GatewayService {
    calculateSignature(timestamp, body?: string) {
        let message = process.env.DLOCAL_X_LOGIN + timestamp;

        if (body) {
            message = message + body
        }

        const hmac = crypto.createHmac('sha256', process.env.DLOCAL_SECRET_KEY);
        hmac.update(message, 'utf-8');
        const signature = hmac.digest('hex');
        return `V2-HMAC-SHA256, Signature: ${signature}`;
    }


    async createPayment(payload: any) {
        const data = JSON.stringify(payload);

        const timestamp = new Date().toJSON();
        const authorization = `${this.calculateSignature(timestamp, data)}`;

        const config = {
            method: 'post',
            url: `${process.env.DLOCAL_HOST}/secure_payments`, // Replace with your actual URL
            headers: {
                'X-Date': timestamp,
                'X-Login': process.env.DLOCAL_X_LOGIN, // Replace with your actual X-Login
                'X-Trans-Key': process.env.DLOCAL_TRANS_KEY, // Replace with your actual X-Trans-Key
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
            data: data
        };

        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }


    async getPayment(paymentId: any) {
        const timestamp = new Date().toJSON();
        const authorization = `${this.calculateSignature(timestamp)}`;

        const config = {
            method: 'get',
            url: `${process.env.DLOCAL_HOST}/payments/${paymentId}`, // Replace with your actual URL
            headers: {
                'X-Date': timestamp,
                'X-Login': process.env.DLOCAL_X_LOGIN, // Replace with your actual X-Login
                'X-Trans-Key': process.env.DLOCAL_TRANS_KEY, // Replace with your actual X-Trans-Key
                'Authorization': authorization,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }

    async getPaymentMethods({ iso }) {
        const timestamp = new Date().toJSON();
        const authorization = `${this.calculateSignature(timestamp)}`;

        const config = {
            method: 'get',
            url: `${process.env.DLOCAL_HOST}/payments-methods?country=${iso}`, // Replace with your actual URL
            headers: {
                'X-Date': timestamp,
                'X-Login': process.env.DLOCAL_X_LOGIN, // Replace with your actual X-Login
                'X-Trans-Key': process.env.DLOCAL_TRANS_KEY, // Replace with your actual X-Trans-Key
                'Authorization': authorization,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }

    async getCurrencyExchange({ currency }) {
        const timestamp = new Date().toJSON();
        const authorization = `${this.calculateSignature(timestamp)}`;

        const config = {
            method: 'get',
            url: `${process.env.DLOCAL_HOST}/currency-exchanges?from=USD&to=${currency}`, // Replace with your actual URL
            headers: {
                'X-Date': timestamp,
                'X-Login': process.env.DLOCAL_X_LOGIN, // Replace with your actual X-Login
                'X-Trans-Key': process.env.DLOCAL_TRANS_KEY, // Replace with your actual X-Trans-Key
                'Authorization': authorization,
                'Content-Type': 'application/json',
            }
        };

        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }
}

export { GatewayService };
