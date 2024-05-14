document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password-user');
  const errorMessage = document.createElement('div');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.token}; path=/`;
        window.location.href = 'index.html';
      } else {
        const error = await response.json();
        errorMessage.textContent = `Authentification error : ${error.message}`;
        form.appendChild(errorMessage); // Ajouter le message d'erreur au formulaire
      }
    } catch (error) {
      console.error('Une erreur est survenue :', error);
    }
  });
});