import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import Url from '../models/urlModel';
import { JwtPayload } from 'jsonwebtoken';


const router = express.Router();

// Get all URLs created by the logged-in user
router.get('/history', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as JwtPayload).id;  // Extract user ID from the JWT payload
        const urls = await Url.find({ user: userId });  // Find URLs associated with the user
        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get URL by ID
router.get('/url/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const url = await Url.findById(req.params.id);  // Find URL by ID
        if (!url) {
            return res.status(404).json({ msg: 'URL not found' });
        }
        res.json(url);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
