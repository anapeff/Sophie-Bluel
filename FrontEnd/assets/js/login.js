document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginform");
    const loginButton = document.getElementById("loginButton"); 
 

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        toggleLoginStatus();  //  fonction pour gérer la connexion/déconnexion
    });

    function badLogin(status = null) {
        const errorMessage = document.querySelector(".bad_login");
        if (status === 401) {
            errorMessage.textContent = "Adresse e-mail ou mot de passe incorrect.";
        } else {
            errorMessage.textContent = "Erreur lors de la connexion, veuillez réessayer.";
        }
        errorMessage.style.display = "block";
    }

    async function login(email, password) {
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // Mettez à jour le bouton après une connexion réussie
            updateLoginButton();

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                localStorage.setItem("token", token);

           
                console.log("Connexion réussie. Token:", token);
                console.log("Redirection vers index.html...");
                window.location.href = "index.html";
            } else {
                badLogin(response.status);
            }
        } catch (error) {
            console.error("Erreur", error);
            badLogin();
        }
    }

    function updateLoginButton() {
        const isLoggedIn = localStorage.getItem("token");
        const loginButton = document.getElementById("loginButton");
        const editLink = document.getElementById("editLink"); 
        const filtres = document.querySelector('.filtres'); 
        const blackBar = document.getElementById("black-bar"); 
     

        if (isLoggedIn) {
            loginButton.textContent = "Logout";
            if (editLink) {
                editLink.classList.remove("hidden");
            }
            if (blackBar) {
                blackBar.classList.remove("hidden");
            }
               // Cacher les filtres si l'utilisateur est connecté
            if (filtres) {
            filtres.classList.add("hidden");
        }
        } else {
            loginButton.textContent = "Login";
            if (editLink) {
                editLink.classList.add("hidden");
            }
             // Afficher les filtres si l'utilisateur n'est pas connecté
              // Cacher la barre noire si l'utilisateur n'est pas connecté
        if (blackBar) {
            blackBar.classList.add("hidden");
        }
        if (filtres) {
            filtres.classList.remove("hidden");
        }
        }
    }

    function logout() {
        const isLoggedIn = localStorage.getItem("token");

        if (isLoggedIn) {
            localStorage.removeItem("token");
            updateLoginButton();
            window.location.href = "login.html";
        } else {
 
            console.log("L'utilisateur n'est pas connecté.");
        }
    }

    // fonction pour gérer la connexion/déconnexion
    function toggleLoginStatus() {
        const isLoggedIn = localStorage.getItem("token");

        if (isLoggedIn) {
            // L'utilisateur est connecté, déconnecte
            logout();
        } else {
  
            window.location.href = "login.html";
        }
    }

    // Appelez updateLoginButton()
    updateLoginButton();

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const isLoggedIn = localStorage.getItem("token");

            if (isLoggedIn === "true") {
                
                console.log("Redirection vers index.html...");
                window.location.href = "index.html";
            } else {
                const email = document.querySelector("#email").value;
                const password = document.querySelector("#password").value;
                await login(email, password);
            }
        });
    }
});