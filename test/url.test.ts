import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import urlRoutes from '../src/routes/url';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());
app.use('/api/url', shortCode);

before(async () => {
  await mongoose.connect(process.env.MONGO_URI as string );
});

after(async () => {
  await mongoose.disconnect();
});

describe('POST /api/url/shorten', () => {
  it('should shorten a URL', async () => {
    const response = await request(app)
      .post('/api/url/shorten')
      .send({ originalUrl: 'https://www.example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toBe('shortCode');
  });
});

describe('GET /api/url/:shortCode', () => {
  it('should redirect to the original URL', async () => {
    const response = await request(app)
      .get('/api/url/test-shortcode'); 

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://www.example.com');
  });
});
