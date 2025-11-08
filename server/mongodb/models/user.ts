import mongoose, { InferSchemaType, Model, Schema, model, models } from "mongoose";

const UserSchema = {
    accountType: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
}

export type UserType = InferSchemaType<typeof UserSchema>;

