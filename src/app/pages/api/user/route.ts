import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../../server/mongodb/index';
import User from '../../../../../server/mongodb/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { accountType, userName, email, password, confirmPassword } = req.body;

    if (!accountType || !userName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ accountType, userName, email, password });
    await newUser.save();

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        accountType: newUser.accountType,
      },
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
