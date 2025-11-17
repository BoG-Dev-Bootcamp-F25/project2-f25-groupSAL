import mongoose, { Schema, model, models, InferSchemaType } from 'mongoose';
import argon2 from 'argon2';

const userSchema = new Schema({
  accountType: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  next();
});


userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return argon2.verify(this.password, enteredPassword);
};

export type UserType = InferSchemaType<typeof userSchema> & {
  comparePassword(enteredPassword: string): Promise<boolean>;
};

const User = models.User || model<UserType>('User', userSchema);
export default User;
