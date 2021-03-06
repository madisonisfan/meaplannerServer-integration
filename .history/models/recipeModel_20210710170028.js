const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    recipeName: {
      type: String,
      required: true,
      unique: true,
    },
    mealType: {
      type: String,
      required: true,
    },
    recipeDescription: {
      type: String,
      required: true,
    },
    cooktime: {
      type: String,
      required: true,
    },
    preptime: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    recipeDate: {
      type: String,
      required: true,
    },
    recipeCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
