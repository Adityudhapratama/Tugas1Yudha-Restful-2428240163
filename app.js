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
// Memeriksa apakah nilai string kosong
const isEmpty = (value) => {
  return value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "");
};


// POST /podcasts
// Menambahkan data podcast baru
app.post("/podcasts", (req, res) => {
  const {
    judul,
    host,
    kategori,
    jumlahEpisode,
    bahasa
  } = req.body;

  // Validasi field wajib
  if (
    isEmpty(judul) ||
    isEmpty(host) ||
    isEmpty(kategori)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Field judul, host, dan kategori wajib diisi",
      data: null
    });
  }

  // Validasi tipe jumlahEpisode jika dikirim
  if (
    jumlahEpisode !== undefined &&
    (typeof jumlahEpisode !== "number" || jumlahEpisode < 0)
  ) {
    return res.status(400).json({
      status: "error",
      message: "jumlahEpisode harus berupa angka yang valid",
      data: null
    });
  }

  // Membuat data baru
  const podcastBaru = {
    id: nextId++,
    judul: judul.trim(),
    host: host.trim(),
    kategori: kategori.trim()
  };

  if (jumlahEpisode !== undefined) {
    podcastBaru.jumlahEpisode = jumlahEpisode;
  }

  if (bahasa !== undefined) {
    podcastBaru.bahasa = bahasa;
  }

  podcasts.push(podcastBaru);

  res.status(201).json({
    status: "success",
    message: "Podcast berhasil ditambahkan",
    data: podcastBaru
  });
});

// PUT /podcasts/:id
// Mengubah seluruh data podcast
app.put("/podcasts/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = podcasts.findIndex(
    (podcast) => podcast.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Data podcast tidak ditemukan",
      data: null
    });
  }

  const {
    judul,
    host,
    kategori,
    jumlahEpisode,
    bahasa
  } = req.body;

  // Validasi field wajib
  if (
    isEmpty(judul) ||
    isEmpty(host) ||
    isEmpty(kategori)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Field judul, host, dan kategori wajib diisi",
      data: null
    });
  }

  // Validasi jumlahEpisode jika dikirim
  if (
    jumlahEpisode !== undefined &&
    (typeof jumlahEpisode !== "number" || jumlahEpisode < 0)
  ) {
    return res.status(400).json({
      status: "error",
      message: "jumlahEpisode harus berupa angka yang valid",
      data: null
    });
  }

  // PUT mengganti data lama secara penuh
  const podcastDiubah = {
    id,
    judul: judul.trim(),
    host: host.trim(),
    kategori: kategori.trim()
  };

  if (jumlahEpisode !== undefined) {
    podcastDiubah.jumlahEpisode = jumlahEpisode;
  }

  if (bahasa !== undefined) {
    podcastDiubah.bahasa = bahasa;
  }

  podcasts[index] = podcastDiubah;

  res.status(200).json({
    status: "success",
    message: "Podcast berhasil diperbarui",
    data: podcastDiubah
  });
});

// PUT /podcasts/:id
// Mengubah seluruh data podcast
app.put("/podcasts/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = podcasts.findIndex(
    (podcast) => podcast.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Data podcast tidak ditemukan",
      data: null
    });
  }

  const {
    judul,
    host,
    kategori,
    jumlahEpisode,
    bahasa
  } = req.body;

  // Validasi field wajib
  if (
    isEmpty(judul) ||
    isEmpty(host) ||
    isEmpty(kategori)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Field judul, host, dan kategori wajib diisi",
      data: null
    });
  }

  // Validasi jumlahEpisode jika dikirim
  if (
    jumlahEpisode !== undefined &&
    (typeof jumlahEpisode !== "number" || jumlahEpisode < 0)
  ) {
    return res.status(400).json({
      status: "error",
      message: "jumlahEpisode harus berupa angka yang valid",
      data: null
    });
  }

  // PUT mengganti data lama secara penuh
  const podcastDiubah = {
    id,
    judul: judul.trim(),
    host: host.trim(),
    kategori: kategori.trim()
  };

  if (jumlahEpisode !== undefined) {
    podcastDiubah.jumlahEpisode = jumlahEpisode;
  }

  if (bahasa !== undefined) {
    podcastDiubah.bahasa = bahasa;
  }

  podcasts[index] = podcastDiubah;

  res.status(200).json({
    status: "success",
    message: "Podcast berhasil diperbarui",
    data: podcastDiubah
  });
});

// DELETE /podcasts/:id
// Menghapus data podcast berdasarkan ID
app.delete("/podcasts/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = podcasts.findIndex(
    (podcast) => podcast.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Data podcast tidak ditemukan",
      data: null
    });
  }

  const podcastDihapus = podcasts[index];

  podcasts.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: "Podcast berhasil dihapus",
    data: podcastDihapus
  });
});

// Catch-all untuk endpoint yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

// Error handler untuk JSON yang tidak valid
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "Format JSON tidak valid",
      data: null
    });
  }

  console.error(err);

  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
    data: null
  });
});

// Menjalankan server hanya saat bukan production
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;

