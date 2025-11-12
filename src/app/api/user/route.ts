import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import bcrypt from 'bcryptjs';


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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      accountType: isAdmin ? 'admin' : 'user',
    });

    await newUser.save();

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        accountType: newUser.accountType,
      },
    }, { status: 201 });

  } catch (err) {
    console.error('Error creating user:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
