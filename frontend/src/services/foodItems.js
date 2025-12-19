import API from './api';

export const getFoodItems = () => API.get('/food-items');
export const getFoodItemsByCategory = (category) => API.get(`/food-items/category/${category}`);