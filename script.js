(function () {
  const webhookUrl = "https://default3d2e2497f4f140a482ea11a31347e3.79.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/785914b50c9a4d46ace2b0c2bcf7ab71/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qha8qkfuj7Scp-Rz7i50NcZ_wyveazM_ZGYfdP1eggw";

  const form = document.getElementById("nst-form");
  const statusEl = document.getElementById("statusMessage");
  const successToast = document.getElementById("successToast");

  function initTogglePills() {
    const toggles = document.querySelectorAll(".toggle-pill");
    toggles.forEach(pill => {
      const options = pill.querySelectorAll(".toggle-option");
      options.forEach(option => {
        option.addEventListener("click", () => {
          const value = option.getAttribute("data-value");
          pill.setAttribute("data-value", value);

          options.forEach(o => o.classList.remove("is-active"));
          option.classList.add("is-active");

          const input = option.querySelector("input");
          if (input) {
            input.checked = true;
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

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Envoi en cours…", "");

    const formData = new FormData(form);
    const payload = {
      nom: formData.get("NomComplet") || "",
      courriel: formData.get("Courriel") || "",
      commission: formData.get("CommissionScolaire") || "",
      clientNST: formData.get("DejaClientNST") || "",
      clientRoboPack: formData.get("DejaClientRoboPack") || "",
      score: formData.get("ScoreObtenu") ? Number(formData.get("ScoreObtenu")) : null,
      SourceFormulaire: formData.get("SourceFormulaire") || "Kiosque Arcade"
    };

    if (!webhookUrl || webhookUrl === "VOTRE_URL_WEBHOOK_POWER_AUTOMATE") {
      setStatus("Webhook Power Automate non configuré. Merci de définir l’URL dans script.js.", "error");
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Code HTTP " + response.status);
      }

      setStatus("Merci ! Votre participation a été envoyée avec succès.", "success");
      showSuccessToast();
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("Une erreur est survenue lors de l’envoi. Merci de réessayer ou d’aviser l’équipe NST.", "error");
    }
  });
})();

