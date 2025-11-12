import mongoose, { Schema, model, models, InferSchemaType } from 'mongoose';

const animalSchema = new Schema({
    name:  { type: String, required: true },  // animal's name
    breed: { type: String, required: true },  // animal's breed
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // id of the animal's owner
    hoursTrained: { type: Number, required: true },  // total number of hours the animal has been trained for
    profilePicture: { type: String, required: true },  // url to an image that can be displayed in an <img> tag
});

export type AnimalType = InferSchemaType<typeof animalSchema>

const Animal = models.Animal || model<AnimalType>('Animal', animalSchema)
export default Animal;

