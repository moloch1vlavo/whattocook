document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');
    const isCustom = params.get('custom') === 'true'; // Check if it's a custom recipe

    if (isCustom) {
        displayCustomRecipe(recipeId);
    } else {
        fetchRecipeDetails(recipeId);
    }

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => window.location.href = 'index.html');
});

function fetchRecipeDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayRecipeDetails(data.meals[0]);
            } else {
                // If no recipe is found in the API, try to load a custom recipe
                displayCustomRecipe(id);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayRecipeDetails(recipe) {
    const recipeDetail = document.getElementById('recipeDetail');

    const title = document.createElement('h2');
    title.textContent = recipe.strMeal;

    const image = document.createElement('img');
    image.src = recipe.strMealThumb;
    image.alt = `Image of ${recipe.strMeal}`;

    const instructions = document.createElement('p');
    instructions.textContent = recipe.strInstructions;

    const ingredientsTable = createIngredientsTable(recipe);

    recipeDetail.appendChild(title);
    recipeDetail.appendChild(image);
    recipeDetail.appendChild(instructions);
    recipeDetail.appendChild(ingredientsTable);
}

function createIngredientsTable(recipe) {
    const table = document.createElement('table');

    for (let i = 1; i <= 20; i++) {
        let ingredient = recipe[`strIngredient${i}`];
        let measure = recipe[`strMeasure${i}`];

        if (ingredient && ingredient !== "" && measure && measure !== "") {
            let row = table.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);

            cell1.textContent = ingredient;
            cell2.textContent = measure;
        }
    }

    return table;
}

function displayCustomRecipe(index) {
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    const recipe = customRecipes[index];

    if (recipe) {
        const recipeDetail = document.getElementById('recipeDetail');

        const title = document.createElement('h2');
        title.textContent = recipe.name;

        // Assuming custom recipes don't have an image
        // If they do, you can add an <img> element here

        const instructions = document.createElement('p');
        instructions.textContent = recipe.instructions;

        recipeDetail.appendChild(title);
        recipeDetail.appendChild(instructions);

        // If custom recipes have ingredients, display them
        if (recipe.ingredients) {
            const ingredientsTable = createCustomIngredientsTable(recipe.ingredients);
            recipeDetail.appendChild(ingredientsTable);
        }
    } else {
        recipeDetail.textContent = 'Recipe not found.';
    }
}


function createCustomIngredientsTable(ingredients) {
    const table = document.createElement('table');

    ingredients.forEach(ing => {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);

        cell1.textContent = ing.ingredient;
        cell2.textContent = ing.quantity;
    });

    return table;
}
