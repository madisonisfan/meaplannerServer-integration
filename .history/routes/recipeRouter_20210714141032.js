const express = require("express");
const recipeRouter = express.Router();
const Recipe = require("../models/recipeModel");
const authenticate = require("../authenticate");
const cors = require("./cors");

recipeRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Recipe.find()
      .then((recipes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipes);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log("recipe to create", req.body);
    req.body.recipeCreator = req.user._id;
    console.log("recipe to create", req.body);
    Recipe.create(req.body)
      .then((recipe) => {
        console.log("Recipe added: ", recipe);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipe);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not support on /recipes");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Recipe.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

recipeRouter
  .route("/:recipeId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Recipe.findById(req.params.recipeId)
      .then((recipe) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipe);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`POST operation not support on /recipes/${req.params.recipeId}`);
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Recipe.findById(req.params.recipeId)
      .then((recipe) => {
        if (recipe) {
          if (recipe.recipeCreator._id.equals(req.user._id)) {
            if (req.body.recipeName) {
              recipe.recipeName = req.body.recipeName;
            }
            if (req.body.recipeDescription) {
              recipe.recipeDescription = req.body.recipeDescription;
            }
            if (req.body.imageUrl) {
              recipe.imageUrl = req.body.imageUrl;
            }
            if (req.body.cooktime) {
              recipe.cooktime = req.body.cooktime;
            }
            if (req.body.preptime) {
              recipe.preptime = req.body.preptime;
            }
            if (req.body.calories) {
              recipe.calories = req.body.calories;
            }
            if (req.body.servings) {
              recipe.servings = req.body.servings;
            }
            if (req.body.ingredients) {
              recipe.ingredients = req.body.ingredients;
            }
            if (req.body.instructions) {
              recipe.instructions = req.body.instructions;
            }
            recipe
              .save()
              .then((recipe) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(recipe);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error("You are not the recipe creator");
            err.status = 404;
            return next(err);
          }
        } else {
          const err = new Error(`Recipe ${req.params.recipeId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Recipe.findById(req.params.recipeId)
      .then((recipe) => {
        if (recipe) {
          if (recipe.recipeCreator._id.equals(req.user._id)) {
            Recipe.findByIdAndDelete(req.params.recipeId)
              .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error(`You are not the recipe creator`);
            err.status = 404;
            return next(err);
          }
        } else {
          const err = new Error(`Recipe ${req.params.recipeId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
/*
 Recipe.findByIdAndDelete(req.params.recipeId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  */
module.exports = recipeRouter;

/* FOR TESTING
{
    "recipeName": "pasta",
    "recipeDescription": "recipe description", 
    "imageUrl": "image url...", 
    "cooktime": 25, 
    "preptime": 10,
    "calories" :120, "servings": 5, 
    "ingredients": "ingredients..." ,"instructions": "instructions..."
}

*/
