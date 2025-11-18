import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../../server/mongodb';
import TrainingLog from '../../../../../server/mongodb/models/TrainingLog';
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

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, email: string, accountType: string };
        } catch {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        if (decoded.accountType !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        // Fetch all training logs
        const logs = await TrainingLog.find()
            .sort({ date: -1 })
            .populate('owner', 'userName email')  // include owner info
            .populate('animal', 'name breed')    // include animal info
            .exec();

        return NextResponse.json({
            trainingLogs: logs.map(log => ({
                _id: log._id,
                title: log.title,
                date: log.date,
                hoursLogged: log.hoursLogged,
                description: log.description,
                // normalize to the same shape as the non-admin endpoint / TrainingLog model
                ownerName: (log as any).owner?.userName || (log as any).ownerName || '',
                animalName: (log as any).animal?.name || (log as any).animalName || '',
                breed: (log as any).animal?.breed || (log as any).breed || '',
                // include originals if needed
                owner: log.owner,
                animal: log.animal,
            }))
        }, { status: 200 });

    } catch (err) {
        console.error('Error fetching training logs:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
