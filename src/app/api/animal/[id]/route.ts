import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../../server/mongodb';
import Animal from '../../../../../server/mongodb/models/Animal';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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
            return NextResponse.json( {message: "Unauthorized: Invalid token"}, {status: 401})
        }

        const resolvedParams = await Promise.resolve(params);
        const animalId = resolvedParams.id;
        
        const animal = await Animal.findOne({ 
            _id: new mongoose.Types.ObjectId(animalId),
            owner: new mongoose.Types.ObjectId(userId)
        })
        .populate('owner', 'userName')
        .exec();

        if (!animal) {
            return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
        }

        return NextResponse.json({
            animal: {
                _id: animal._id,
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner,
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            }
        }, { status: 200 });

    } catch (err) {
        console.error('Error fetching animal:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

