import { Request, Response } from 'express';
import shortid from 'shortid';
import URL  from '../models/urlModel';

export const shortenUrl = async (req: Request, res: Response) => {
  const { originalUrl } = req.body;

  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlPattern.test(originalUrl)) {
    return res.status(400).json({ message: 'Invalid Url' });
  }

  try {
    const shortCode = shortid.generate()

    let url = await URL.findOne({ shortCode });
    if (url) {
        return res.status(500).json({ message: 'Short code collision, please try again'})
    }

    url = new URL({ originalUrl, shortCode });
    await url.save();

    const shortenedUrl = `${req.protocol}://${req.get('host')}/api/url/${shortCode}`;
    res.json({ originalUrl, shortenedUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error'});
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    
    const url = await URL.findOne({ shortCode: code });


    if (url) {
        return res.redirect(url.originalUrl);
    } else {

        return res.status(404).json({ message: 'URL Not Found'})
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
