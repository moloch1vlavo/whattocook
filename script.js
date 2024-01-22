document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const findRecipesButton = document.getElementById('findRecipes');
    const searchInput = document.getElementById('searchInput');
    const recipeResults = document.getElementById('recipeResults');

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value;
        fetchRecipes(searchTerm);
    });

    findRecipesButton.addEventListener('click', function () {
        fetchRecipesByFridgeIngredients();
    });

    function fetchRecipes(searchTerm) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            .then(response => response.json())
            .then(data => displayRecipes(data.meals))
            .catch(error => console.error('Error:', error));
    }

    function displayRecipes(recipes) {
        recipeResults.innerHTML = '';
        recipes.forEach(recipe => {
            const card = createRecipeCard(recipe);
            recipeResults.appendChild(card);
        });
    }

    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        let recipeURL;
        if (recipe.idMeal.startsWith('custom_')) {
            // Extract the index and modify the URL for custom recipes
            const index = recipe.idMeal.split('_')[1];
            recipeURL = `recipe.html?id=${index}&custom=true`;
        } else {
            recipeURL = `recipe.html?id=${recipe.idMeal}`;
        }

        card.addEventListener('click', () => {
            window.location.href = recipeURL;
        });

        const title = document.createElement('h3');
        title.textContent = recipe.strMeal;

        const image = document.createElement('img');
        image.src = recipe.strMealThumb || '/noimg.jpg'; // Add a default image path if needed
        image.alt = `Image of ${recipe.strMeal}`;

        const favButton = document.createElement('button');
        favButton.textContent = 'Add to Favorites';
        favButton.onclick = (event) => {
            event.stopPropagation(); // Prevents the card click event
            addToFavorites(recipe);
        };

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(favButton);

        return card;
    }



    function addToFavorites(recipe) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(fav => fav.idMeal === recipe.idMeal)) {
            favorites.push(recipe);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }

    function fetchRecipesByFridgeIngredients() {
        const fridgeIngredients = JSON.parse(localStorage.getItem('fridgeIngredients')) || [];
        const ingredientNames = fridgeIngredients.map(ing => ing.name);
        let allRecipes = []; // Array to hold all matched recipes

        const promises = ingredientNames.map(ingredient => {
            return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
                .then(response => response.json())
                .then(data => {
                    if (data.meals) {
                        allRecipes = allRecipes.concat(data.meals);
                    }
                })
                .catch(error => console.error('Error fetching recipes for', ingredient, error));
        });

        Promise.all(promises).then(() => {
            // After all API recipes are fetched, add custom recipes
            const customRecipes = getCustomRecipes(ingredientNames);
            customRecipes.forEach((recipe, index) => {
                allRecipes.push(createRecipeObjectFromCustom(recipe, index));
            });

            // Display all recipes
            displayRecipes(allRecipes);
        });
    }

    function getCustomRecipes(ingredientNames) {
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
        return customRecipes.filter(recipe =>
            ingredientNames.some(ing => recipe.ingredients.some(ri => ri.ingredient === ing))
        );
    }

    function createRecipeObjectFromCustom(recipe, index) {
        // Create an object similar to the API recipe structure
        return {
            strMeal: recipe.name,
            strMealThumb: './noimg.jpg', // Custom image URL or a placeholder
            idMeal: 'custom_' + index, // Use index as identifier for custom recipes
            // Add other fields if necessary
        };
    }
});
