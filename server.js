const express = require("express");
const redis = require("redis");
const app = express();
const port = 3000;

// Conectar a Redis
const client = redis.createClient({ url: "redis://localhost:6379" });
client.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
  await client.connect();
  console.log("Conectado a Redis");
})();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Lista de capítulos con rutas de imágenes ajustadas
const mandalorianEpisodes = [
  {
    id: 1,
    title: "Chapter 1: The Mandalorian",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap1.jpeg",
  },
  {
    id: 2,
    title: "Chapter 2: The Child",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap2.jpeg",
  },
  {
    id: 3,
    title: "Chapter 3: The Sin",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap3.jpeg",
  },
  {
    id: 4,
    title: "Chapter 4: Sanctuary",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap4.jpeg",
  },
  {
    id: 5,
    title: "Chapter 5: The Gunslinger",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap5.jpeg",
  },
  {
    id: 6,
    title: "Chapter 6: The Prisoner",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap6.jpeg",
  },
  {
    id: 7,
    title: "Chapter 7: The Reckoning",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap7.jpeg",
  },
  {
    id: 8,
    title: "Chapter 8: Redemption",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap8.jpeg",
  },
  {
    id: 9,
    title: "Chapter 9: The Marshal",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap9.jpeg",
  },
  {
    id: 10,
    title: "Chapter 10: The Passenger",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap10.jpeg",
  },
  {
    id: 11,
    title: "Chapter 11: The Heiress",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap11.jpeg",
  },
  {
    id: 12,
    title: "Chapter 12: The Siege",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap12.jpeg",
  },
  {
    id: 13,
    title: "Chapter 13: The Jedi",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap13.jpeg",
  },
  {
    id: 14,
    title: "Chapter 14: The Tragedy",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap14.jpeg",
  },
  {
    id: 15,
    title: "Chapter 15: The Believer",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap15.jpeg",
  },
  {
    id: 16,
    title: "Chapter 16: The Rescue",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap16.jpeg",
  },
  {
    id: 17,
    title: "Chapter 17: The Apostate",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap17.jpeg",
  },
  {
    id: 18,
    title: "Chapter 18: The Mines of Mandalore",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap18.jpeg",
  },
  {
    id: 19,
    title: "Chapter 19: The Convert",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap19.jpeg",
  },
  {
    id: 20,
    title: "Chapter 20: The Foundling",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap20.jpeg",
  },
  {
    id: 21,
    title: "Chapter 21: The Pirate",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap21.jpeg",
  },
  {
    id: 22,
    title: "Chapter 22: Guns for Hire",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap22.jpeg",
  },
  {
    id: 23,
    title: "Chapter 23: The Spies",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap23.jpeg",
  },
  {
    id: 24,
    title: "Chapter 24: The Return",
    status: "disponible",
    reservedUntil: null,
    rentedUntil: null,
    image: "/images/cap24.jpeg",
  },
];

// Inicializar capítulos en Redis (forzar carga para pruebas)
async function initializeEpisodes() {
  await client.set("episodes", JSON.stringify(mandalorianEpisodes));
  console.log("Capítulos de The Mandalorian cargados en Redis con imágenes");
}

// Ruta para listar capítulos
app.get("/api/episodes", async (req, res) => {
  const currentTime = Date.now();
  let episodes = JSON.parse(await client.get("episodes"));

  episodes = episodes.map((episode) => {
    if (
      episode.status === "reservado" &&
      episode.reservedUntil &&
      episode.reservedUntil < currentTime
    ) {
      episode.status = "disponible";
      episode.reservedUntil = null;
    }
    return episode;
  });

  await client.set("episodes", JSON.stringify(episodes));
  res.json(episodes);
});

// Nueva ruta para obtener un episodio específico por ID
app.get("/api/episodes/:id", async (req, res) => {
  const episodeId = parseInt(req.params.id);
  const episodes = JSON.parse(await client.get("episodes"));
  const episode = episodes.find((ep) => ep.id === episodeId);

  if (!episode) {
    return res.status(404).json({ error: "Capítulo no encontrado" });
  }

  res.json(episode);
});

// Ruta para reservar un capítulo
app.post("/api/reserve/:id", async (req, res) => {
  const episodeId = parseInt(req.params.id);
  let episodes = JSON.parse(await client.get("episodes"));
  const episode = episodes.find((ep) => ep.id === episodeId);

  if (!episode)
    return res.status(404).json({ error: "Capítulo no encontrado" });
  if (episode.status !== "disponible")
    return res.status(400).json({ error: "Capítulo no disponible" });

  episode.status = "reservado";
  episode.reservedUntil = Date.now() + 4 * 60 * 1000;
  await client.set("episodes", JSON.stringify(episodes));
  res.json({ message: `Capítulo ${episodeId} reservado por 4 minutos` });
});

// Ruta para confirmar el pago
app.post("/api/confirm/:id", async (req, res) => {
  const episodeId = parseInt(req.params.id);
  const { price } = req.body;
  let episodes = JSON.parse(await client.get("episodes"));
  const episode = episodes.find((ep) => ep.id === episodeId);

  if (!episode)
    return res.status(404).json({ error: "Capítulo no encontrado" });
  if (episode.status !== "reservado")
    return res.status(400).json({ error: "El capítulo no está reservado" });
  if (!price || price <= 0)
    return res.status(400).json({ error: "Precio inválido" });

  episode.status = "alquilado";
  episode.reservedUntil = null;
  episode.rentedUntil = Date.now() + 24 * 60 * 60 * 1000;
  await client.set("episodes", JSON.stringify(episodes));
  res.json({
    message: `Pago confirmado para el capítulo ${episodeId}. Alquilado por 24 horas.`,
  });
});

// Iniciar servidor y cargar episodios
app.listen(port, async () => {
  await initializeEpisodes();
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
