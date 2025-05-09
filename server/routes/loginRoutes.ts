import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User.ts';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
       res.status(404).json({ message: 'Користувач не знайден' });
      return
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
       res.status(401).json({ message: 'Неправильний пароль' });
      return
    }

    const token = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token,
      user: { id: user._id, phone: user.phone, name: user.name },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Авторізація не була успішною', error: err });
  }
});

export default router;
