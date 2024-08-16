import { Router } from 'express';
import { nanoid } from 'nanoid';
import { shortenUrl, redirectUrl } from '../controllers/urlController';
import Url from '../models/urlModel'
import cache from '../cache'

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Shorten a URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The original URL to shorten
 *     responses:
 *       200:
 *         description: URL successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The shortened URL
 */


const router = Router();

router.post('/shorten', async (req, res) => {
    const { originalUrl, customShortUrl } = req.body;

    if(!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required' })
    }

    try {
        
        let url = await Url.findOne({ originalUrl });
        if (url) {
            return res.json(url)
        } else {
            const shortCode = customShortUrl || nanoid(8)

            const existingUrl = await Url.findOne({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });

            if (existingUrl) {
                return res.status(400).json({ error: 'Custom short URL already in use'})
            }
        }

        const shortCode = nanoid(8)
        const shortUrl =  `${req.protocol}://${req.get('host')}/api/url/${shortCode}`;

        url = new Url({ originalUrl, shortUrl, customShortUrl: customShortUrl || null, shortCode });
        await url.save();

        res.json(url)
    } catch (error) {
        console.error('Error shortening URL', error);
        res.status(500).json({ message: 'Server error' })
    }
});

router.get('/:shortCode', async (req, res) => {
    const shortCode = req.params;


    try {
        const shortCode = req.params.shortCode;

        // Check in-memory cache first
        const cachedUrl = cache.get<string>(shortCode);
        if (cachedUrl) {
            return res.redirect(cachedUrl);
        }

        // If not found in cache, query the database
        const url = await Url.findOne({ shortCode: shortCode });

        if (url) {
            // Store the URL in cache
            cache.set(shortCode, url.originalUrl);
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

router.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });
  

export default router;
