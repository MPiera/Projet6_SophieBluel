import { activerFiltre, affichagePhotos } from "./modules/photos.js";

let photos = [];
let modal = null;
let modal2 = null;

// ==================== Fonction : Connexion ==================== //
// Permet à l'utilisateur de se connecter via un formulaire de login.
// Elle capture l'email et le mot de passe saisis, envoie une requête POST à l’API,
// stocke le token dans le localStorage si la connexion est réussie, et redirige vers index.html.
// En cas d’échec, une alerte s’affiche.
function connection() {
  const formulaire = document.getElementById("loginF");
  if (!formulaire) return;

  formulaire.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("mdp").value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: pass }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else {
        alert("Erreur dans le mot de passe ou l'adresse E-mail");
      }
    } catch (err) {
      console.error("Erreur lors de la tentative de connexion", err);
    }
  });
}

// ==================== Fonction principale : DOMContentLoaded ==================== //
// Elle gère l'initialisation à la fin du chargement du DOM.
// Elle récupère les photos et catégories depuis l’API, les affiche, active les filtres,
// initialise les modales et gère l'état de connexion de l'utilisateur.
document.addEventListener("DOMContentLoaded", async () => {
  if (document.querySelector(".gallery")) {
    const response = await fetch("http://localhost:5678/api/works");
    photos = await response.json();
    affichagePhotos(photos);
    activerFiltre(photos);
    chargerCategories();
    chargerModalePhotos();
  }

  if (document.getElementById("loginF")) {
    connection();
  }

  const logoutLink = document.getElementById("nav-login");
  const bandeau = document.getElementById("bandeau-admin");
  const modifierLink = document.querySelector(".modifier-link");
  const filtreOff = document.querySelector("#filtre-container");

  // ==================== Gestion de l'affichage selon l'état connecté ==================== //
  // Change l'affichage de certains éléments selon si l'utilisateur est connecté ou non
  if (logoutLink) {
    const token = localStorage.getItem("token");

    if (token) {
      if (modifierLink) modifierLink.style.display = "flex";
      logoutLink.textContent = "logout";
      logoutLink.href = "#";
      filtreOff.style.display = "none";
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
      document.body.classList.add("connecte");
      if (bandeau) bandeau.style.display = "flex";
    } else {
      logoutLink.textContent = "login";
      logoutLink.href = "login.html";
      if (bandeau) bandeau.style.display = "none";
      if (modifierLink) modifierLink.style.display = "none";
    }
  }

  // ==================== Fonction : Ouvrir la première modale ==================== //
  // Ouvre une modale et prépare les événements de fermeture.
  const openModal = function (e) {
    e.preventDefault();
    const href = e.target.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;

    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;

    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
  };

  // ==================== Fonction : Fermer la première modale ==================== //
  // Ferme la première modale en masquant son affichage et en supprimant les écouteurs.
  const closeModal = function (e = null) {
    if (modal === null) return;
    if (e) e.preventDefault();

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
  };

  // ==================== Fonction : Empêcher la propagation ==================== //
  // Empêche la fermeture de la modale si on clique à l'intérieur.
  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });

  // ==================== Fonction : Ouvrir la deuxième modale ==================== //
  // Similaire à la première, mais utilisée pour l’ajout de photo. Ferme la première si elle est ouverte.
  const openModal2 = function (e) {
    e.preventDefault();
    if (modal !== null) {
      closeModal();
    }

    const selector = e.target.getAttribute("modal2");
    const target2 = document.querySelector(selector);
    if (!target2) return;

    target2.style.display = "flex";
    target2.removeAttribute("aria-hidden");
    target2.setAttribute("aria-modal", "true");
    modal2 = target2;

    modal2.addEventListener("click", closeModal2);
    modal2.querySelector(".js-modal-close2").addEventListener("click", closeModal2);
    modal2.querySelector(".js-modal-stop2").addEventListener("click", stopPropagation);
  };

  // ==================== Fonction : Réinitialiser les champs de la deuxième modale ==================== //
  // Vide les champs du formulaire d’ajout (titre, fichier, catégorie) et remet l’aperçu par défaut.
  const resetModal2 = function () {
    const selectCategorie = document.getElementById("categorieFormulaire");
    const titleInput = document.getElementById("titleForm");
    const imagePreview = document.getElementById("image-preview");
    const fileInput = document.getElementById("photo-upload");
    const uploadButton = document.querySelector(".upload-btn");

    if (selectCategorie) selectCategorie.value = "";
    if (titleInput) titleInput.value = "";
    if (fileInput) fileInput.value = "";
    if (imagePreview) {
      imagePreview.src = "./assets/icons/Vector.png";
      imagePreview.style.opacity = 0.8;
    }
    if (uploadButton) uploadButton.style.display = "inline-block";
  };

  // ==================== Fonction : Fermer la deuxième modale ==================== //
  // Ferme la modale d’ajout, réinitialise le formulaire et supprime les événements.
  const closeModal2 = function (e = null) {
    if (modal2 === null) return;
    if (e) e.preventDefault();
    resetModal2();
    modal2.style.display = "none";
    modal2.setAttribute("aria-hidden", "true");
    modal2.removeAttribute("aria-modal");
    modal2.removeEventListener("click", closeModal2);
    modal2.querySelector(".js-modal-close2").removeEventListener("click", closeModal2);
    modal2.querySelector(".js-modal-stop2").removeEventListener("click", stopPropagation);
    modal2 = null;
  };

  document.querySelectorAll(".js-modal2").forEach((a) => {
    a.addEventListener("click", openModal2);
  });

  // ==================== Fonction : Aperçu de l’image ==================== //
  // Affiche un aperçu de l’image sélectionnée dans le formulaire d’ajout.
  const inputFile = document.getElementById("photo-upload");
  const imagePreview = document.getElementById("image-preview");
  const uploadButton = document.querySelector(".upload-btn");

  if (inputFile && imagePreview && uploadButton) {
    inputFile.addEventListener("change", function () {
      const file = inputFile.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imagePreview.style.opacity = 1;
          uploadButton.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ==================== Fonction : Charger les catégories ==================== //
  // Récupère les catégories depuis l’API et les insère comme options dans le menu déroulant du formulaire.
  async function chargerCategories() {
    const selectElement = document.getElementById("categorieFormulaire");

    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();

      selectElement.innerHTML = '<option value=""></option>';

      categories.forEach(categorie => {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.innerText = categorie.name;
        selectElement.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    }
  }

  // ==================== Fonction : Charger les photos dans la modale ==================== //
  // Affiche les miniatures des photos dans la modale d’administration avec un bouton de suppression.
  async function chargerModalePhotos() {
    const container = document.querySelector(".galleryModale");
    if (!container) return;

    container.innerHTML = "";

    photos.forEach(photo => {
      const figure = document.createElement("figure");
      figure.classList.add("modale-photo");

      const img = document.createElement("img");
      img.src = photo.imageUrl;
      img.alt = photo.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteBtn.classList.add("btn-delete");

      // Suppression de l'image via l'API
      deleteBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");

        try {
          const res = await fetch(`http://localhost:5678/api/works/${photo.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            photos = photos.filter(p => p.id !== photo.id);
            affichagePhotos(photos);
            chargerModalePhotos();
          } else {
            alert("Erreur lors de la suppression.");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      });

      figure.appendChild(img);
      figure.appendChild(deleteBtn);
      container.appendChild(figure);
    });
  }

  // ==================== Fonction : Soumettre une nouvelle photo ==================== //
  // Envoie une nouvelle photo au serveur si tous les champs sont remplis et l’image est valide.
  // En cas de succès, met à jour la galerie et ferme la modale.
  const formulaireAjout = document.getElementById("form-ajout");

  if (formulaireAjout) {
    formulaireAjout.addEventListener("submit", async function (event) {
      event.preventDefault();

      const imageInput = document.getElementById("photo-upload");
      const titleInput = document.getElementById("titleForm");
      const categorySelect = document.getElementById("categorieFormulaire");

      const file = imageInput.files[0];
      const tailleMax = 4 * 1024 * 1024;
      const title = titleInput.value;
      const category = categorySelect.value;

      if (!file || !title || !category) {
        alert("Veuillez remplir tous les champs et ajouter une image.");
        return;
      }

      if (file.size > tailleMax) {
        alert("Le fichier dépasse 4mo");
        imageInput.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("category", category);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour envoyer une image.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          closeModal2();
          const updated = await fetch("http://localhost:5678/api/works");
          photos = await updated.json();
          affichagePhotos(photos);
          chargerModalePhotos();
        } else {
          alert("Erreur lors de l'envoi de l'image.");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        alert("Une erreur s'est produite.");
      }
    });
  }
});
