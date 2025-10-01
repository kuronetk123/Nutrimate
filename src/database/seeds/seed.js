// seed.js
import mongoose from 'mongoose';
import connectDB from '../../common/db.js';  // 👈 include .js extension in ESM
import Recipe from '../models/Recipe.js';
import { recipeSeeds } from '../seeds/recipe.js';

async function seed() {
  await connectDB();
  await Recipe.deleteMany({});
  await Recipe.insertMany(recipeSeeds);
  console.log('✅ Recipes seeded!');
  mongoose.connection.close();
}

seed();
