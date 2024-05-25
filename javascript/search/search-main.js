import { initSearch } from './search.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('./items.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const products = await response.json();
    initSearch(products);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});
