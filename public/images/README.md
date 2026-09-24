# Folder Penyimpanan Gambar Statis MI RPI Jakarta

Anda dapat menempatkan file gambar Anda di folder ini:

- `public/images/banner/` -> Gambar hero banner utama & slider
- `public/images/guru/`   -> Foto kepala madrasah dan asatidz/guru
- `public/images/galeri/` -> Foto dokumentasi kegiatan madrasah
- `public/images/berita/` -> Gambar thumbnail berita & artikel
- `public/images/logo/`   -> Logo madrasah atau yayasan

### Cara Penggunaan di Kode:
File yang diletakkan di `public/images/nama-foto.jpg` dapat langsung diakses di dalam kode React/TypeScript dengan path:
```ts
photoUrl: '/images/nama-foto.jpg'
```
atau
```html
<img src="/images/nama-foto.jpg" alt="Deskripsi Foto" />
```
