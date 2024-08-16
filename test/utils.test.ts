import { Request, Response } from 'express'
import { shortenUrl } from '../src/controllers/urlController'; // Replace with your actual function

describe('shortenUrl', () => {
  it('should generate a string of length 6', () => {
    const req = {} as Request;
    const res = {
        json: jest.fn()
    } as unknown as Response;

    shortenUrl(req, res);

    expect(res.json).toHaveBeenCalled();
  });
});
