const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca request body dalam format JSON
app.use(express.json());

// Data podcast disimpan sementara di memory
let podcasts = [
  {
    id: 1,
    judul: "Ngobrol Koding",
    host: "Dimas Aditya",
    kategori: "pendidikan",
    jumlahEpisode: 48,
    bahasa: "Indonesia"
  },
  {
    id: 2,
    judul: "Cerita Teknologi",
    host: "Raka Pratama",
    kategori: "teknologi",
    jumlahEpisode: 32,
    bahasa: "Indonesia"
  },
  {
    id: 3,
    judul: "Belajar Bareng",
    host: "Sinta Maharani",
    kategori: "pendidikan",
    jumlahEpisode: 25,
    bahasa: "Indonesia"
  }
];

let nextId = 4;

// Endpoint utama
app.get("/", (req, res) => {
  res.json({
    nama: "Adit Yudha Pratama",
    npm: "2428240163",
    topik: 37,
    resource: "/podcasts",
    endpoints: {
      getAll: "GET /podcasts",
      getById: "GET /podcasts/:id",
      create: "POST /podcasts",
      update: "PUT /podcasts/:id",
      delete: "DELETE /podcasts/:id",
      filter: "GET /podcasts?kategori=pendidikan"
    }
  });
});

// Menjalankan server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;

// GET /podcasts
// Menampilkan seluruh data podcast
// Bisa menggunakan filter kategori
app.get("/podcasts", (req, res) => {
  const { kategori } = req.query;

  if (kategori) {
    const hasil = podcasts.filter(
      (podcast) => podcast.kategori.toLowerCase() === kategori.toLowerCase()
    );

    return res.status(200).json(hasil);
  }

  res.status(200).json(podcasts);
});

// GET /podcasts/:id
// Menampilkan satu podcast berdasarkan ID
app.get("/podcasts/:id", (req, res) => {
  const id = Number(req.params.id);

  const podcast = podcasts.find((item) => item.id === id);

  if (!podcast) {
    return res.status(404).json({
      status: "error",
      message: "Data podcast tidak ditemukan",
      data: null
    });
  }

  res.status(200).json(podcast);
});