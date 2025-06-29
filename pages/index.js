import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Peta gambar grade: simpan file di public/grades dengan ekstensi .png atau .jpeg
const gradeImages = {
  A: '/grades/A.png',
  'A-': '/grades/A-.png',
  'B+': '/grades/B+.png',
  B: '/grades/B.png',
  'B-': '/grades/B-.png',
  'C+': '/grades/C+.png',
  C: '/grades/C.png',
  'C-': '/grades/C-.png',
  D: '/grades/D.png',
  E: '/grades/E.png'
};

export default function Home() {
  const [nim, setNim] = useState('');
  const [stu, setStu] = useState(null);
  const [err, setErr] = useState('');

  // Hitung rata-rata
  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : '0.00';

  // Fetch data mahasiswa
  const fetchStudent = async () => {
    setErr('');
    setStu(null);
    if (!nim) return;
    try {
      const res = await fetch(`/api/student?nim=${nim}`);
      if (!res.ok) throw new Error('Data tidak ditemukan');
      setStu(await res.json());
    } catch (e) {
      setErr(e.message);
    }
  };

  // Data chart
  const chartData = stu
    ? [
        { name: 'Teori', value: parseFloat(avg(stu.teori)) },
        { name: 'Praktikum', value: parseFloat(avg(stu.praktikum)) },
        {
          name: 'Portofolio',
          value: parseFloat(
            avg([
              stu.portofolio[0],
              stu.portofolio[1],
              stu.portofolio[3],
              stu.portofolio[4]
            ])
          )
        },
        { name: 'UTS Praktikum', value: parseFloat(stu.utsPrak) },
        { name: 'Responsi', value: parseFloat(stu.responsiPraktikum) },
        { name: 'Kuis', value: parseFloat(stu.kuisTeori) },
        { name: 'Proyek', value: parseFloat(stu.project.nilai) }
      ]
    : [];

  const filteredPortfolio = stu
    ? [0, 1, 3, 4].map(i => stu.portofolio[i] || 0)
    : [];
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#d0ed57', '#a4de6c', '#d0a4ed'];

  return (
    <>
      <Head>
        <title>Checker Nilai Fisika Komputasi</title>
        <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div className="relative min-h-screen p-8 text-white">
        {/* Background dan overlay gradient */}
        <div
          className="absolute inset-0 bg-[url('/images/bg.jpg')] bg-cover bg-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-pink-700 opacity-60" />

        <div className="relative max-w-4xl mx-auto">
          {/* Judul */}
          <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-center">
            Checker Nilai Fisika Komputasi
          </h1>

          {/* Input NIM dan tombol */}
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              placeholder="Masukkan NIM"
              value={nim}
              onChange={e => setNim(e.target.value)}
              className="flex-1 px-6 py-3 bg-gray-700 placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={fetchStudent}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full font-semibold shadow-lg hover:opacity-90"
            >
              Cari
            </button>
          </div>

          {/* Error message */}
          {err && <p className="text-red-400 mb-6">{err}</p>}

          {/* Konten mahasiswa */}
          {stu && (
            <>
              {/* Navigasi */}
              <div className="flex justify-center gap-4 mb-6">
                <a
                  href="https://github.com/maheswari352427"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub Ferdi
                </a>
                <a
                  href="https://x.com/vhaeyrin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  My X
                </a>
                <a
                  href="https://github.com/dkfadhila"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub DK
                </a>
              </div>

              {/* Catatan Penilaian */}
              <div className="mb-6 p-4 bg-yellow-800 rounded-lg border-l-4 border-yellow-400">
                <strong>Catatan Penilaian:</strong> Semua nilai Praktikum maksimum 95; nilai 0 karena ketahuan melakukan plagiasi tugas (screenshot/memfoto pekerjaan mahasiswa lain terus timpa nama, tanpa menggunakan workspace sendiri), tidak mengumpulkan atau file tidak ditemukan atau mengumpulkan tugas berbeda.
              </div>

              {/* Profil Mahasiswa */}
              <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl shadow-xl text-center mb-8">
                <img
                  src={gradeImages[stu.grade] || gradeImages.E}
                  alt={`Grade ${stu.grade}`}
                  className="mx-auto w-32 h-32 rounded-full border-4 border-white"
                />
                <h2 className="mt-4 text-2xl font-bold">{stu.nama}</h2>
                <p className="mt-1">NIM: {stu.nim}</p>
                <p className="mt-1">Tim: {stu.project.tim}</p>
                <p className="mt-1">Kelas: {stu.kelas || '-'}</p>
                <p className="mt-1">Grade: {stu.grade}</p>
                <p className="mt-1">Rank: {stu.rank}</p>
              </div>

              {/* Pie Chart */}
              <div className="flex justify-center mb-8">
                <PieChart width={400} height={400}>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                    {chartData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </div>

              {/* Ringkasan Nilai */}
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-8">
                {chartData.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-xl text-center"
                  >
                    <p className="text-4xl font-extrabold">{item.value.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-gray-400">{item.name}</p>
                  </div>
                ))}
              </div>

              {/* Detail Tugas */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {/* Tugas Teori */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-xl">
                  <h3 className="font-semibold mb-2">Tugas Teori 1–8</h3>
                  <ul className="list-decimal list-inside space-y-1">
                    {stu.teori.map((v, i) => (
                      <li key={i}>{`Tugas ${i + 1}: ${v}`}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-semibold">Rata-rata: {avg(stu.teori)}</p>
                </div>

                {/* Tugas Praktikum */}
                <div className="p-6 bg-gradient-to-r from-green-600 to-green-800 rounded-3xl shadow-xl">
                  <h3 className="font-semibold mb-2">Tugas Praktikum 1–3</h3>
                  <ul className="list-decimal list-inside space-y-1">
                    {stu.praktikum.slice(0, 3).map((v, i) => (
                      <li key={i}>{`Tugas ${i + 1}: ${v}`}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-semibold">Rata-rata: {avg(stu.praktikum)}</p>
                </div>

                {/* Responsi Praktikum */}
                <div className="p-6 bg-gradient-to-r from-lime-600 to-lime-800 rounded-3xl shadow-xl">
                  <h3 className="font-semibold mb-2">Responsi Praktikum</h3>
                  <p className="font-semibold">{stu.responsiPraktikum}</p>
                </div>

                {/* Kuis Teori */}
                <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl shadow-xl">
                  <h3 className="font-semibold mb-2">Kuis Teori</h3>
                  <p className="font-semibold">{stu.kuisTeori}</p>
                </div>

                {/* Portofolio */}
                <div className="p-6 bg-gradient-to-r from-pink-600 to-pink-800 rounded-3xl shadow-xl">
                  <h3 className="font-semibold mb-2">Portofolio BAB 1,2,4,5</h3>
                  <ul className="list-decimal list-inside space-y-1">
                    {filteredPortfolio.map((v, i) => (
                      <li key={i}>{`BAB ${[1, 2, 4, 5][i]}: ${v}`}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-semibold">Rata-rata: {avg(filteredPortfolio)}</p>
                </div>

                {/* UTS Praktikum */}
                <div className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-3xl shadow-xl col-span-full lg:col-auto">
                  <h3 className="font-semibold mb-2">UTS Praktikum</h3>
                  <p className="font-semibold">{stu.utsPrak}</p>
                </div>

                {/* Detail Proyek */}
                <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-700 rounded-3xl shadow-xl col-span-full">
                  <h3 className="font-semibold mb-2">Detail Proyek</h3>
                  <ul className="list-inside space-y-1">
                    <li>{`Topik: ${stu.project.topik}`}</li>
                    <li>{`Syntax: ${stu.project.syntax}`}</li>
                    <li>{`Visualisasi: ${stu.project.visualisasi}`}</li>
                    <li>{`Laporan: ${stu.project.laporan}`}</li>
                    <li>{`Video: ${stu.project.video}`}</li>
                    <li className="font-semibold">{`Nilai Proyek: ${stu.project.nilai}`}</li>
                  </ul>
                </div>
              </div>

              {/* Footer Asisten */}
              <footer className="mt-10 text-center text-gray-400">
                Asisten: Ferdi Nugraha Pratama &middot; Decka Fadhila Tirta
              </footer>
            </>
          )}
        </div>
      </div>
    </>
  );
}
