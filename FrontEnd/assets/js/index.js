// Variable pour stocker les projets
let projects;

// Variable gallery utilisée dans fetchWorks et filterProjects
const gallery = document.querySelector(".gallery");
const galleryModal = document.querySelector('.gallery-modal');

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

function createGalleryModal(project) {
  
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const btnDelete = document.createElement('button');

    const trash = document.createElement('i');
    trash.classList.add('fa-solid', 'fa-trash-can')

    image.src = project.imageUrl;
    image.alt = project.title;
    figure.appendChild(image);
    figure.appendChild(btnDelete);
    btnDelete.appendChild(trash);

   // Événements pour le bouton de la corbeille
   btnDelete.addEventListener('click', (e) => {
    e.preventDefault(); 
    deleteProject(project.id);
});

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
        gallery.innerHTML="";
        galleryModal.innerHTML="";

        // Ajouter les projets à la galerie en utilisant la fonction createGallery
        projects.forEach(project => {
            gallery.appendChild(createGallery(project));
            galleryModal.appendChild(createGalleryModal(project));
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




// Ajouter une nouvelle image : 



document.addEventListener('DOMContentLoaded', function () {
    console.log("Le contenu de la page est chargé.");
    const addNewWorkForm = document.getElementById("form-add-new-work");
    if (addNewWorkForm) {
        const fileInput = document.getElementById("file");
        const previewImage = document.getElementById("previewImage");
        console.log(previewImage);

        // Voir image avant de valider 
        if (fileInput) {
            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
       // Vérifier si un fichier d'image est sélectionné
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
        
                    reader.addEventListener('load', function (e) {
                        previewImage.src = e.target.result;
                    });
        
                    reader.readAsDataURL(file);
                } else {
                    console.log("Veuillez sélectionner une image.");
                }
            });
        } else {
            console.error("Champ de fichier introuvable.");
        }
        
        addworks(); // Appel de la fonction addworks 
    }
});

function addworks() {
    const addNewWorkForm = document.getElementById("form-add-new-work");
    addNewWorkForm.addEventListener("submit", async function (e) {
        e.preventDefault();
     
       // Récupérer les valeurs du formulaire
       const title = document.getElementById("title").value;
       const category = document.getElementById("category-input").value;
       const image = document.getElementById("file").files[0];
      
        
       // Vérifier si une image a été sélectionnée
       if (!image) {
        console.error("Veuillez sélectionner une image.");
        return;
       }
  
        // Récupérer le token d'authentification depuis localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token d'authentification introuvable.");
            return;
        }
        // Créer un objet FormData pour envoyer les données
       
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", image);
    
        try {
            // Envoyer les données au serveur
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            console.log("Réponse de la requête POST :", response); 
            if (!response.ok) {
                throw new Error(`Erreur lors de l'ajout du projet, statut ${response.status}`);
            }
             // Mettre à jour les projets depuis l'API
             await fetchWorks();
      
      
        } catch (error) {
            console.error('Erreur pour ajouter projet :', error);
        }
    });
}

// Fonction pour supprimer un projet



async function deleteProject(projectId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du projet, statut ${response.status}`);
        }
        // Supprimer le projet de la liste
        projects = projects.filter(project => project.id !== projectId);
        // Supprimer le projet de la galerie
        const galleryItem = document.querySelector(`[data-id="${projectId}"]`);
        if (galleryItem) {
            galleryItem.remove();
        }
        // Supprimer le projet de la modal
        const modalItem = document.querySelector(`[data-id="modal--${projectId}"]`);
        if (modalItem) {
            modalItem.remove();
        }
        await fetchWorks();
    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
    }
}