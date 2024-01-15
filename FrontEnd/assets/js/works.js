// Ajout des projets de l'architecte
async function fetchWorks() {
  try {
    // Chemin pour l'API works
    const response = await fetch("http://localhost:5678/api/works");

    // Vérifie si la réponse est OK
    if (!response.ok) {
      throw new Error(`Erreur de réseau, statut ${response.status}`);
    }

    // Mettre réponse dans un fichier .json
    const projects = await response.json();

    // Affiche les données 
    console.log('Données récupérées avec succès :', projects);

    // Appel de la classe "gallery" dans le code html
    const gallery = document.querySelector(".gallery");

    // Boucle foreach pour parcourir les projets 
    projects.forEach(project => {
     
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const titre = document.createElement("figcaption");

      image.src = project.imageUrl;
      image.alt = project.title;
      titre.innerHTML = project.title;

      // Ajoute les éléments à la galerie
      gallery.appendChild(figure);
      figure.appendChild(image);
      figure.appendChild(titre);
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des œuvres :', error);
  }
}
// Appelle la fonction pour récupérer les projets
fetchWorks();