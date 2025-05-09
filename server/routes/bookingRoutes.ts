import express, {Request, Response} from 'express';
import { Booking } from '../models/Booking.ts';

const router = express.Router();

router.post('/', async (req: Request, res: Response):Promise<void> => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

router.get('/', async (_: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

export default router;
