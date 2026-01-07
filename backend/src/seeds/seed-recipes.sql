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
  ('Healthy');

-- =========================
-- INGREDIENTS
-- =========================
INSERT INTO ingredients (name) VALUES
  ('Tomato'),
  ('Olive Oil'),
  ('Garlic'),
  ('Pasta'),
  ('Basil');

-- =========================
-- RECIPES
-- =========================
INSERT INTO recipes (
  title,
  description,
  instructions,
  "durationMinutes",
  "imageUrl"
) VALUES (
  'Simple Tomato Pasta',
  'Quick and healthy tomato pasta',
  'Boil pasta. Heat olive oil. Add garlic and tomato. Mix together.',
  20,
  'https://example.com/tomato-pasta.jpg'
);

-- =========================
-- RECIPE ↔ CATEGORY
-- =========================
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id
FROM recipes r, categories c
WHERE r.title = 'Simple Tomato Pasta'
  AND c.name IN ('Quick', 'Vegetarian');

-- =========================
-- RECIPE ↔ INGREDIENTS
-- =========================
INSERT INTO recipe_ingredients (
  recipe_id,
  ingredient_id,
  quantity,
  unit
)
SELECT r.id, i.id, '200', 'g'
FROM recipes r, ingredients i
WHERE r.title = 'Simple Tomato Pasta'
  AND i.name = 'Pasta';

INSERT INTO recipe_ingredients (
  recipe_id,
  ingredient_id,
  quantity,
  unit
)
SELECT r.id, i.id, '2', 'tbsp'
FROM recipes r, ingredients i
WHERE r.title = 'Simple Tomato Pasta'
  AND i.name = 'Olive Oil';
