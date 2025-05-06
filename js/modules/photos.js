// ================= Filtrage ================= //

// Fonction qui active les filtres pour trier les photos par catégorie
// Cette fonction ajoute des écouteurs d’événements aux boutons de filtre (Tous, Objets, Appartements, Hotels & Restaurants).
// Lorsqu’un bouton est cliqué, elle filtre les photos en fonction de leur catégorie (id) et les affiche dans la galerie.
// Elle gère également l'apparence du bouton actif en ajoutant/retirant la classe CSS "active".
async function activerFiltre(photos) {
  const boutonTous = document.querySelector(".btn_tous");
  const boutonObjets = document.querySelector(".btn_objets");
  const boutonApparts = document.querySelector(".btn_appart");
  const boutonHotels = document.querySelector(".btn_hotels");

  const tousLesBoutons = document.querySelectorAll(".filtre-btn");

  function activerBouton(boutonClique) {
    tousLesBoutons.forEach((btn) => btn.classList.remove("active"));
    boutonClique.classList.add("active");
  }

  if (boutonTous) {
    boutonTous.addEventListener("click", function () {
      affichagePhotos(photos);
      activerBouton(this);
    });
  }

  if (boutonObjets) {
    boutonObjets.addEventListener("click", function () {
      const photosFiltrees = photos.filter((photo) => photo.category.id === 1);
      affichagePhotos(photosFiltrees);
      activerBouton(this);
    });
  }

  if (boutonApparts) {
    boutonApparts.addEventListener("click", function () {
      const photosFiltrees = photos.filter((photo) => photo.category.id === 2);
      affichagePhotos(photosFiltrees);
      activerBouton(this);
    });
  }

  if (boutonHotels) {
    boutonHotels.addEventListener("click", function () {
      const photosFiltrees = photos.filter((photo) => photo.category.id === 3);
      affichagePhotos(photosFiltrees);
      activerBouton(this);
    });
  }
}

// ================= Affichage des Photos ================= //

// Fonction qui affiche une liste de photos dans la galerie principale du DOM
// Cette fonction prend un tableau de photos et vide d’abord le contenu actuel de la galerie HTML.
// Ensuite, elle crée dynamiquement pour chaque photo un élément <figure> contenant une <img> et une <figcaption>.
// Elle ajoute chaque figure dans l’élément ".gallery" pour les afficher à l’écran.
async function affichagePhotos(photos) {
  const gallery = document.querySelector(".gallery");

  if (!gallery) return;

  gallery.innerHTML = "";

  photos.forEach((photo) => {
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    const nomElement = document.createElement("figcaption");

    imageElement.src = photo.imageUrl;
    imageElement.alt = photo.title;
    nomElement.innerText = photo.title;

    figure.appendChild(imageElement);
    figure.appendChild(nomElement);
    gallery.appendChild(figure);
  });
}

// On exporte les deux fonctions pour les utiliser dans d'autres fichiers comme script.js
export {activerFiltre, affichagePhotos};
