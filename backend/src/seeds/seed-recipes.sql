-- =========================
-- SAMPLE RECIPES SEED DATA
-- =========================

-- Clear existing data (safe order because of FK constraints)
DELETE FROM recipe_ingredients;
DELETE FROM recipe_categories;
DELETE FROM recipes;
DELETE FROM ingredients;
DELETE FROM categories;

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories (name) VALUES
  ('Vegan'),
  ('Vegetarian'),
  ('Quick'),
  ('Healthy'),
  ('Comfort Food'),
  ('Breakfast'),
  ('Dinner'),
  ('Low Carb');

-- =========================
-- INGREDIENTS
-- =========================
INSERT INTO ingredients (name) VALUES
  ('Tomato'),
  ('Olive Oil'),
  ('Garlic'),
  ('Pasta'),
  ('Basil'),
  ('Chicken'),
  ('Coconut Milk'),
  ('Bread'),
  ('Avocado'),
  ('Beef'),
  ('Soy Sauce'),
  ('Carrot'),
  ('Onion'),
  ('Celery'),
  ('Flour'),
  ('Egg'),
  ('Milk'),
  ('Lettuce'),
  ('Croutons'),
  ('Parmesan'),
  ('Salmon'),
  ('Lemon'),
  ('Spaghetti'),
  ('Pancetta'),
  ('Feta'),
  ('Cucumber'),
  ('Olives');

-- =========================
-- RECIPES
-- =========================
INSERT INTO recipes (title, description, instructions, "durationMinutes", "imageUrl") VALUES
('Simple Tomato Pasta', 'Quick and healthy tomato pasta', 'Boil pasta. Heat olive oil. Add garlic and tomato. Mix together.', 20, 'https://example.com/tomato-pasta.jpg'),
('Chicken Curry', 'Creamy Indian-style chicken curry with coconut milk', 'Sauté onions and garlic. Add curry paste. Add chicken. Add coconut milk. Simmer 20 mins.', 30, 'https://example.com/chicken-curry.jpg'),
('Avocado Toast', 'Quick vegetarian breakfast with avocado and lemon', 'Toast bread. Mash avocado with lemon juice. Spread and season.', 10, 'https://example.com/avocado-toast.jpg'),
('Beef Stir Fry', 'Asian-style beef with vegetables and soy sauce', 'Sear beef. Add vegetables. Add soy sauce. Stir fry 5 mins.', 20, 'https://example.com/beef-stir-fry.jpg'),
('Vegetable Soup', 'Hearty mixed vegetable soup', 'Add vegetables to broth. Simmer 30 mins.', 40, 'https://example.com/vegetable-soup.jpg'),
('Pancakes', 'Fluffy breakfast pancakes', 'Mix flour, eggs, milk. Cook on skillet.', 20, 'https://example.com/pancakes.jpg'),
('Caesar Salad', 'Crispy romaine lettuce with Caesar dressing', 'Mix dressing. Toss with lettuce and croutons.', 15, 'https://example.com/caesar-salad.jpg'),
('Grilled Salmon', 'Lemon-herb salmon grilled to perfection', 'Season salmon. Grill 12 minutes.', 25, 'https://example.com/grilled-salmon.jpg'),
('Spaghetti Carbonara', 'Italian pasta with egg, cheese and pancetta', 'Cook pasta. Fry pancetta. Mix with egg and cheese. Combine.', 25, 'https://example.com/carbonara.jpg'),
('Greek Salad', 'Fresh salad with feta and olives', 'Chop vegetables. Add feta and olive oil.', 10, 'https://example.com/greek-salad.jpg'),
('Tomato Basil Soup', 'Smooth tomato soup with basil', 'Cook tomatoes with garlic. Blend. Simmer.', 30, 'https://example.com/tomato-basil-soup.jpg');

-- =========================
-- RECIPE ↔ CATEGORY
-- =========================

-- Simple Tomato Pasta → Quick, Vegetarian
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Simple Tomato Pasta'
  AND c.name IN ('Quick', 'Vegetarian');

-- Chicken Curry → Dinner, Healthy
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Chicken Curry'
  AND c.name IN ('Dinner', 'Healthy');

-- Avocado Toast → Breakfast, Vegetarian, Quick
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Avocado Toast'
  AND c.name IN ('Breakfast', 'Vegetarian', 'Quick');

-- Beef Stir Fry → Dinner, Quick
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Beef Stir Fry'
  AND c.name IN ('Dinner', 'Quick');

-- Vegetable Soup → Vegan, Healthy
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Vegetable Soup'
  AND c.name IN ('Vegan', 'Healthy');

-- Pancakes → Breakfast, Comfort Food
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Pancakes'
  AND c.name IN ('Breakfast', 'Comfort Food');

-- Caesar Salad → Quick, Healthy
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Caesar Salad'
  AND c.name IN ('Quick', 'Healthy');

-- Grilled Salmon → Dinner, Low Carb, Healthy
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Grilled Salmon'
  AND c.name IN ('Dinner', 'Low Carb', 'Healthy');

-- Spaghetti Carbonara → Dinner, Comfort Food
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Spaghetti Carbonara'
  AND c.name IN ('Dinner', 'Comfort Food');

-- Greek Salad → Healthy, Vegetarian
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Greek Salad'
  AND c.name IN ('Healthy', 'Vegetarian');

-- Tomato Basil Soup → Vegan, Healthy
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Tomato Basil Soup'
  AND c.name IN ('Vegan', 'Healthy');


-- =========================
-- RECIPE ↔ INGREDIENTS
-- =========================

-- Simple Tomato Pasta
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '200', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Simple Tomato Pasta'
  AND i.name = 'Pasta';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'tbsp'
FROM recipes r, ingredients i
WHERE r.title = 'Simple Tomato Pasta'
  AND i.name = 'Olive Oil';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'cloves'
FROM recipes r, ingredients i
WHERE r.title = 'Simple Tomato Pasta'
  AND i.name = 'Garlic';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '3', 'pcs'
FROM recipes r, ingredients i
WHERE r.title = 'Simple Tomato Pasta'
  AND i.name = 'Tomato';

-- Chicken Curry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '300', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Chicken Curry'
  AND i.name = 'Chicken';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'cup'
FROM recipes r, ingredients i
WHERE r.title = 'Chicken Curry'
  AND i.name = 'Coconut Milk';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'tbsp'
FROM recipes r, ingredients i
WHERE r.title = 'Chicken Curry'
  AND i.name = 'Olive Oil';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Chicken Curry'
  AND i.name = 'Onion';

-- Avocado Toast
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'slices'
FROM recipes r, ingredients i
WHERE r.title = 'Avocado Toast'
  AND i.name = 'Bread';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Avocado Toast'
  AND i.name = 'Avocado';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'tbsp'
FROM recipes r, ingredients i
WHERE r.title = 'Avocado Toast'
  AND i.name = 'Olive Oil';

-- Beef Stir Fry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '250', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Beef Stir Fry'
  AND i.name = 'Beef';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'tbsp'
FROM recipes r, ingredients i
WHERE r.title = 'Beef Stir Fry'
  AND i.name = 'Soy Sauce';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Beef Stir Fry'
  AND i.name = 'Carrot';

-- Vegetable Soup
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'pcs'
FROM recipes r, ingredients i
WHERE r.title = 'Vegetable Soup'
  AND i.name = 'Carrot';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Vegetable Soup'
  AND i.name = 'Onion';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Vegetable Soup'
  AND i.name = 'Celery';

-- Pancakes
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '200', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Pancakes'
  AND i.name = 'Flour';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'pcs'
FROM recipes r, ingredients i
WHERE r.title = 'Pancakes'
  AND i.name = 'Egg';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '250', 'ml'
FROM recipes r, ingredients i
WHERE r.title = 'Pancakes'
  AND i.name = 'Milk';

-- Caesar Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'head'
FROM recipes r, ingredients i
WHERE r.title = 'Caesar Salad'
  AND i.name = 'Lettuce';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'cup'
FROM recipes r, ingredients i
WHERE r.title = 'Caesar Salad'
  AND i.name = 'Croutons';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'tbsp'
FROM recipes r, ingredients i
WHERE r.title = 'Caesar Salad'
  AND i.name = 'Parmesan';

-- Grilled Salmon
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'fillets'
FROM recipes r, ingredients i
WHERE r.title = 'Grilled Salmon'
  AND i.name = 'Salmon';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Grilled Salmon'
  AND i.name = 'Lemon';

-- Spaghetti Carbonara
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '200', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Spaghetti Carbonara'
  AND i.name = 'Spaghetti';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '100', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Spaghetti Carbonara'
  AND i.name = 'Pancetta';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Spaghetti Carbonara'
  AND i.name = 'Egg';

-- Greek Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'pcs'
FROM recipes r, ingredients i
WHERE r.title = 'Greek Salad'
  AND i.name = 'Tomato';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '1', 'pc'
FROM recipes r, ingredients i
WHERE r.title = 'Greek Salad'
  AND i.name = 'Cucumber';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '50', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Greek Salad'
  AND i.name = 'Feta';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '10', 'pcs'
FROM recipes r, ingredients i
WHERE r.title = 'Greek Salad'
  AND i.name = 'Olives';

-- Tomato Basil Soup
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '4', 'pcs'
FROM recipes r, ingredients i
WHERE r.title = 'Tomato Basil Soup'
  AND i.name = 'Tomato';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '2', 'cloves'
FROM recipes r, ingredients i
WHERE r.title = 'Tomato Basil Soup'
  AND i.name = 'Garlic';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
SELECT r.id, i.id, '5', 'leaves'
FROM recipes r, ingredients i
WHERE r.title = 'Tomato Basil Soup'
  AND i.name = 'Basil';
