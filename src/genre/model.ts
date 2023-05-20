import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface Genre {
  name: string;
}

const GenreSchema = new Schema<Genre>({
  name: {
    type: String,
    required: true,
  },
});

export const GenreModel = mongoose.model<Genre>('Genre', GenreSchema);
