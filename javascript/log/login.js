function getToken() {
    const cookie = document.cookie.split(';');
    const tokenCookie = cookie.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

function isAuthenticated() {
    const token = getToken();
    return token != null;
}

async function displayUserName() {
    const token = getToken();

    try {
        const response = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const userInfo = document.querySelector('.user-info');
            const navbarUserName = document.createElement('span');
            navbarUserName.textContent = `Hi ${data.firstName} ${data.lastName}`;
            userInfo.appendChild(navbarUserName);
        } else {
            console.log('Error retrieving user information');
        }
    } catch (error) {
        console.log('An error occurred:', error);
    }
}

function handleLogout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = 'login.html';
}

async function updateUI() {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');

    if (isAuthenticated()) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        await displayUserName();
        logoutButton.addEventListener('click', handleLogout);
    } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
    }
}

window.addEventListener('load', updateUI);