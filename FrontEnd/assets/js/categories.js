async function fetchCategories() {
  try {
    // Chemin pour l'API categories
    const response = await fetch("http://localhost:5678/api/categories");

    // Vérifie si la réponse est OK
    if (!response.ok) {
      throw new Error(`Erreur de réseau, statut ${response.status}`);
    }

    // Mettre réponse dans un fichier .json
    const categories = await response.json();

    console.log('Données récupérées avec succès :', categories);
    
    let filtres = document.querySelector('.filtres');


     // Ajout du bouton 'Tous' avec data-id="all"
    filtres.innerHTML = '<button class="btn-filtres" data-id="all">Tous</button>';


    for(let i=0; i < categories.length; i++){
      filtres.innerHTML += '<button class="btn-filtres" data-id="' + categories[i].id + '">' + categories[i].name + '</button>';
    }


  // Appeler les boutons de filtrage
  const boutonsFiltres = document.querySelectorAll('.btn-filtres');
  
// Créer une boucle "forEach" sur les boutons
  boutonsFiltres.forEach(bouton => {
    bouton.addEventListener('click', () => {
      const categoryId = bouton.getAttribute('data-id');
      console.log('Bouton cliqué, ID de catégorie :', categoryId);
      filtrerProjetsParCategorie(categoryId);
    });
  });

} catch (error) {
   console.error('Erreur lors de la récupération des catégories :', error);
}
}
 
 // Appelle la fonction pour récupérer les catégories
 fetchCategories();
 
 
 function filtrerProjetsParCategorie(categoryId) {
  const gallery = document.querySelector('.gallery');
  const projets = gallery.querySelectorAll('figure');

  projets.forEach(projet => {
    const projetCategoryId = projet.getAttribute('data-category');
    console.log('ID de catégorie du projet :', projetCategoryId);

    // Ajouter une vérification si l'attribut data-category est défini
    if (projetCategoryId !== null && projetCategoryId !== undefined) {
      if (categoryId === 'all' || projetCategoryId.toString() === categoryId) {
        projet.style.display = 'block';
      } else {
        projet.style.display = 'none';
      }
    }
  });
}