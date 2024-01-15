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
  
    





      
  
    } catch (error) {
      console.error('Erreur lors de la récupération des œuvres :', error);
    }
  }

  fetchCategories();