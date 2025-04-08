async function loadEpisodes() {
  const response = await fetch("/api/episodes");
  const episodes = await response.json();
  const episodeGrid = document.getElementById("episode-grid");

  episodeGrid.innerHTML = "";
  episodes.forEach((episode) => {
    const div = document.createElement("div");
    div.className = `episode ${episode.status}`;
    let buttons = "";

    if (episode.status === "disponible") {
      buttons = `<button class="reserve" onclick="reserveEpisode(${episode.id})">Reservar</button>`;
    } else if (episode.status === "reservado") {
      buttons = `<button class="pay" onclick="goToPayment(${episode.id})">Pagar</button>`;
    }

    div.innerHTML = `
      <img src="${episode.image}" alt="${episode.title}">
      <h3>${episode.title}</h3>
      <p>Estado: ${episode.status}</p>
      ${buttons}
    `;
    episodeGrid.appendChild(div);
  });
}

async function reserveEpisode(id) {
  const response = await fetch(`/api/reserve/${id}`, { method: "POST" });
  const result = await response.json();
  alert(result.message);
  loadEpisodes();
}

function goToPayment(id) {
  window.location.href = `/pay.html?id=${id}`; // Redirige a pay.html con el ID del capítulo
}

// Cargar episodios al iniciar
loadEpisodes();
// Actualizar cada 10 segundos
setInterval(loadEpisodes, 10000);
