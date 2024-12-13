document.getElementById('searchButton').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredients').value;
    const diet = document.getElementById('diet').value;
    fetchRecipes(ingredients, diet);
});

const fetchRecipes = async (ingredients, diet) => {
    const apiKey = '8206825b86fe45c8a83149487bc8f749';
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&includeIngredients=${ingredients}&diet=${diet}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayRecipes(data.results);
        } else {
            displayNoRecipesFound();
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        displayErrorMessage();
    }
};

const displayRecipes = (recipes) => {
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML = ''; 

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <h3 class="recipe-title" data-id="${recipe.id}">${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
        `;
        recipeContainer.appendChild(recipeCard);
    });

    attachRecipeDetailsListeners();
};

const attachRecipeDetailsListeners = () => {
    const titles = document.querySelectorAll('.recipe-title');
    titles.forEach(title => {
        title.addEventListener('click', async (e) => {
            const recipeId = e.target.getAttribute('data-id');
            await fetchRecipeDetails(recipeId);
        });
    });
};

const fetchRecipeDetails = async (id) => {
    const apiKey = '8206825b86fe45c8a83149487bc8f749';
    const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayRecipeDetails(data);
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        alert('Failed to fetch recipe details. Please try again later.');
    }
};

const displayRecipeDetails = (recipe) => {
    const popup = document.getElementById('recipe-popup');
    const popupContent = document.getElementById('popup-content');

    const ingredientsList = recipe.extendedIngredients
        .map(ing => `<li>${ing.original}</li>`)
        .join('');
    const instructions = recipe.instructions || 'No instructions available.';

    popupContent.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}" style="max-width: 100%; margin: 1rem 0;">
        <h3>Ingredients</h3>
        <ul>${ingredientsList}</ul>
        <h3>Instructions</h3>
        <p>${instructions}</p>
        <button id="close-popup"> Done Cooking </button>
    `;

    popup.style.display = 'flex';

    document.getElementById('close-popup').addEventListener('click', () => {
        popup.style.display = 'none';
    });
};

const displayNoRecipesFound = () => {
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML = '<p>No recipes found. Try different ingredients or preferences.</p>';
};

const displayErrorMessage = () => {
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML = '<p>Failed to load recipes. Please check your connection and try again.</p>';
};
