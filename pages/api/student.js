import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { nim } = req.query;
  try {
    const filePath = path.join(process.cwd(), 'data', 'students.txt');
    const raw = await fs.readFile(filePath, 'utf8');
    const blocks = raw
      .split('/*')
      .map(b => b.replace(/\*\//g, '').trim())
      .filter(b => b);
    const block = blocks.find(b => b.includes(`NIM: ${nim}`));
    if (!block) return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });

    const obj = {};
    block.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) return;
      const val = rest.join(':').trim();
      switch (key.trim()) {
        case 'NIM': obj.nim = val; break;
        case 'NAMA': obj.nama = val; break;
        case 'GRADE': obj.grade = val; break;
        case 'KELAS': obj.kelas = val; break;
        case 'RANK': obj.rank = val; break;
        case 'TUGAS_TEORI': obj.teori = val.split(',').map(Number); break;
        case 'TUGAS_PRAKTIKUM': obj.praktikum = val.split(',').map(Number); break;
        case 'RESPONSI_PRAKTIKUM': obj.responsiPraktikum = Number(val); break;
        case 'KUIS_TEORI': obj.kuisTeori = Number(val); break;
        case 'UTS_PRAK': obj.utsPrak = Number(val); break;
        case 'PORTOFOLIO': obj.portofolio = val.split(',').map(Number); break;
        case 'PROJECT': {
          const parts = val.split(';').filter(p => p.includes('='));
          const proj = {};
          parts.forEach(p => {
            const [k, v] = p.split('=');
            proj[k.trim()] = isNaN(v) ? v.trim() : Number(v);
          });
          obj.project = proj;
          break;
        }
      }
    });

    return res.status(200).json(obj);
  } catch (e) {
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}
