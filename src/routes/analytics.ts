import express, { Request, Response } from 'express';
import Url from '../models/urlModel';

const router = express.Router();

router.get('/:shortUrl/analytics', async (req: Request, res: Response) => {
    try {
        const shortUrl = req.params.shortUrl;
        const url = await Url.findOne({ shortUrl });

        if (url) {
            const analyticsData = {
                totalClicks: url.clicks,
                clickDetails: url.clickDetails
            };
            return res.json(analyticsData);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

export default router;
