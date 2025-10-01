const API_URL = "/api/recipes";
import { handleResponse } from "@/lib/handleResponse";

export default RecipeService = {
    getAllRecipes: async (search) => {
        const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : `${API_URL}`
        const response = await fetch(url)
        return handleResponse(response)
    },
    getRecipeById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`)
        return handleResponse(response)
    },
    createRecipe: async (recipe) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe),
        })
        return handleResponse(response)
    },
    updateRecipe: async (id, recipe) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe),
        })
        return handleResponse(response)
    },
    deleteRecipe: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
        return handleResponse(response)
    },

};

