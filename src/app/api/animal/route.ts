import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import Animal from '../../../../server/mongodb/models/Animal';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({message: "Unauthorized: No token found"}, {status: 401});
        }

        let userId: string;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
            userId = decode.id
        } catch {
            return NextResponse.json( {message: "Unauthorized: No token found"}, {status: 401})
        }

        //no owner here, cookie has it
        const {name, breed, hoursTrained, profilePicture} = await req.json();

        if (!name || !breed || !hoursTrained || !profilePicture) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const newAnimal = new Animal({
            name,
            breed,
            owner: new mongoose.Types.ObjectId(userId), // convert 
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