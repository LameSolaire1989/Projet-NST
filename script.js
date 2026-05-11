(function () {
  const webhookUrl = "https://default3d2e2497f4f140a482ea11a31347e3.79.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/785914b50c9a4d46ace2b0c2bcf7ab71/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qha8qkfuj7Scp-Rz7i50NcZ_wyveazM_ZGYfdP1eggw";

  const form = document.getElementById("nst-form");
  const statusEl = document.getElementById("statusMessage");
  const successToast = document.getElementById("successToast");
  const submitBtn = document.querySelector(".submit-btn");

  const photoInput = document.getElementById("scorePhoto");
  const photoButton = document.getElementById("photoButton");
  const photoPreviewContainer = document.getElementById("photoPreviewContainer");
  const photoPreview = document.getElementById("photoPreview");
  const photoRemoveBtn = document.getElementById("photoRemoveBtn");

  let currentPhotoBase64 = null;

  function initTogglePills() {
    const toggles = document.querySelectorAll(".toggle-pill");
    toggles.forEach(pill => {
      const inputs = pill.querySelectorAll("input[type='radio']");
      inputs.forEach(input => {
        input.addEventListener("change", () => {
          if (input.checked) {
            const option = input.closest(".toggle-option");
            const value = option.getAttribute("data-value");
            pill.setAttribute("data-value", value);

            pill.querySelectorAll(".toggle-option").forEach(o => o.classList.remove("is-active"));
            option.classList.add("is-active");
          }
        });
      });
    });
  }

  function setStatus(message, type) {
    statusEl.textContent = message || "";
    statusEl.className = "status-message" + (type ? " " + type : "");
  }

  function showSuccessToast() {
    if (!successToast) return;
    successToast.classList.add("is-visible");
    window.setTimeout(() => {
      successToast.classList.remove("is-visible");
    }, 2600);
  }

  initTogglePills();

  if (photoButton && photoInput) {
    photoButton.addEventListener('click', () => {
      photoInput.click();
    });

    photoRemoveBtn.addEventListener('click', () => {
      currentPhotoBase64 = null;
      photoInput.value = "";
      photoPreviewContainer.style.display = "none";
      photoButton.style.display = "flex";
    });

    photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      submitBtn.disabled = true;
      photoButton.classList.add('is-processing');
      photoButton.innerHTML = 'Traitement en cours...';

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_SIZE = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          currentPhotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          photoPreview.src = currentPhotoBase64;
          photoButton.style.display = 'none';
          photoPreviewContainer.style.display = 'block';
          
          photoButton.classList.remove('is-processing');
          photoButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>Prendre mon score en photo`;
          submitBtn.disabled = false;
        };
        img.onerror = () => {
           photoButton.classList.remove('is-processing');
           photoButton.innerHTML = 'Erreur d\'image. Réessayer.';
           submitBtn.disabled = false;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // --- AUTOCOMPLETE ÉTABLISSEMENT ---
  const etablissements = [
    "CS Eastern Townships", "CSS au Cœur-des-Vallées", "CSS de Charlevoix", "CSS de Kamouraska-Rivière-du-Loup",
    "CSS de l'Énergie", "CSS de l'Or-et-des-Bois", "CSS de la Beauce-Etchemin", "CSS de la Capitale",
    "CSS de la Côte-du-Sud", "CSS De La Jonquière", "CSS de la Moyenne-Côte-Nord", "CSS de la Riveraine",
    "CSS de la Rivière-du-Nord", "CSS de la Vallée-des-Tisserands", "CSS de Montréal", "CSS de Portneuf",
    "CSS de Rouyn-Noranda", "CSS de Saint-Hyacinthe", "CSS de Sorel-Tracy", "CSS des Affluents",
    "CSS des Appalaches", "CSS des Bois-Francs", "CSS des Chic-Chocs", "CSS des Découvreurs",
    "CSS des Grandes-Seigneuries", "CSS des Hautes-Rivières", "CSS des Hauts-Bois-de-l'Outaouais",
    "CSS des Sommets", "CSS des Premières-Seigneuries", "CSS des Rives-du-Saguenay", "CSS des Hauts-Cantons",
    "CSS des Îles", "CSS des Laurentides", "CSS des Mille-Îles", "CSS de la Pointe-de-l'Île",
    "CSS des Monts-et-Marées", "CSS des Navigateurs", "CSS des Patriotes", "CSS des Phares",
    "CSS des Portages-de-l'Outaouais", "CSS des Samares", "CSS des Trois-Lacs", "CSS du Fer",
    "CSS du Fleuve-et-des-Lacs", "CSS du Lac-Saint-Jean", "CSS du Lac-Témiscamingue", "CSS du Littoral",
    "CSS du Pays-des-Bleuets", "CSS du Val-des-Cerfs", "CSS Harricana", "CSS Marguerite-Bourgeoys",
    "CSS Marie-Victorin", "CSS René-Lévesque", "CSS des Hautes-Laurentides", "CSS de Laval",
    "Cégep à distance", "Cégep André-Laurendeau", "Cégep Beauce-Appalaches", "Cégep Champlain - Lennoxville",
    "Cégep Champlain - Saint-Lambert", "Cégep Champlain - Saint-Lawrence", "Cégep de Baie-Comeau",
    "Cégep de Chicoutimi", "Cégep de Drummondville", "Cégep de Granby", "Cégep de Jonquière",
    "Cégep de l'Abitibi-Témiscamingue", "Cégep de l'Outaouais", "Cégep de la Gaspésie et des Îles",
    "Cégep de La Pocatière", "Cégep de Lévis", "Cégep de Matane", "Cégep de Rimouski",
    "Cégep de Rivière-du-Loup", "Cégep de Saint-Félicien", "Cégep de Saint-Hyacinthe",
    "Cégep de Saint-Jean-sur-Richelieu", "Cégep de Saint-Jérôme", "Cégep de Saint-Laurent",
    "Cégep de Sainte-Foy", "Cégep de Sept-Îles", "Cégep de Shawinigan", "Cégep de Sherbrooke",
    "Cégep de Sorel-Tracy", "Cégep de Thetford", "Cégep de Trois-Rivières", "Cégep de Valleyfield",
    "Cégep de Victoriaville", "Cégep du Vieux Montréal", "Cégep Édouard-Montpetit", "Cégep Garneau",
    "Cégep Gérald-Godin", "Cégep Limoilou", "Cégep Lionel-Groulx", "Cégep Marie-Victorin",
    "Cégep Montmorency", "Cégep régional de Lanaudière", "Collège Ahuntsic", "Collège d'Alma",
    "Collège de Bois-de-Boulogne", "Collège de Maisonneuve", "Collège de Rosemont", "Dawson College",
    "Heritage College", "John Abbott College", "Vanier College", "Autre"
  ];

  const inputEtablissement = document.getElementById("etablissement");
  const autocompleteList = document.getElementById("etablissement-autocomplete");
  let currentFocus = -1;

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function renderAutocomplete(items) {
    autocompleteList.innerHTML = "";
    if (items.length === 0) {
      autocompleteList.classList.remove("is-open");
      return;
    }
    
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "autocomplete-item";
      li.textContent = item;
      li.addEventListener("click", () => {
        inputEtablissement.value = item;
        autocompleteList.classList.remove("is-open");
      });
      autocompleteList.appendChild(li);
    });
    
    autocompleteList.classList.add("is-open");
    currentFocus = -1;
  }

  if (inputEtablissement && autocompleteList) {
    inputEtablissement.addEventListener("input", function() {
      const val = this.value;
      if (!val) {
        renderAutocomplete(etablissements);
        return;
      }
      
      const searchStr = removeAccents(val);
      const matches = etablissements.filter(e => removeAccents(e).includes(searchStr));
      
      renderAutocomplete(matches);
    });

    inputEtablissement.addEventListener("focus", function() {
      if (this.value) {
        const searchStr = removeAccents(this.value);
        const matches = etablissements.filter(e => removeAccents(e).includes(searchStr));
        renderAutocomplete(matches);
      } else {
        renderAutocomplete(etablissements);
      }
    });

    inputEtablissement.addEventListener("keydown", function(e) {
      let items = autocompleteList.querySelectorAll(".autocomplete-item");
      if (e.key === "ArrowDown") {
        currentFocus++;
        addActive(items);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        currentFocus--;
        addActive(items);
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (autocompleteList.classList.contains("is-open")) {
          e.preventDefault(); // Prevents form submission when picking an item
          if (currentFocus > -1 && items) {
            items[currentFocus].click();
          } else if (items.length > 0) {
            items[0].click();
          }
        }
      } else if (e.key === "Escape") {
         autocompleteList.classList.remove("is-open");
      }
    });

    function addActive(items) {
      if (!items || items.length === 0) return false;
      removeActive(items);
      if (currentFocus >= items.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (items.length - 1);
      items[currentFocus].classList.add("is-active");
      items[currentFocus].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function removeActive(items) {
      items.forEach(item => item.classList.remove("is-active"));
    }

    document.addEventListener("click", function(e) {
      if (e.target !== inputEtablissement && e.target !== autocompleteList) {
        autocompleteList.classList.remove("is-open");
      }
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentPhotoBase64) {
      if (photoButton) {
        photoButton.classList.add("error-shake");
        setTimeout(() => photoButton.classList.remove("error-shake"), 400);
      }
      setStatus("Veuillez prendre en photo le score pour valider votre participation.", "error");
      return;
    }

    setStatus("Envoi en cours…", "");

    const formData = new FormData(form);
    const payload = {
      nom: formData.get("NomComplet") || "",
      courriel: formData.get("Courriel") || "",
      etablissement: formData.get("Etablissement") || "",
      clientNST: formData.get("DejaClientNST") || "",
      clientRoboPack: formData.get("DejaClientRoboPack") || "",
      score: formData.get("ScoreObtenu") ? Number(formData.get("ScoreObtenu")) : null,
      SourceFormulaire: formData.get("SourceFormulaire") || "Kiosque Arcade",
      photoBase64: currentPhotoBase64 || null
    };

    if (!webhookUrl || webhookUrl === "VOTRE_URL_WEBHOOK_POWER_AUTOMATE") {
      setStatus("Webhook Power Automate non configuré. Merci de définir l’URL dans script.js.", "error");
      return;
    }

    try {
      // Configuration du timeout de 8 secondes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      // Annuler le timeout si la requête réussit avant
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Code HTTP " + response.status);
      }

      setStatus("Merci ! Votre participation a été envoyée avec succès.", "success");
      showSuccessToast();
      form.reset();
      if (photoRemoveBtn) photoRemoveBtn.click();
    } catch (err) {
      console.error(err);
      if (err.name === 'AbortError') {
        setStatus("Le délai d'attente est dépassé. Vérifiez la connexion internet.", "error");
      } else {
        setStatus("Une erreur est survenue lors de l’envoi. Merci de réessayer ou d’aviser l’équipe NST.", "error");
      }
    }
  });
})();

