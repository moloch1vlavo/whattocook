document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addIngredientButton').addEventListener('click', addIngredientField);
    document.getElementById('createRecipeForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveRecipe();
    });
    initializeRemoveButtons();
});

function addIngredientField() {
    const ingredientsList = document.getElementById('ingredients');
    const newIngredientItem = document.createElement('li');
    newIngredientItem.innerHTML = `
        <input type="text" class="ingredient" placeholder="Ingredient" required>
        <input type="text" class="quantity" placeholder="Quantity" required>
        <button type="button" class="removeIngredient">Remove</button>
    `;
    ingredientsList.appendChild(newIngredientItem);
    initializeRemoveButtons();
}

function initializeRemoveButtons() {
    document.querySelectorAll('.removeIngredient').forEach(button => {
        button.addEventListener('click', function () {
            this.parentElement.remove();
        });
    });
}

function saveRecipe() {
    let recipeName = document.getElementById('recipeName').value;
    let recipeInstructions = document.getElementById('recipeInstructions').value;
    let ingredients = Array.from(document.querySelectorAll('#ingredients li')).map(li => {
        return {
            ingredient: li.querySelector('.ingredient').value,
            quantity: li.querySelector('.quantity').value
        };
    });

    let customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    customRecipes.push({
        name: recipeName,
        instructions: recipeInstructions,
        ingredients: ingredients
    });

    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    alert('Recipe saved!');
    window.location.href = 'my-recipes.html'; // Redirect to MyRecipes.html
}
