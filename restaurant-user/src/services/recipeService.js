import { firestoreApi, toFirestoreFields, fromFirestoreFields } from '../api/firebaseApi';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const SEED_RECIPES = [
  {
    id: 'rec-margherita',
    name: 'Margherita Pizza',
    categoryId: 'cat-pizza',
    categoryName: 'Pizza',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Fresh Mozzarella, San Marzano Tomatoes, Basil Leaves, Extra Virgin Olive Oil, Sea Salt',
    instructions: '1. Preheat oven to 500°F (260°C). 2. Stretch the pizza dough onto a baking sheet. 3. Spread crushed tomatoes evenly. 4. Top with sliced mozzarella. 5. Bake for 8-10 minutes. 6. Garnish with fresh basil leaves and a drizzle of olive oil.',
  },
  {
    id: 'rec-bbq-chicken',
    name: 'BBQ Chicken Pizza',
    categoryId: 'cat-pizza',
    categoryName: 'Pizza',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Grilled Chicken Breast, Smoky BBQ Sauce, Red Onion, Fresh Cilantro, Shredded Mozzarella',
    instructions: '1. Stretch pizza dough. 2. Spread BBQ sauce over dough. 3. Distribute shredded chicken and sliced red onions. 4. Cover with mozzarella. 5. Bake at 475°F for 10-12 minutes. 6. Top with chopped cilantro.',
  },
  {
    id: 'rec-cheeseburger',
    name: 'Classic Cheeseburger',
    categoryId: 'cat-burgers',
    categoryName: 'Burgers',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Angus Beef Patty, Cheddar Cheese, Crisp Lettuce, Ripe Tomato, Soft Brioche Bun, Signature Sauce',
    instructions: '1. Shape beef into a patty and grill to preferred doneness. 2. Place cheddar cheese on top to melt. 3. Toast brioche bun. 4. Spread sauce on bun. 5. Assemble patty, lettuce, and tomato.',
  },
  {
    id: 'rec-bacon-avocado',
    name: 'Bacon Avocado Burger',
    categoryId: 'cat-burgers',
    categoryName: 'Burgers',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Beef Patty, Smoked Bacon, Fresh Avocado Slices, Swiss Cheese, Lettuce, Garlic Aioli',
    instructions: '1. Grill patty and cook bacon until crispy. 2. Melt Swiss cheese over patty. 3. Spread garlic aioli on toasted bun. 4. Layer patty, bacon, avocado slices, and lettuce.',
  },
  {
    id: 'rec-salmon-nigiri',
    name: 'Salmon Nigiri Set',
    categoryId: 'cat-sushi',
    categoryName: 'Sushi',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Premium Sushi Rice, Sashimi-Grade Salmon, Wasabi Paste, Pickled Ginger, Soy Sauce',
    instructions: '1. Cook seasoned sushi rice. 2. Slice salmon into thin, bite-size pieces. 3. Form small hand-pressed rice balls. 4. Dab a bit of wasabi on salmon, and press salmon onto rice ball.',
  },
  {
    id: 'rec-dragon-roll',
    name: 'Dragon Sushi Roll',
    categoryId: 'cat-sushi',
    categoryName: 'Sushi',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Barbecued Eel, Cucumber, Avocado, Nori Sheets, Sushi Rice, Spicy Mayo, Eel Sauce',
    instructions: '1. Spread rice on nori sheet. 2. Place eel and cucumber in the center and roll tightly. 3. Lay thin avocado slices on top. 4. Cut into pieces and drizzle with spicy mayo and eel sauce.',
  },
  {
    id: 'rec-fudge-cake',
    name: 'Chocolate Fudge Cake',
    categoryId: 'cat-desserts',
    categoryName: 'Desserts',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Dark Cocoa, All-Purpose Flour, Cane Sugar, Butter, Chocolate Fudge Buttercream',
    instructions: '1. Whisk cocoa, flour, sugar, and baking powder. 2. Beat in eggs and melted butter. 3. Bake at 350°F (175°C) for 30 minutes. 4. Allow to cool. 5. Frost with chocolate fudge buttercream.',
  },
  {
    id: 'rec-apple-pie',
    name: 'Warm Apple Pie',
    categoryId: 'cat-desserts',
    categoryName: 'Desserts',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Granny Smith Apples, Flaky Crust Pastry, Cinnamon, Sugar, Nutmeg, Egg Wash',
    instructions: '1. Toss sliced apples with cinnamon, sugar, and nutmeg. 2. Roll out pie dough into a pie dish. 3. Fill with apples. 4. Cover with lattice crust. 5. Brush with egg wash. 6. Bake at 400°F for 45 minutes.',
  },
  {
    id: 'rec-quinoa-bowl',
    name: 'Mediterranean Quinoa Bowl',
    categoryId: 'cat-healthy',
    categoryName: 'Healthy',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Organic Quinoa, Cherry Tomatoes, Cucumbers, Kalamata Olives, Feta Cheese, Lemon Vinaigrette',
    instructions: '1. Rinse and cook quinoa in water. 2. Chop tomatoes, cucumbers, and olives. 3. Toss ingredients together in a large bowl. 4. Crumble feta on top. 5. Drizzle with lemon vinaigrette.',
  },
  {
    id: 'rec-salmon-bowl',
    name: 'Grilled Salmon Healthy Bowl',
    categoryId: 'cat-healthy',
    categoryName: 'Healthy',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Fresh Salmon Fillet, Brown Rice, Steamed Broccoli Florets, Avocados, Sesame Dressing',
    instructions: '1. Season salmon and grill for 4 minutes per side. 2. Cook brown rice. 3. Steam broccoli. 4. Place rice base in bowl, top with salmon, broccoli, avocado, and drizzle sesame dressing.',
  },
];

export const recipeService = {
  // Fetch all recipes
  getRecipes: async () => {
    try {
      const response = await firestoreApi.get(`/recipes?key=${apiKey}`);
      if (response.data && response.data.documents) {
        return response.data.documents.map(fromFirestoreFields);
      }
      return await recipeService.seedRecipes();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return await recipeService.seedRecipes();
      }
      console.error('Failed to get recipes:', error);
      throw error;
    }
  },

  // Fetch single recipe by ID
  getRecipeById: async (id) => {
    try {
      const response = await firestoreApi.get(`/recipes/${id}?key=${apiKey}`);
      return fromFirestoreFields(response.data);
    } catch (error) {
      console.error(`Failed to get recipe with ID ${id}:`, error);
      throw error;
    }
  },

  // Fetch recipes by category
  getRecipesByCategory: async (categoryId) => {
    const allRecipes = await recipeService.getRecipes();
    return allRecipes.filter((r) => r.categoryId === categoryId);
  },

  // Seed recipes to Firestore using REST patches
  seedRecipes: async () => {
    console.log('Seeding recipes...');
    const seededList = [];
    for (const recipe of SEED_RECIPES) {
      try {
        const payload = toFirestoreFields({
          name: recipe.name,
          categoryId: recipe.categoryId,
          categoryName: recipe.categoryName,
          price: recipe.price,
          image: recipe.image,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        });
        const response = await firestoreApi.patch(`/recipes/${recipe.id}?key=${apiKey}`, payload);
        seededList.push(fromFirestoreFields(response.data));
      } catch (err) {
        console.error(`Failed to seed recipe ${recipe.name}:`, err);
      }
    }
    return seededList.length > 0 ? seededList : SEED_RECIPES;
  },
};
