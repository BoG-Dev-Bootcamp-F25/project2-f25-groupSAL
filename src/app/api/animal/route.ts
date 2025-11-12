import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import Animal from '../../../../server/mongodb/models/Animal';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const {name, breed, owner, hoursTrained, profilePicture} = await req.json();

        if (!name || !breed || !owner || !hoursTrained || !profilePicture) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const newAnimal = new Animal({
            name,
            breed,
            owner: new mongoose.Types.ObjectId(owner), // Convert to ObjectId
            hoursTrained,
            profilePicture,
        });

        await newAnimal.save();

        return NextResponse.json({
            message: 'Animal created',
            animal: {
                id: newAnimal._id,
                name: newAnimal.name,
                breed: newAnimal.breed,
                owner: newAnimal.owner,
                hoursTrained: newAnimal.hoursTrained,
                profilePicture: newAnimal.profilePicture,
            },
        }, { status: 200 });

        
    } catch (err) {
        console.error('Error creating animal:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}