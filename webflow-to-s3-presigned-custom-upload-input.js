document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector('[data-upload-trigger="upload-btn"]');
  const fileInput = document.getElementById("upload-resume");
  const form = document.querySelector("form");
  const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');

  let fileToUpload = null;
  let uploadedKey = "";
  let uploadedUrl = "";

  if (!trigger || !fileInput || !form || !submitButton) {
    console.error("Missing required elements");
    return;
  }

  form.setAttribute("action", "javascript:void(0)");
  form.setAttribute("novalidate", "true");

  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("Archivo demasiado grande. Máximo 25MB.");
      fileInput.value = "";
      return;
    }

    fileToUpload = file;
    trigger.innerText = "Archivo seleccionado ✔️";
    console.log("📁 File ready:", file.name, file.type);
  });

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!fileToUpload) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    submitButton.disabled = true;
    submitButton.value = "Por favor espere...";

    try {
      console.log("📡 Obteniendo URL firmada...");
      const presignRes = await fetch("https://fmafwossstvdymuvwmaa.supabase.co/functions/v1/presign-url-empleos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type,
        }),
      });

      const { url, key } = await presignRes.json();
      console.log("✅ URL recibida:", { url, key });

      console.log("⬆️ Subiendo archivo a S3...");
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": fileToUpload.type },
        body: fileToUpload,
      });

      if (!uploadRes.ok) throw new Error("Fallo al subir a S3");

      uploadedKey = key;
      uploadedUrl = url.split("?")[0];
      console.log("✅ Subido:", uploadedUrl);

      const formData = new FormData(form);
      formData.delete(fileInput.name); // remove raw file input
      formData.append("resume_key", uploadedKey);
      formData.append("resume_url", uploadedUrl);

      console.log("🚀 Enviando al webhook mediante redirección...");

      // 🔁 Build a real HTML form to submit and follow redirect
      const redirectForm = document.createElement("form");
      redirectForm.method = "POST";
      redirectForm.action = "https://n8n.melodev.com/webhook/pueblo-empleos";

      for (let [key, value] of formData.entries()) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        redirectForm.appendChild(input);
      }

      document.body.appendChild(redirectForm);
      redirectForm.submit(); // 🔀 Browser will follow redirect

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Hubo un error. Intenta de nuevo.");
      submitButton.disabled = false;
      submitButton.value = "Someter";
    }
  });
});
