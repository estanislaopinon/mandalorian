document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el ID del capítulo desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const episodeId = urlParams.get("id");

  if (!episodeId) {
    alert("No se especificó un capítulo para pagar.");
    window.location.href = "/";
    return;
  }

  // Obtener el título del capítulo desde la API
  try {
    const response = await fetch(`/api/episodes/${episodeId}`);
    const episode = await response.json();
    document.getElementById("episode-title").textContent = episode.title;
  } catch (error) {
    console.error("Error al cargar el capítulo:", error);
    alert("Error al cargar el capítulo.");
    window.location.href = "/";
  }

  // Manejar el formulario de pago
  document
    .getElementById("payment-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = document.getElementById("amount").value;

      if (!amount || amount <= 0) {
        alert("Por favor, ingrese un monto válido.");
        return;
      }

      try {
        const response = await fetch(`/api/confirm/${episodeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: parseFloat(amount) }),
        });
        const result = await response.json();
        alert(result.message);
        window.location.href = "/"; // Redirigir a la página principal
      } catch (error) {
        console.error("Error al confirmar el pago:", error);
        alert("Error al confirmar el pago.");
      }
    });
});
