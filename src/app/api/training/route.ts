import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import Animal from '../../../../server/mongodb/models/Animal';
import TrainingLog from '../../../../server/mongodb/models/TrainingLog';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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
            const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email?: string };
            userId = decode.id;
        } catch (err) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const logs = await TrainingLog.find({ owner: new mongoose.Types.ObjectId(userId) }).sort({ date: -1 }).exec();

        return NextResponse.json({ trainingLogs: logs }, { status: 200 });
    } catch (err) {
        console.error('Error fetching training logs:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
        }

        let userId: string;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email?: string };
            userId = decode.id;
        } catch (err) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const { title, description, hours, animalId } = await req.json();

        if (!title || description === undefined || hours === undefined || !animalId) {
            return NextResponse.json({ message: 'All fields (title, description, hours, animalId) are required' }, { status: 400 });
        }

        const animal = await Animal.findById(animalId).exec();
        if (!animal) {
            return NextResponse.json({ message: 'Animal not found' }, { status: 400 });
        }

        if (animal.owner.toString() !== userId) {
            return NextResponse.json({ message: 'Animal does not belong to the authenticated user' }, { status: 400 });
        }

        const user = await User.findById(userId).exec();
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }

        const hoursNumber = Number(hours);
        if (isNaN(hoursNumber) || hoursNumber < 0) {
            return NextResponse.json({ message: 'Invalid hours value' }, { status: 400 });
        }

        const newLog = new TrainingLog({
            title,
            date: new Date(),
            owner: new mongoose.Types.ObjectId(userId),
            ownerName: (user as any).userName,
            animal: new mongoose.Types.ObjectId(animalId),
            animalName: animal.name,
            breed: animal.breed,
            hoursLogged: hoursNumber,
            description,
        });

        await newLog.save();

        // update animal's hoursTrained
        animal.hoursTrained = (animal.hoursTrained || 0) + hoursNumber;
        await animal.save();

        return NextResponse.json({ message: 'Training log created', trainingLog: newLog }, { status: 201 });
    } catch (err) {
        console.error('Error creating training log:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}