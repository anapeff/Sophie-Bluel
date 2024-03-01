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
    trash.classList.add('fa-solid', 'fa-trash-can');

    image.src = project.imageUrl;
    image.alt = project.title;
    figure.appendChild(image);
    figure.appendChild(btnDelete);
    btnDelete.appendChild(trash);

   // Événement pour le bouton de la corbeille
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
        console.error('Erreur lors de la récupération des projets :', error);
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
        // Ajouter style par défaut
        const allButton = '<button class="btn-filtres selected" data-id="all">Tous</button>';
        filtres.innerHTML = allButton;
        

        // Créer autres boutons filtres
        for (let i = 0; i < categories.length; i++) {
            filtres.innerHTML += '<button class="btn-filtres" data-id="' + categories[i].id + '">' + categories[i].name + '</button>';
        }

        const btnFiltres = document.querySelectorAll('.btn-filtres');

        btnFiltres.forEach(btn => {
            btn.addEventListener('click', () => {
                // Supprimez la classe "selected" de tous les boutons
                btnFiltres.forEach(button => button.classList.remove('selected'));
                // Ajoutez la classe "selected" au bouton cliqué
                btn.classList.add('selected');
        
                // Filtrer les projets par catégorie
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



// Ajouter une image


const ExtentionsOk = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

// Taille max
const maxFileSize = 4 * 1024 * 1024; 

// Vérifie si le fichier est une image et sa taille
function isImageFile(file) {
    return ExtentionsOk.includes(file.type) && file.size <= maxFileSize;
}

const fileInput = document.getElementById("file");
const previewImage = document.getElementById("previewImage");
const submitButton = document.getElementById("submitBtn");
const errorMessage = document.getElementById("error-message");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category-input");

document.addEventListener('DOMContentLoaded', function () {
    console.log("Le contenu de la page est chargé.");
    const addNewWorkForm = document.getElementById("form-add-new-work");
    if (addNewWorkForm) {
        console.log(previewImage);

        // Voir image avant de valider 
        if (fileInput) {
            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                // Vérifie si un fichier d'image est sélectionné
                if (file && isImageFile(file)) {
                    const reader = new FileReader();
                    reader.addEventListener('load', function (e) {
                        previewImage.src = e.target.result;
                        // Supprimer la propriété 'display: none;' pour afficher l'image
                        previewImage.style.display = "block";
                        // Vérifie si tous les champs sont remplis après avoir sélectionné une image
                        checkFormValidity();
                    });
                    reader.readAsDataURL(file);
                } else {
                    console.log("Veuillez sélectionner une image.");
                }
            });
        } else {
            console.error("Champ de fichier introuvable.");
        }

        addNewWorkForm.addEventListener("submit", async function (e) {
            e.preventDefault();

       
            errorMessage.textContent = '';

            // Récupére les valeurs du formulaire
            const title = titleInput.value.trim();
            const category = categoryInput.value.trim();
            const image = fileInput.files[0];

            // Vérifie si une image a été sélectionnée
            if (!image || !isImageFile(image)) {
                console.error("Veuillez sélectionner une image.");
                return;
            }

            // Vérifie titre et la catégorie 
            if (!title || !category) {
                errorMessage.textContent = "Veuillez saisir un titre et une catégorie.";
                return;
            }

            // Active le bouton Valider
            submitButton.classList.add("button-modal-2-active");

            // Récup le token d'authentification depuis localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                errorMessage.textContent = "Token d'authentification introuvable.";
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
                addNewWorkForm.reset();
                previewImage.style.display = "none";

                // Réinitialise la classe CSS du bouton valider
                submitButton.classList.remove("button-modal-2-active");

            } catch (error) {
                console.error('Erreur pour ajouter projets :', error);
            }
        });

// Fonction pour vérifier si tous les champs sont remplis + fichier image + taille fichier
function checkFormValidity() {
    const titleValue = titleInput.value.trim();
    const categoryValue = categoryInput.value.trim();
    const imageFile = fileInput.files[0];

    if (titleValue && categoryValue && imageFile) {
        // Tous les champs sont remplis

        if (isImageFile(imageFile)) {
            // Le fichier est une image et respecte la taille autoriséé"
            submitButton.classList.add("button-modal-2-active");
            errorMessage.textContent = ''; 
        } else {
            // Le fichier n'est pas une image ou dépasse la taille autorisée
            submitButton.classList.remove("button-modal-2-active");
            if (!isImageFile(imageFile)) {
                errorMessage.textContent = "Le fichier sélectionné n'est pas une image.";
            } else {
                errorMessage.textContent = "La taille du fichier dépasse la limite autorisée (4 Mo).";
            }
        }
    } else {
        // Si une info  est vide, ne pas activer le bouton
        submitButton.classList.remove("button-modal-2-active");
        errorMessage.textContent = '';
    }
}

        // Vérifie si tous les champs sont remplis sinon affiche un message d'erreur 
        titleInput.addEventListener('change', checkFormValidity);
        categoryInput.addEventListener('change', checkFormValidity);
        fileInput.addEventListener('change', checkFormValidity);
    }
});







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
        // Supprimer le projet de la modale
        const modalItem = document.querySelector(`[data-id="modal--${projectId}"]`);
        if (modalItem) {
            modalItem.remove();
        }
        await fetchWorks();
    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
    }
}