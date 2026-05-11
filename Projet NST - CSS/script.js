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
      commission: formData.get("CommissionScolaire") || "",
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

