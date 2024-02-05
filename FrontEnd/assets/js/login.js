document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginform");

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

            console.log("Réponse du serveur :", response.status, response.statusText);
    // Si la réponse est OK (statut 200)
            if (response.ok) {
                // Avoir le token de la réponse JSON
                const responseData = await response.json();
                const token = responseData.token;
                console.log("Token récupéré :", token);
                // Enregistre le jeton dans le stockage local
                localStorage.setItem("token", token);
                // Redirige l'utilisateur vers la page index.html
                window.location.href = "index.html";
            } else {
                badLogin(response.status);
            }
        } catch (error) {
            console.error("Erreur", error);
            badLogin();
        }
    }
// Fonction pour afficher un message d'erreur de connexion
    function badLogin(status = null) {
        const badLogin = document.querySelector(".bad_login");
        let message;

        if (status === 401) {
            message = "Non autorisé - Vérifiez les identifiants.";
        } else if (status === 404) {
            message = "Utilisateur non trouvé.";
        } else {
            message = "Une erreur inattendue s'est produite. Veuillez réessayer.";
        }

        badLogin.textContent = message;
        badLogin.style.display = "flex";
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
              // Vérifie si déjà connecté
            const isLoggedIn = localStorage.getItem("token");
            
            if (isLoggedIn === "true") {
                 // Si déjà connecté, va vers index.html
                 window.location.href = "index.html";
                 // Si non connecté, récupéreles valeurs du formulaire et appelle la fonction de connexion
            } else {
                const email = document.querySelector("#email").value;
                const password = document.querySelector("#password").value;
                await login(email, password);
            }
        });
    } 
});