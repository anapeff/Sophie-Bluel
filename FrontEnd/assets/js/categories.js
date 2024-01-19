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

      filtres.innerHTML = '<button class="btn-filtres">Tous</button>';

      for(let i=0; i < categories.length; i++){
        filtres.innerHTML += '<button class="btn-filtres" data-id="' + categories[i].id + '">' + categories[i].name + '</button>';
      }

      // Appeler les boutons de filtrages
      // Créer une boucle "forEach" sur les boutons
      // Appeler l'id du bouton et le comparer avec celui des travaux
      // Retourner le résultat
  




  
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres :', error);
    }
  }

  fetchCategories();