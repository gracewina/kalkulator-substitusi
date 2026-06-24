// Fungsi untuk memasukkan simbol ke dalam kolom input otomatis
function insertSymbol(symbol) {
    const input = document.getElementById('input-soal');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + symbol + text.substring(end);
    input.focus();
    input.setSelectionRange(start + symbol.length, start + symbol.length);
}

function prosesIntegralLanjutan() {
    let soalRaw = document.getElementById('input-soal').value;
    
    // Bersihkan spasi berlebih dan karakter pengganggu untuk pemrosesan
    let soal = soalRaw.replace(/\s+/g, '');

    // Pola Regex untuk mendeteksi k(ax+b)^n atau (ax+b)^n dengan atau tanpa simbol integral/dx
    // Mendukung tanda positif dan negatif
    const pola = /(?:∫)?(-?\d*)\(?(-?\d*)x([+-]\d+)\)\^?(-?\d+)(?:dx)?/;
    const match = soal.match(pola);

    if (!match) {
        alert("Format soal tidak dikenali! Pastikan mengikuti pola tipe substitusi linear, contoh: ∫ (2x + 3)^5 dx atau ∫ 3(4x - 1)^2 dx");
        return;
    }

    // Ekstraksi konstanta dari hasil pencarian Regex
    let k = match[1] === "" || match[1] === "-" ? (match[1] === "-" ? -1 : 1) : parseFloat(match[1]);
    let a = match[2] === "" || match[2] === "-" ? (match[2] === "-" ? -1 : 1) : parseFloat(match[2]);
    let b = parseFloat(match[3]);
    let n = parseFloat(match[4]);

    if (n === -1) {
        alert("Untuk pangkat n = -1 hasil berupa ln. Fitur kalkulator ini difokuskan untuk n ≠ -1.");
        return;
    }

    const resultBox = document.getElementById('result-box');
    const langkahDiv = document.getElementById('langkah-langkah');
    const btnCopy = document.getElementById('btn-copy');

    const tandaB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const pangkatBaru = n + 1;
    const pengaliLuar = k !== 1 ? `${k} \\cdot ` : '';
    
    // Perhitungan pecahan koefisien akhir
    const penyebutAtas = k;
    const penyebutBawah = a * pangkatBaru;
    
    let htmlLangkah = `
        <p><strong>Soal yang terdeteksi:</strong></p>
        <p>$$\\int ${k !== 1 ? k : ''}(${a}x ${tandaB})^{${n}} \\, dx$$</p>
        <hr>
        <p><strong>Langkah 1: Misalkan komponen di dalam kurung sebagai $u$</strong></p>
        <p>$$u = ${a}x ${tandaB}$$</p>
        
        <p><strong>Langkah 2: Cari turunan $u$ terhadap $x$ ($du/dx$)</strong></p>
        <p>$$\\frac{du}{dx} = ${a} \\implies dx = \\frac{du}{${a}}$$</p>
        
        <p><strong>Langkah 3: Substitusikan nilai $u$ dan $dx$ ke dalam soal awal</strong></p>
        <p>$$\\int ${k !== 1 ? k : ''} u^{${n}} \\cdot \\frac{du}{${a}} = \\frac{${k}}{${a}} \\int u^{${n}} \\, du$$</p>
        
        <p><strong>Langkah 4: Integralkan nilai $u$ menggunakan aturan pangkat</strong></p>
        <p>$$\\frac{${k}}{${a}} \\cdot \\left( \\frac{1}{${n} + 1} u^{${n} + 1} \\right) + C$$</p>
        <p>$$\\frac{${k}}{${a}} \\cdot \\frac{1}{${pangkatBaru}} u^{${pangkatBaru}} + C = \\frac{${penyebutAtas}}{${penyebutBawah}} u^{${pangkatBaru}} + C$$</p>
        
        <p><strong>Langkah 5: Kembalikan variabel $u$ menjadi fungsi $x$ semula</strong></p>
        <p>$$\\text{Hasil Akhir} = \\frac{${penyebutAtas}}{${penyebutBawah}} (${a}x ${tandaB})^{${pangkatBaru}} + C$$</p>
    `;

    langkahDiv.innerHTML = htmlLangkah;
    resultBox.style.display = 'block';
    btnCopy.style.display = 'block';

    // Merender ulang teks LaTeX memakai MathJax agar tampil rapi di browser
    MathJax.typesetPromise();
}

function salinTeks() {
    const zonatemu = document.getElementById('langkah-langkah').innerText;
    navigator.clipboard.writeText(zonatemu).then(() => {
        alert("Langkah penyelesaian berhasil disalin!");
    }).catch(err => {
        alert("Gagal menyalin teks: ", err);
    });
}