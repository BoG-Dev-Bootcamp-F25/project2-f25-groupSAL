import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../../server/mongodb';
import Animal from '../../../../../server/mongodb/models/Animal';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    await connectToDatabase();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token found" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
        } catch {
            return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
        }

        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
        }

        // Fetch all animals without filtering by owner
        const animals = await Animal.find()
            .populate('owner', 'userName email') // include owner's name and email
            .exec();

        return NextResponse.json({
            animals: animals.map(animal => ({
                _id: animal._id,
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner,
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            }))
        }, { status: 200 });

    } catch (err) {
        console.error('Error fetching all animals:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
