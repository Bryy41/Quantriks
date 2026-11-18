// belajar.js — khusus halaman penjelasan.html
// Semua matriks disimpan sebagai array 4 angka:
// [kiri-atas, kanan-atas, kiri-bawah, kanan-bawah]

var NAMA_KOTAK = ["kiri-atas", "kanan-atas", "kiri-bawah", "kanan-bawah"];
var LAMBANG = { tambah: "+", kurang: "−", kali: "×" };
var NAMA_OP = {
  tambah: "Penjumlahan",
  kurang: "Pengurangan",
  kali: "Perkalian",
};

// 1) Hitung isi matriks hasil
function hitung(op, A, B) {
  if (op === "kali") {
    return [
      A[0] * B[0] + A[1] * B[2],
      A[0] * B[1] + A[1] * B[3],
      A[2] * B[0] + A[3] * B[2],
      A[2] * B[1] + A[3] * B[3],
    ];
  }
  var tanda = op === "kurang" ? -1 : 1;
  return A.map(function (angka, i) {
    return angka + tanda * B[i];
  });
}

// 2) Kotak mana di A dan B yang dipakai untuk kotak hasil nomor i?
function sumber(op, i) {
  var baris = Math.floor(i / 2);
  var kolom = i % 2;
  if (op === "kali") {
    return { a: [baris * 2, baris * 2 + 1], b: [kolom, kolom + 2] };
  }
  return { a: [i], b: [i] };
}

// angka negatif diberi kurung supaya rumus tidak membingungkan: 3 − (-2)
function kurung(n) {
  return n < 0 ? "(" + n + ")" : String(n);
}

// 3) Tulisan rumus untuk kotak hasil nomor i
function tulisRumus(op, A, B, C, i) {
  var s = sumber(op, i);
  var isi;
  if (op === "kali") {
    isi =
      kurung(A[s.a[0]]) +
      " × " +
      kurung(B[s.b[0]]) +
      " + " +
      kurung(A[s.a[1]]) +
      " × " +
      kurung(B[s.b[1]]) +
      " = " +
      C[i];
  } else {
    isi = kurung(A[i]) + " " + LAMBANG[op] + " " + kurung(B[i]) + " = " + C[i];
  }
  return "Kotak " + NAMA_KOTAK[i] + ": " + isi;
}

// hanya izinkan angka dan tanda minus di awal
function bersihkan(kotak) {
  var bersih = kotak.value.replace(/[^0-9-]/g, "").replace(/(?!^)-/g, "");
  if (bersih !== kotak.value) kotak.value = bersih;
}

// 4) Satu matriks lengkap. jenis: "teks" | "tombol" | "isian"
function buatMatriks(kode, label, angka, jenis) {
  var isi = angka
    .map(function (n, i) {
      var data = ' data-m="' + kode + '" data-i="' + i + '"';
      if (jenis === "isian") {
        return (
          '<input class="sel" type="text" inputmode="numeric" maxlength="2" value="' +
          n +
          '"' +
          data +
          ' aria-label="Matriks ' +
          label +
          " kotak " +
          NAMA_KOTAK[i] +
          '">'
        );
      }
      var tag = jenis === "tombol" ? 'button type="button"' : "div";
      var tutup = jenis === "tombol" ? "button" : "div";
      return "<" + tag + ' class="sel"' + data + ">" + n + "</" + tutup + ">";
    })
    .join("");

  return (
    '<div class="item-matriks item-' +
    kode +
    '">' +
    '<div class="mini-grid warna-' +
    kode +
    '">' +
    isi +
    "</div>" +
    "<span>" +
    label +
    "</span>" +
    "</div>"
  );
}

// 5) Rakit satu demo interaktif
function siapkanDemo(el) {
  var op = el.dataset.op;
  var A = el.dataset.a.split(",").map(Number);
  var B = el.dataset.b.split(",").map(Number);
  var C = hitung(op, A, B);

  el.innerHTML =
    '<div class="contoh-matriks">' +
    buatMatriks("a", "A", A, "isian") +
    '<span class="operator">' +
    LAMBANG[op] +
    "</span>" +
    buatMatriks("b", "B", B, "isian") +
    '<span class="operator">=</span>' +
    buatMatriks("c", "Hasil", C, "tombol") +
    "</div>" +
    '<p class="rumus" aria-live="polite"></p>' +
    '<div class="aksi">' +
    '<button type="button" class="tombol langkah-btn" data-aksi="lanjut">Kotak berikutnya ▶</button>' +
    '<button type="button" class="tombol langkah-btn" data-aksi="acak">Acak angka</button>' +
    "</div>";

  var kotakA = el.querySelectorAll('[data-m="a"]');
  var kotakB = el.querySelectorAll('[data-m="b"]');
  var kotakHasil = el.querySelectorAll('[data-m="c"]');
  var teksRumus = el.querySelector(".rumus");
  var aktif = 0;

  function bacaAngka(daftar) {
    return Array.from(daftar).map(function (kotak) {
      var n = parseInt(kotak.value, 10);
      return isNaN(n) ? 0 : n;
    });
  }

  function nyalakan(i) {
    aktif = i;
    el.querySelectorAll(".nyala, .pilih").forEach(function (k) {
      k.classList.remove("nyala", "pilih");
    });
    var s = sumber(op, i);
    s.a.forEach(function (n) {
      el.querySelector('[data-m="a"][data-i="' + n + '"]').classList.add(
        "nyala",
      );
    });
    s.b.forEach(function (n) {
      el.querySelector('[data-m="b"][data-i="' + n + '"]').classList.add(
        "nyala",
      );
    });
    kotakHasil[i].classList.add("pilih");
    teksRumus.textContent = tulisRumus(op, A, B, C, i);
  }

  // baca ulang A dan B, hitung ulang, tampilkan
  function perbarui() {
    A = bacaAngka(kotakA);
    B = bacaAngka(kotakB);
    C = hitung(op, A, B);
    kotakHasil.forEach(function (kotak, i) {
      kotak.textContent = C[i];
    });
    nyalakan(aktif);
  }

  // setiap kali pengguna mengetik di kotak A atau B
  el.querySelectorAll("input[data-m]").forEach(function (kotak) {
    kotak.addEventListener("input", function () {
      bersihkan(kotak);
      perbarui();
    });
  });

  // hover (mouse), focus (keyboard), click (layar sentuh)
  kotakHasil.forEach(function (kotak, i) {
    ["mouseenter", "focus", "click"].forEach(function (jenis) {
      kotak.addEventListener(jenis, function () {
        nyalakan(i);
      });
    });
  });

  el.querySelector('[data-aksi="lanjut"]').addEventListener(
    "click",
    function () {
      nyalakan((aktif + 1) % 4);
    },
  );

  el.querySelector('[data-aksi="acak"]').addEventListener("click", function () {
    el.querySelectorAll("input[data-m]").forEach(function (kotak) {
      kotak.value = Math.floor(Math.random() * 10);
    });
    perbarui();
  });

  nyalakan(0);
}

// 6) Latihan soal acak
function siapkanLatihan(wadah) {
  var op, A, B, C;

  function acakMatriks() {
    return [1, 2, 3, 4].map(function () {
      return Math.floor(Math.random() * 9) + 1; // 1 sampai 9
    });
  }

  function periksa() {
    var kotakIsian = wadah.querySelectorAll(".jawab");
    var umpan = wadah.querySelector(".rumus");
    var benar = 0;
    var perbaikan = [];

    kotakIsian.forEach(function (kotak, i) {
      var teks = kotak.value.trim();
      var cocok = teks !== "" && Number(teks) === C[i];
      kotak.classList.toggle("benar", cocok);
      kotak.classList.toggle("salah", !cocok);
      if (cocok) {
        benar++;
        kotak.removeAttribute("aria-invalid");
      } else {
        kotak.setAttribute("aria-invalid", "true");
        perbaikan.push(tulisRumus(op, A, B, C, i));
      }
    });

    if (benar === 4) {
      umpan.textContent = "Benar semua! Tekan Soal baru untuk lanjut.";
    } else {
      umpan.innerHTML =
        benar +
        " dari 4 kotak benar. Cara mengerjakan yang salah:<br>" +
        perbaikan.join("<br>");
    }
  }

  function soalBaru() {
    op = ["tambah", "kurang", "kali"][Math.floor(Math.random() * 3)];
    A = acakMatriks();
    B = acakMatriks();
    C = hitung(op, A, B);

    var kotakJawab = "";
    for (var i = 0; i < 4; i++) {
      kotakJawab +=
        '<input class="sel jawab" type="text" inputmode="numeric" maxlength="4" data-i="' +
        i +
        '" aria-label="Jawaban kotak ' +
        NAMA_KOTAK[i] +
        '">';
    }

    wadah.innerHTML =
      '<p class="soal-judul">' +
      NAMA_OP[op] +
      "</p>" +
      '<div class="contoh-matriks">' +
      buatMatriks("a", "A", A, "teks") +
      '<span class="operator">' +
      LAMBANG[op] +
      "</span>" +
      buatMatriks("b", "B", B, "teks") +
      '<span class="operator">=</span>' +
      '<div class="item-matriks item-c"><div class="mini-grid warna-c">' +
      kotakJawab +
      "</div><span>Jawabanmu</span></div>" +
      "</div>" +
      '<p class="rumus" aria-live="polite">Isi keempat kotak, lalu tekan Periksa.</p>' +
      '<div class="aksi">' +
      '<button type="button" class="tombol langkah-btn" data-aksi="periksa">Periksa</button>' +
      '<button type="button" class="tombol langkah-btn" data-aksi="baru">Soal baru</button>' +
      "</div>";

    wadah.querySelectorAll(".jawab").forEach(function (kotak) {
      kotak.addEventListener("input", function () {
        bersihkan(kotak);
        kotak.classList.remove("benar", "salah");
        kotak.removeAttribute("aria-invalid");
      });
      kotak.addEventListener("keydown", function (e) {
        if (e.key === "Enter") periksa();
      });
    });
    wadah
      .querySelector('[data-aksi="periksa"]')
      .addEventListener("click", periksa);
    wadah
      .querySelector('[data-aksi="baru"]')
      .addEventListener("click", soalBaru);
  }

  soalBaru();
}

document.querySelectorAll(".demo").forEach(siapkanDemo);
var wadahLatihan = document.getElementById("latihan");
if (wadahLatihan) siapkanLatihan(wadahLatihan);

// 7) Tab operasi
var semuaTab = Array.from(document.querySelectorAll(".tab"));

function pilihTab(tab) {
  semuaTab.forEach(function (t) {
    var aktif = t === tab;
    t.setAttribute("aria-selected", aktif ? "true" : "false");
    t.tabIndex = aktif ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !aktif;
  });
}

semuaTab.forEach(function (tab, i) {
  tab.addEventListener("click", function () {
    pilihTab(tab);
  });
  // panah kiri/kanan untuk pengguna keyboard
  tab.addEventListener("keydown", function (e) {
    var arah = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!arah) return;
    var tujuan = semuaTab[(i + arah + semuaTab.length) % semuaTab.length];
    pilihTab(tujuan);
    tujuan.focus();
  });
});
