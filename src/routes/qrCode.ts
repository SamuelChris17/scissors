import express, { Request, Response } from 'express';
import { Router } from 'express';
import axios from 'axios';
import Url from '../models/urlModel';

const router = Router();

const QR_CODE_API_URL = 'https://api.qr-code-generator.com/v1/create?access-token=nQI0BYdAEfDsH45uxsANcswcrza-idY369K-h4Jg0ApeUcSLyB7mqdVUCr5HstMQ';
const API_KEY = 'nQI0BYdAEfDsH45uxsANcswcrza-idY369K-h4Jg0ApeUcSLyB7mqdVUCr5HstMQ'

router.get('/qr/:code', async (req, res) => {
    const { code } = req.params;

    const url = await Url.findOne({ shortCode: code });

    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }

    try {
        const qrResponse = await axios.get(QR_CODE_API_URL, {
            params: {
                data: url.shortUrl,
                size: '300x300'
            },
            responseType: 'arraybuffer' 
        });

        res.setHeader('Content-Type', 'image/png');
        res.send(qrResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Error generating QR code' });
    }
});


router.post('/generate-qr', async (req: Request, res: Response) => {
    const { shortUrl } = req.body;

    if (!shortUrl) {
        return res.status(400).json({ error: 'shortUrl is required' });
    }

    try {
        const requestBody = {
            "frame_name": "no-frame",
            "qr_code_text": shortUrl,
            "image_format": "SVG", 
            "qr_code_logo": "scan-me-square"
        };

        const qrResponse = await axios.post(QR_CODE_API_URL, requestBody, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer' 
        });

        res.setHeader('Content-Type', 'image/svg+xml'); 
        res.send(qrResponse.data);
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});



export default router;
