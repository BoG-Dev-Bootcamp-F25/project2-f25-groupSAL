import mongoose, { Schema, model, models, InferSchemaType } from 'mongoose';

const trainingLogSchema = new Schema({
    title:  { type: String, required: true },  // training title
    date: { type: Date, required: true },  // current date
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // id of the animal's owner
    ownerName: { type: String, required: true },  // name of the animal's owner
    animal: { type: Schema.Types.ObjectId, ref: 'Animal', required: true },  // id of the animal being trained
    animalName: { type: String, required: true },  // name of the animal being trained
    breed : { type: String, required: true },  // breed of the animal being trained
    hoursLogged: { type: Number, required: true },  // number of hours the animal has been trained for
    description: { type: String, required: true },  // description of the training session
});

export type trainingLogType = InferSchemaType<typeof trainingLogSchema>

const TrainingLog = models.TrainingLog || model<trainingLogType>('TrainingLog', trainingLogSchema)
export default TrainingLog;