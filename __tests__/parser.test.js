// Jalankan:  npx vitest
import { describe, it, expect } from 'vitest';
import { parseBlock } from '../pages/api/student.js';

const sample = `NIM: 123\nNAMA: Test Student\nGRADE: B\nTUGAS_TEORI: 90,80\nTUGAS_PRAKTIKUM: 85,80,75,70\nKUIS_TEORI: 88\nUTS_PRAK: 77\nPORTOFOLIO: 90,90,90,90\nPROJECT: topik=88;syntax=90;visualisasi=85;laporan=18;video=80;nilai=88;saran=Keep it up;tim=2`;

describe('parseBlock', () => {
  it('returns expected keys', () => {
    const obj = parseBlock(sample);
    expect(obj).toHaveProperty('nim', '123');
    expect(obj).toHaveProperty('nama', 'Test Student');
    expect(obj.grade).toBe('B');
    expect(obj.teori.length).toBe(2);
    expect(obj.praktikum.length).toBe(4);
    expect(obj.project.tim).toBe(2);
  });
});
