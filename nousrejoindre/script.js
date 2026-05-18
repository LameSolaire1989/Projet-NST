(function () {
  const webhookUrl = "https://default3d2e2497f4f140a482ea11a31347e3.79.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/785914b50c9a4d46ace2b0c2bcf7ab71/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qha8qkfuj7Scp-Rz7i50NcZ_wyveazM_ZGYfdP1eggw";

  const form = document.getElementById("robopack-form");
  const statusEl = document.getElementById("statusMessage");
  const successToast = document.getElementById("successToast");
  const submitBtn = document.querySelector(".submit-btn");

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

})();
