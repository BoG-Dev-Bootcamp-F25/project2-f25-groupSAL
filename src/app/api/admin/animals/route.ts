import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../../server/mongodb';
import Animal from '../../../../../server/mongodb/models/Animal';
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

        // Fetch all animals and include owner's userName, most-recent first
        const animals = await Animal.find()
            .populate('owner', 'userName')
            .sort({ _id: -1 })
            .exec();

        return NextResponse.json({ animals }, { status: 200 });

    } catch (err) {
        console.error('Error fetching animals:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
