import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '../../../../../server/mongodb';
import TrainingLog from '../../../../../server/mongodb/models/TrainingLog';
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
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
    }

    let userId: string;
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email?: string; accountType?: string };
      userId = decode.id;
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const resolved = await Promise.resolve(params);
    const id = resolved.id;

    const log = await TrainingLog.findById(id).exec();
    if (!log) return NextResponse.json({ message: 'Training log not found' }, { status: 404 });

    if (log.owner.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden: Not the owner' }, { status: 403 });
    }

    return NextResponse.json({ trainingLog: log }, { status: 200 });
  } catch (err) {
    console.error('Error fetching training log:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  await connectToDatabase();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 });
    }

    let userId: string;
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email?: string; accountType?: string };
      userId = decode.id;
    } catch (err) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const resolved = await Promise.resolve(params);
    const id = resolved.id;

    const log = await TrainingLog.findById(id).exec();
    if (!log) return NextResponse.json({ message: 'Training log not found' }, { status: 404 });

    if (log.owner.toString() !== userId) {
      return NextResponse.json({ message: 'Forbidden: Not the owner' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, hours } = body;

    // Keep track of previous state
    const prevHours = Number(log.hoursLogged || 0);
    const prevAnimalId = log.animal ? log.animal.toString() : null;

    // Validate hours if provided
    let newHours: number | null = null;
    if (hours !== undefined) {
      newHours = Number(hours);
      if (isNaN(newHours) || newHours < 0) {
        return NextResponse.json({ message: 'Invalid hours value' }, { status: 400 });
      }
    }

    // Update fields (animal cannot be changed after creation)
    if (title !== undefined) log.title = title;
    if (description !== undefined) log.description = description;
    if (newHours !== null) log.hoursLogged = newHours;

    await log.save();

    // Update animal hours trained: same-animal hour delta only
    if (newHours !== null) {
      const delta = newHours - prevHours;
      if (delta !== 0 && prevAnimalId) {
        const targetAnimal = await Animal.findById(prevAnimalId).exec();
        if (targetAnimal) {
          targetAnimal.hoursTrained = Math.max(0, (targetAnimal.hoursTrained || 0) + delta);
          await targetAnimal.save();
        }
      }
    }

    return NextResponse.json({ message: 'Training log updated', trainingLog: log }, { status: 200 });
  } catch (err) {
    console.error('Error updating training log:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
