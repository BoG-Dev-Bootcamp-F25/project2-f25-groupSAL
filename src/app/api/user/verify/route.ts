import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../server/mongodb';
import User from '../../../../../server/mongodb/models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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

    const res =  NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
      },
    }, { status: 200 });

    // addig cookies yum
    res.cookies.set(
        'token', 
        token, 
        { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax', // Add this line
            maxAge: 7 * 24 * 60 * 60, 
            path: '/'
        }
    );

    return res;
    

  } catch (err) {
    console.error('Error during login:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
