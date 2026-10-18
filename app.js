// impor express
const express = require("express");
const app = express();

// middleware agar body JSON bisa dibaca lewat req.body
app.use(express.json());

// ===== DATA (array di memori, tanpa database) =====
// Resource: podcasts (Topik 37 - Platform Audio)
let podcasts = [
  { id: 1, judul: "Ngobrol Koding", host: "Dimas Aditya", kategori: "pendidikan", jumlahEpisode: 48, bahasa: "Indonesia" },
  { id: 2, judul: "Cerita Startup", host: "Rani Anggraini", kategori: "bisnis", jumlahEpisode: 30, bahasa: "Indonesia" },
  { id: 3, judul: "Tech Talk Weekly", host: "John Carter", kategori: "teknologi", jumlahEpisode: 112, bahasa: "Inggris" },
];
let nextId = 4; // id berikutnya, bertambah otomatis

// ===== FUNGSI BANTU =====
// Response error berformat { status, message, data }
function kirimError(res, kode, pesan) {
  return res.status(kode).json({ status: "error", message: pesan, data: null });
}

// Validasi body POST/PUT. Return pesan error, atau null jika valid
function validasi(body) {
  const { judul, host, kategori, jumlahEpisode, bahasa } = body || {};
  const kosong = (v) => v === undefined || v === null || (typeof v === "string" && v.trim() === "");

  // field wajib: judul, host, kategori
  if (kosong(judul)) return "Field judul wajib diisi";
  if (kosong(host)) return "Field host wajib diisi";
  if (kosong(kategori)) return "Field kategori wajib diisi";
  if (typeof judul !== "string" || typeof host !== "string" || typeof kategori !== "string") {
    return "Field judul, host, dan kategori harus berupa string";
  }
  // field opsional: jika dikirim, tipenya harus benar
  if (!kosong(jumlahEpisode) && (typeof jumlahEpisode !== "number" || Number.isNaN(jumlahEpisode))) {
    return "Field jumlahEpisode harus berupa angka";
  }
  if (!kosong(bahasa) && typeof bahasa !== "string") {
    return "Field bahasa harus berupa string";
  }
  return null;
}

// ===== ROUTES =====

// GET /
// Info API: nama, NPM, nomor topik, daftar endpoint
app.get("/", (req, res) => {
  res.json({
    nama: "Adit Yudha Pratama",
    npm: "2428240163",
    topik: 37,
    deskripsi: "RESTful API Platform Audio - Podcast",
    endpoint: [
      "GET /podcasts",
      "GET /podcasts/:id",
      "GET /podcasts?kategori=pendidikan",
      "POST /podcasts",
      "PUT /podcasts/:id",
      "DELETE /podcasts/:id",
    ],
  });
});

// GET /podcasts
// GET /podcasts?kategori=pendidikan  (filter lewat req.query)
app.get("/podcasts", (req, res) => {
  const { kategori } = req.query;
  if (kategori) {
    // filter tidak membedakan huruf besar/kecil; hasil boleh array kosong []
    const hasil = podcasts.filter(
      (p) => p.kategori.toLowerCase() === String(kategori).toLowerCase()
    );
    return res.status(200).json(hasil);
  }
  res.status(200).json(podcasts);
});

// GET /podcasts/1
app.get("/podcasts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const podcast = podcasts.find((p) => p.id === id);
  if (!podcast) {
    return kirimError(res, 404, `Data dengan id ${req.params.id} tidak ditemukan`);
  }
  res.status(200).json(podcast);
});

// POST /podcasts
// Body: { "judul": "Ngobrol Koding", "host": "Dimas Aditya", "kategori": "pendidikan", "jumlahEpisode": 48, "bahasa": "Indonesia" }
app.post("/podcasts", (req, res) => {
  // validasi: field wajib kosong -> 400
  const pesan = validasi(req.body);
  if (pesan) return kirimError(res, 400, pesan);

  const { judul, host, kategori, jumlahEpisode, bahasa } = req.body;
  const baru = { id: nextId++, judul, host, kategori, jumlahEpisode, bahasa };
  podcasts.push(baru);

  // berhasil -> 201 + data yang baru dibuat
  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru,
  });
});

// PUT /podcasts/1
// Body: { "judul": "Ngobrol Koding", "host": "Dimas Aditya", "kategori": "pendidikan", "jumlahEpisode": 50, "bahasa": "Indonesia" }
app.put("/podcasts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = podcasts.findIndex((p) => p.id === id);
  if (index === -1) {
    return kirimError(res, 404, `Data dengan id ${req.params.id} tidak ditemukan`);
  }

  const pesan = validasi(req.body);
  if (pesan) return kirimError(res, 400, pesan);

  const { judul, host, kategori, jumlahEpisode, bahasa } = req.body;
  // penggantian penuh: semua field diganti, id tetap
  podcasts[index] = { id, judul, host, kategori, jumlahEpisode, bahasa };

  res.status(200).json({
    status: "success",
    message: "Data berhasil diubah",
    data: podcasts[index],
  });
});

// DELETE /podcasts/1
app.delete("/podcasts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = podcasts.findIndex((p) => p.id === id);
  if (index === -1) {
    return kirimError(res, 404, `Data dengan id ${req.params.id} tidak ditemukan`);
  }

  podcasts.splice(index, 1);
  res.status(200).json({
    status: "success",
    message: `Data podcast dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// ===== MIDDLEWARE AKHIR (harus setelah semua route) =====

// catch-all 404 untuk route yang tidak terdaftar
app.use((req, res) => {
  kirimError(res, 404, "Endpoint tidak ditemukan");
});

// error handler: JSON rusak dan error lain tetap dibalas JSON, bukan HTML
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return kirimError(res, 400, "Format JSON tidak valid");
  }
  kirimError(res, 500, "Terjadi kesalahan pada server");
});

// ===== JALANKAN SERVER =====
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
}
// diekspor agar bisa berjalan di Vercel (serverless)
module.exports = app;