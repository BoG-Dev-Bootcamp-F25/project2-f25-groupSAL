import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import Animal from '../../../../server/mongodb/models/Animal';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    await connectToDatabase();

    try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();

        console.log('All cookies received:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
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
        const animals = await Animal.find({ owner: new mongoose.Types.ObjectId(userId) })
            .populate('owner', 'userName')
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
            console.error('Error fetching animals:', err);
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
    }


        


export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();

        console.log('All cookies received:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
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

        const {name, breed, hoursTrained, profilePicture} = await req.json();

        if (!name || !breed || hoursTrained === undefined|| !profilePicture) {
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
        console.error('Error updating animal:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
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
        const {_id, name, breed, hoursTrained, profilePicture} = await req.json();

        if (!_id) {
            return NextResponse.json({ message: 'Animal ID is required' }, { status: 400 });
        }

        const animal = await Animal.findOne({ 
            _id: new mongoose.Types.ObjectId(_id),
            owner: new mongoose.Types.ObjectId(userId)
        });

        if (!animal) {
            return NextResponse.json({ message: 'Animal not found' }, { status: 400 });
        }

        if (name !== undefined) animal.name = name;
        if (breed !== undefined) animal.breed = breed;
        if (hoursTrained !== undefined) animal.hoursTrained = hoursTrained;
        if (profilePicture !== undefined) animal.profilePicture = profilePicture;

        await animal.save();

        return NextResponse.json({
            message: 'Animal updated',
            animal: {
                id: animal._id,
                name: animal.name,
                breed: animal.breed,
                owner: animal.owner,
                hoursTrained: animal.hoursTrained,
                profilePicture: animal.profilePicture,
            },
        }, { status: 200 });

        
    } catch (err) {
        console.error('Error updating animal:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}