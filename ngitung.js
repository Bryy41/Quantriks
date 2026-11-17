function ambil(id) {
  return Number(document.getElementById(id).value);
}

function tambah() {
  var a = ambil("a");
  var b = ambil("b");
  var c = ambil("c");
  var d = ambil("d");
  var e = ambil("e");
  var f = ambil("f");
  var g = ambil("g");
  var h = ambil("h");

  var p = a + e;
  var q = b + f;
  var r = c + g;
  var s = d + h;

  tampilkan("A + B =", p, q, r, s);
}

document.getElementById("tombol-tambah").addEventListener("click", tambah);

function kurang() {
  var a = ambil("a");
  var b = ambil("b");
  var c = ambil("c");
  var d = ambil("d");
  var e = ambil("e");
  var f = ambil("f");
  var g = ambil("g");
  var h = ambil("h");

  var p = a - e;
  var q = b - f;
  var r = c - g;
  var s = d - h;

  tampilkan("A - B =", p, q, r, s);
}

document.getElementById("tombol-kurang").addEventListener("click", kurang);

function kali() {
  var a = ambil("a");
  var b = ambil("b");
  var c = ambil("c");
  var d = ambil("d");
  var e = ambil("e");
  var f = ambil("f");
  var g = ambil("g");
  var h = ambil("h");

  var p = a * e + b * g;
  var q = a * f + b * h;
  var r = c * e + d * g;
  var s = c * f + d * h;

  tampilkan("A x B =", p, q, r, s);
}

document.getElementById("tombol-kali").addEventListener("click", kali);

function kosongkan() {
  var semuaId = ["a", "b", "c", "d", "e", "f", "g", "h"];

  semuaId.forEach(function (id) {
    document.getElementById(id).value = "";
  });

  var kotakHasil = ["r1", "r2", "r3", "r4"];
  kotakHasil.forEach(function (id) {
    document.getElementById(id).textContent = "";

    document.getElementById("hasil").textContent =
      "Isi matriksnya dan pilih operasinya";
  });
}

document.getElementById("tombol-hapus").addEventListener("click", kosongkan);

function tampilkan(label, p, q, r, s) {
  document.getElementById("hasil").textContent = label;

  document.getElementById("r1").textContent = p;
  document.getElementById("r2").textContent = q;
  document.getElementById("r3").textContent = r;
  document.getElementById("r4").textContent = s;
}
