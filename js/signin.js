async function getHome() {
    const email = document.querySelector('.js-email').value;
    const password = document.querySelector('.js-pass').value;
    const para = document.querySelector('.para');

    if (!email || !password) {
    
        para.classList.add('js-para');
        para.innerHTML = '⚠️ Enter the correct email and password';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/signin', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            if (response.status === 401) {
                para.innerHTML = '❌ Invalid email or password';
            } else {
                para.innerHTML = '❌ Server error. Please try again.';
            }
            return;
        }

        const data = await response.json();
        console.log('✅ Log in successful');

        // ✅ Store correct user details
        localStorage.clear();
        localStorage.setItem('email', data.email);
        localStorage.setItem('tasks', JSON.stringify(data.tasks));

        // ✅ Show success message & redirect
        para.innerHTML = '✅ Logged In Successfully! Redirecting...';
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1500);

    } catch (err) {
        para.innerHTML = '❌ Network error. Please try again.';
        console.error("❌ Error:", err);
    }
}

// ✅ Event Listener for Sign-In Button
document.querySelector('.js-signin').addEventListener('click', getHome);
