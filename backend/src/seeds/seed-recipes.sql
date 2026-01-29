-- =========================
-- SAMPLE RECIPES SEED DATA
-- =========================

-- Clear existing data (safe order because of FK constraints)
DELETE FROM recipe_ingredients;
DELETE FROM recipe_categories;
DELETE FROM recipes;
DELETE FROM ingredients;
DELETE FROM ingredient_groups;
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
-- INGREDIENT GROUPS
-- =========================
INSERT INTO ingredient_groups (name) VALUES
  ('Vegetables'),
  ('Fruits'),
  ('Meat'),
  ('Dairy'),
  ('Pantry'),
  ('Spices'),
  ('Other');

-- =========================
-- INGREDIENTS (with group_id)
-- =========================

-- Vegetables
INSERT INTO ingredients (name, group_id)
SELECT 'Tomato', id FROM ingredient_groups WHERE name = 'Vegetables';
INSERT INTO ingredients (name, group_id)
SELECT 'Garlic', id FROM ingredient_groups WHERE name = 'Vegetables';
INSERT INTO ingredients (name, group_id)
SELECT 'Carrot', id FROM ingredient_groups WHERE name = 'Vegetables';
INSERT INTO ingredients (name, group_id)
SELECT 'Onion', id FROM ingredient_groups WHERE name = 'Vegetables';
INSERT INTO ingredients (name, group_id)
SELECT 'Celery', id FROM ingredient_groups WHERE name = 'Vegetables';
INSERT INTO ingredients (name, group_id)
SELECT 'Lettuce', id FROM ingredient_groups WHERE name = 'Vegetables';
INSERT INTO ingredients (name, group_id)
SELECT 'Cucumber', id FROM ingredient_groups WHERE name = 'Vegetables';

-- Fruits
INSERT INTO ingredients (name, group_id)
SELECT 'Avocado', id FROM ingredient_groups WHERE name = 'Fruits';
INSERT INTO ingredients (name, group_id)
SELECT 'Lemon', id FROM ingredient_groups WHERE name = 'Fruits';

-- Meat
INSERT INTO ingredients (name, group_id)
SELECT 'Chicken', id FROM ingredient_groups WHERE name = 'Meat';
INSERT INTO ingredients (name, group_id)
SELECT 'Beef', id FROM ingredient_groups WHERE name = 'Meat';
INSERT INTO ingredients (name, group_id)
SELECT 'Salmon', id FROM ingredient_groups WHERE name = 'Meat';
INSERT INTO ingredients (name, group_id)
SELECT 'Pancetta', id FROM ingredient_groups WHERE name = 'Meat';

-- Dairy
INSERT INTO ingredients (name, group_id)
SELECT 'Milk', id FROM ingredient_groups WHERE name = 'Dairy';
INSERT INTO ingredients (name, group_id)
SELECT 'Egg', id FROM ingredient_groups WHERE name = 'Dairy';
INSERT INTO ingredients (name, group_id)
SELECT 'Parmesan', id FROM ingredient_groups WHERE name = 'Dairy';
INSERT INTO ingredients (name, group_id)
SELECT 'Feta', id FROM ingredient_groups WHERE name = 'Dairy';

-- Pantry
INSERT INTO ingredients (name, group_id)
SELECT 'Olive Oil', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Pasta', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Spaghetti', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Flour', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Bread', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Soy Sauce', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Coconut Milk', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Croutons', id FROM ingredient_groups WHERE name = 'Pantry';
INSERT INTO ingredients (name, group_id)
SELECT 'Olives', id FROM ingredient_groups WHERE name = 'Pantry';

-- Other / Spices (dein Mapping kann später besser werden)
INSERT INTO ingredients (name, group_id)
SELECT 'Basil', id FROM ingredient_groups WHERE name = 'Spices';

-- =========================
-- ASSIGN INGREDIENTS TO GROUPS
-- =========================

-- Vegetables
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Vegetables')
WHERE name IN ('Tomato','Garlic','Carrot','Onion','Celery','Lettuce','Cucumber');

-- Fruits
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Fruits')
WHERE name IN ('Avocado','Lemon');

-- Meat (incl. fish + cured meat for now)
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Meat')
WHERE name IN ('Beef','Chicken','Salmon','Pancetta');

-- Dairy
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Dairy')
WHERE name IN ('Milk','Parmesan','Feta');

-- Pantry
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Pantry')
WHERE name IN ('Olive Oil','Pasta','Spaghetti','Flour','Bread','Croutons','Soy Sauce','Coconut Milk','Olives');

-- Spices / Herbs
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Spices')
WHERE name IN ('Basil');

-- Other
UPDATE ingredients
SET group_id = (SELECT id FROM ingredient_groups WHERE name = 'Other')
WHERE name IN ('Egg');



-- =========================
-- RECIPES
-- =========================
INSERT INTO recipes (title, description, instructions, "durationMinutes", "imageUrl") VALUES
('Simple Tomato Pasta', 'Quick and healthy tomato pasta', 'Boil pasta. Heat olive oil. Add garlic and tomato. Mix together.', 20, 'https://source.unsplash.com/1200x800/?pasta'),
('Chicken Curry', 'Creamy Indian-style chicken curry with coconut milk', 'Sauté onions and garlic. Add curry paste. Add chicken. Add coconut milk. Simmer 20 mins.', 30, 'https://example.com/chicken-curry'),
('Avocado Toast', 'Quick vegetarian breakfast with avocado and lemon', 'Toast bread. Mash avocado with lemon juice. Spread and season.', 10, 'https://example.com/avocado-toast'),
('Beef Stir Fry', 'Asian-style beef with vegetables and soy sauce', 'Sear beef. Add vegetables. Add soy sauce. Stir fry 5 mins.', 20, 'https://example.com/beef-stir-fry'),
('Vegetable Soup', 'Hearty mixed vegetable soup', 'Add vegetables to broth. Simmer 30 mins.', 40, 'https://source.unsplash.com/1200x800/?vegetable,soup'),
('Pancakes', 'Fluffy breakfast pancakes', 'Mix flour, eggs, milk. Cook on skillet.', 20, 'https://example.com/pancakes'),
('Caesar Salad', 'Crispy romaine lettuce with Caesar dressing', 'Mix dressing. Toss with lettuce and croutons.', 15, 'https://example.com/caesar-salad'),
('Grilled Salmon', 'Lemon-herb salmon grilled to perfection', 'Season salmon. Grill 12 minutes.', 25, 'https://example.com/grilled-salmon'),
('Spaghetti Carbonara', 'Italian pasta with egg, cheese and pancetta', 'Cook pasta. Fry pancetta. Mix with egg and cheese. Combine.', 25, 'https://example.com/carbonara'),
('Greek Salad', 'Fresh salad with feta and olives', 'Chop vegetables. Add feta and olive oil.', 10, 'https://example.com/greek-salad'),
('Tomato Basil Soup', 'Smooth tomato soup with basil', 'Cook tomatoes with garlic. Blend. Simmer.', 30, 'https://example.com/tomato-basil-soup');

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
