import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dotenv from 'dotenv';
dotenv.config();

export async function GET(req: Request) {
  await connectToDatabase();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
    }

    let userId: string;
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
      userId = decode.id;
    } catch {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        accountType: user.accountType,
      },
    }, { status: 200 });

  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { userName, email, password, confirmPassword, isAdmin } = await req.json();

    if (!userName || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Don't hash password here - the User model's pre('save') hook will handle it
    const newUser = new User({
      userName,
      email,
      password: password, // Will be hashed by pre('save') hook
      accountType: isAdmin ? 'admin' : 'user',
    });

    await newUser.save();


    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    console.log('Token generated:', token);

    const res = NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        accountType: newUser.accountType,
      },
    }, { status: 201 });

    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });


    return res;

  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
