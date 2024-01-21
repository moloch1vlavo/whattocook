document.addEventListener('DOMContentLoaded', function() {
    const addIngredientBtn = document.getElementById('addIngredient');
    const ingredientInput = document.getElementById('ingredientInput');
    const quantityInput = document.getElementById('quantityInput');
    const fridgeContents = document.getElementById('fridgeContents');

    addIngredientBtn.addEventListener('click', function() {
        addIngredient(ingredientInput.value, quantityInput.value);
        ingredientInput.value = '';
        quantityInput.value = '';
        displayFridgeContents();
    });

    function addIngredient(ingredient, quantity) {
        let ingredients = JSON.parse(localStorage.getItem('fridgeIngredients')) || [];
        if (ingredient && !ingredients.some(item => item.name === ingredient)) {
            ingredients.push({ name: ingredient, quantity: quantity });
            localStorage.setItem('fridgeIngredients', JSON.stringify(ingredients));
        }
    }

    function displayFridgeContents() {
        let ingredients = JSON.parse(localStorage.getItem('fridgeIngredients')) || [];
        fridgeContents.innerHTML = '';
        ingredients.forEach((item, index) => {
            let div = document.createElement('div');
            div.textContent = `${item.name} - ${item.quantity}`;
            
            let removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeIngredient(index);

            div.appendChild(removeButton);
            fridgeContents.appendChild(div);
        });
    }

    function removeIngredient(index) {
        let ingredients = JSON.parse(localStorage.getItem('fridgeIngredients')) || [];
        ingredients.splice(index, 1);
        localStorage.setItem('fridgeIngredients', JSON.stringify(ingredients));
        displayFridgeContents();
    }

    displayFridgeContents();
});
