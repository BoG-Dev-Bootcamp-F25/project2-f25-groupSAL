import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../server/mongodb';
import User from '../../../../../server/mongodb/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
      },
    }, { status: 200 });

  } catch (err) {
    console.error('Error during login:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
