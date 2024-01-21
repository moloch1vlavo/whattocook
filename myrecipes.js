document.addEventListener('DOMContentLoaded', function() {
    displayFavoriteRecipes();
    displayCustomRecipes();
});

function displayFavoriteRecipes() {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteRecipesDiv = document.getElementById('favoriteRecipesList');
    favoriteRecipesDiv.innerHTML = '';

    favoriteRecipes.forEach(recipe => {
        let div = document.createElement('div');
        div.className = 'recipe';

        let title = document.createElement('h3');
        title.textContent = recipe.strMeal;

        let viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.onclick = () => window.location.href = `recipe.html?id=${recipe.idMeal}`;

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFavoriteRecipe(recipe.idMeal);

        div.appendChild(title);
        div.appendChild(viewButton);
        div.appendChild(removeButton);
        favoriteRecipesDiv.appendChild(div);
    });
}

function removeFavoriteRecipe(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites = favorites.filter(recipe => recipe.idMeal !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    displayFavoriteRecipes();
}

function displayCustomRecipes() {
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    const customRecipesDiv = document.getElementById('customRecipesList');
    customRecipesDiv.innerHTML = '';

    customRecipes.forEach((recipe, index) => {
        let div = document.createElement('div');
        div.className = 'recipe';

        let title = document.createElement('h3');
        title.textContent = recipe.name;

        let viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.onclick = () => viewCustomRecipe(index);

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeCustomRecipe(index);

        div.appendChild(title);
        div.appendChild(viewButton);
        div.appendChild(removeButton);
        customRecipesDiv.appendChild(div);
    });
}

function viewCustomRecipe(index) {
    window.location.href = `recipe.html?id=${index}&custom=true`;
}

function removeCustomRecipe(index) {
    let customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    customRecipes.splice(index, 1);
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    displayCustomRecipes();
}
