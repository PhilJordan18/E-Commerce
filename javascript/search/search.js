export function initSearch(products) {
  const searchInput = document.getElementById('search-input');
  const searchResultBody = document.getElementById('search-results-body');
  const searchResult = document.querySelector('.search-results');

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === '') {
      searchResultBody.innerHTML = '';
      searchResult.style.display = 'none';
      return;
    }

    const filteredProducts = products.filter(product => {
      const { nom, description, tags } = product;
      const searchableData = `${nom.toLowerCase()} ${description.toLowerCase()} ${tags.join(' ').toLowerCase()}`;
      return searchableData.includes(searchTerm);
    });

    searchResultBody.innerHTML = '';
    searchResult.style.display = 'none';

    if (filteredProducts.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="4">Aucun produit trouvé</td>';
      searchResultBody.appendChild(row);
      searchResult.style.display = 'block'; // Afficher le message "Aucun produit trouvé"
    } else {
      searchResult.style.display = 'block';
      filteredProducts.forEach(product => {
        const { nom, description, images, prix } = product;
        const row = document.createElement('tr');
        const buttonSeeMore = document.createElement('button');
        buttonSeeMore.textContent = 'SEE MORE';
        row.innerHTML = `
          <td><img src="${images}" alt="${nom}" style="width: 50px; height: auto;"></td>
          <td>${nom}</td>
          <td>${description}</td>
          <td>${prix.toFixed(2)} $</td>
          <td>${buttonSeeMore.outerHTML}</td>
        `;
        searchResultBody.appendChild(row);
      });
    }
  });
}
