// ===================================================================
//              URL ANDA SUDAH SAYA MASUKKAN DI SINI
// ===================================================================

const scriptURL = 'https://script.google.com/macros/s/AKfycbyT3sLxmS8_1S8P5mz-P37bxjgfAuGCJJ950X9pe-0QWWAuZVLfscb1_Y5N_x7are8RNA/exec';

// ===================================================================
//          DATA ANGGOTA (Sudah diisi sesuai data Anda)
// ===================================================================

const dataAnggota = {
    "Anisatul": ["Anisatul1.jpg", "Anisatul2.jpg"],
    "Dimas": ["Dimas1.jpg", "Dimas2.jpg", "Dimas3.jpg"],
    "Elhes": ["Elhes1.jpg", "Elhes2.jpg"],
    "Elsa": ["Elsa1.jpg", "Elsa2.jpg", "Elsa3.jpg"],
    "Fenny": ["Fenny1.jpg", "Fenny2.jpg"],
    "Haliza": ["Haliza1.jpg", "Haliza2.jpg", "Haliza3.jpg", "Haliza4.jpg"],
    "Hany": ["Hany1.jpg", "Hany2.jpg", "Hany3.jpg"],
    "Herdy": ["Herdy1.jpg", "Herdy2.jpg"],
    "Iid": ["iid1.jpg", "iid2.jpg"],
    "Ikhsan": ["Ikhsan1.jpg", "Ikhsan2.jpg"],
    "Intan": ["intan1.jpg", "Intan2.jpg", "Intan3.jpg"],
    "Muji": ["Muji1.jpg", "Muji2.jpg"],
    "Muthia": ["Muthia1.jpg", "Muthia2.jpg"],
    "Putri": ["Putri1.jpg", "Putri2.jpg"],
    "Risma": ["Risma1.jpg", "Risma2.jpg"],
    "Salam": ["Salam1.jpg", "Salam2.jpg"]
};

// ===================================================================
//             BAGIAN LOGIKA WEB (TIDAK PERLU DIEDIT)
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    const halamanNama = document.getElementById('halaman-nama');
    const halamanFoto = document.getElementById('halaman-foto');
    const halamanTerimaKasih = document.getElementById('halaman-terima-kasih');
    
    const daftarNamaContainer = document.querySelector('.daftar-nama');
    const galeriPilihan = document.getElementById('galeri-pilihan');
    const namaTerpilihSpan = document.getElementById('nama-terpilih');
    
    const form = document.forms['submit-to-google-sheet'];
    const inputNama = document.getElementById('form-nama');
    const inputPilihanFoto = document.getElementById('form-pilihan-foto');
    const tombolKirim = document.getElementById('tombol-kirim');

    // 1. Buat tombol untuk setiap nama
    for (const nama in dataAnggota) {
        if (Object.hasOwnProperty.call(dataAnggota, nama)) {
            const button = document.createElement('button');
            button.textContent = nama;
            button.dataset.nama = nama;
            daftarNamaContainer.appendChild(button);
        }
    }

    // 2. Event listener untuk tombol nama
    daftarNamaContainer.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const nama = e.target.dataset.nama;
            tampilkanHalamanFoto(nama);
        }
    });

    // 3. Fungsi untuk menampilkan halaman foto
    function tampilkanHalamanFoto(nama) {
        // Reset galeri
        galeriPilihan.innerHTML = '';
        inputPilihanFoto.value = '';
        tombolKirim.disabled = true;

        // Tampilkan nama & isi foto
        namaTerpilihSpan.textContent = `Memilih untuk: ${nama}`;
        inputNama.value = nama;
        const fotoList = dataAnggota[nama];

        fotoList.forEach(fileFoto => {
            const item = document.createElement('div');
            item.className = 'item-foto';
            item.dataset.filename = fileFoto;
            item.innerHTML = `<img src="images/${fileFoto}" alt="Pilihan foto untuk ${nama}">`;
            galeriPilihan.appendChild(item);
        });

        // Pindah halaman
        halamanNama.classList.add('hidden');
        halamanFoto.classList.remove('hidden');
    }

    // 4. Event listener untuk memilih foto
    galeriPilihan.addEventListener('click', function(e) {
        const targetItem = e.target.closest('.item-foto');
        if (!targetItem) return;

        // Hapus selection dari yang lain
        const selectedItems = galeriPilihan.querySelectorAll('.item-foto.selected');
        selectedItems.forEach(el => el.classList.remove('selected'));
        
        // Tambah selection ke yang diklik
        targetItem.classList.add('selected');
        
        // Simpan pilihan
        inputPilihanFoto.value = targetItem.dataset.filename;
        tombolKirim.disabled = false;
    });

    // 5. Event listener untuk tombol kembali
    document.getElementById('tombol-kembali').addEventListener('click', function() {
        halamanFoto.classList.add('hidden');
        halamanNama.classList.remove('hidden');
    });

    // 6. Event listener untuk submit form
    form.addEventListener('submit', e => {
        e.preventDefault();
        tombolKirim.disabled = true;
        tombolKirim.textContent = 'Mengirim...';

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                console.log('Success!', response);
                halamanFoto.classList.add('hidden');
                halamanTerimaKasih.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Gagal mengirim data. Coba lagi atau hubungi panitia.");
                tombolKirim.disabled = false;
                tombolKirim.textContent = 'Kirim Pilihanku';
            });
    });

    // 7. Event listener untuk tombol selesai
    document.getElementById('tombol-selesai').addEventListener('click', function() {
        // Reset dan kembali ke halaman awal
        tombolKirim.textContent = 'Kirim Pilihanku';
        halamanTerimaKasih.classList.add('hidden');
        halamanNama.classList.remove('hidden');

        // Bonus: Sembunyikan tombol nama yang sudah memilih agar tidak bisa diisi dua kali
        const namaYangSudahPilih = inputNama.value;
        const tombolNama = daftarNamaContainer.querySelector(`button[data-nama="${namaYangSudahPilih}"]`);
        if(tombolNama) tombolNama.style.display = 'none';
    });
});