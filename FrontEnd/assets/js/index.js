// Variable pour stocker les projets
let projects;


// Variable gallery utilisé dans fetchWorks et filterProjects
const gallery = document.querySelector(".gallery");




// Fonction pour créer la galerie avec les projets
function createGallery(project) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const titre = document.createElement("figcaption");

    image.src = project.imageUrl;
    image.alt = project.title;
    titre.innerHTML = project.title;

    figure.appendChild(image);
    figure.appendChild(titre);

    return figure;
}

// Récupérer les projets depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");

        if (!response.ok) {
            throw new Error(`Erreur de réseau, statut ${response.status}`);
        }

        // Mettre réponse dans un fichier .json
        projects = await response.json();

       


        // Ajouter les projets à la galerie en utilisant la fonction createGallery
        projects.forEach(project => {
            gallery.appendChild(createGallery(project));
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des œuvres :', error);
    }
}


fetchWorks();





async function fetchCategories() {
    try {
        // Chemin pour l'API categories
        const response = await fetch("http://localhost:5678/api/categories");

       
        if (!response.ok) {
            throw new Error(`Erreur de réseau, statut ${response.status}`);
        }

        // Mettre réponse dans un fichier .json
        const categories = await response.json();

        console.log('Données récupérées avec succès :', categories);

        let filtres = document.querySelector('.filtres');

        // Créer bouton Tous

        filtres.innerHTML = '<button class="btn-filtres" data-id="all">Tous</button>';

        // Créer autres boutons filtres

        for (let i = 0; i < categories.length; i++) {
            filtres.innerHTML += '<button class="btn-filtres" data-id="' + categories[i].id + '">' + categories[i].name + '</button>';
        }



        const btnFiltres = document.querySelectorAll('.btn-filtres');


 // Ajoute boucles aux boutons filtres

        btnFiltres.forEach(btn => {
            btn.addEventListener('click', () => {
                
                const categoryId = btn.getAttribute('data-id');
                filterProjects(categoryId);
            });
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
    }
}

async function filterProjects(categoryId) {
    try {
        
        gallery.innerHTML = '';

        if (!projects) await fetchWorks();

        const filteredProjects = (categoryId === 'all') ? projects : projects.filter(project => project.categoryId == categoryId);

        filteredProjects.forEach(project => gallery.appendChild(createGallery(project)));

        console.log('ok filtres');


    } catch (error) {
        console.error('Erreur lors de la filtration et du rendu des projets :', error);
    }
}

fetchCategories();