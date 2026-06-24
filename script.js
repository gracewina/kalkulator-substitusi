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
    
    // Bersihkan semua spasi agar Regex bekerja akurat
    let soal = soalRaw.replace(/\s+/g, '');

    // Pola Regex untuk mendeteksi k(ax+b)^n atau (ax+b)^n
    const pola = /(?:∫)?(-?\d*)\(?(-?\d*)x([+-]\d+)\)\^?(-?\d+)(?:dx)?/;
    const match = soal.match(pola);

    if (!match) {
        alert("Format soal tidak dikenali! Contoh format: ∫ (2x + 3)^5 dx");
        return;
    }

    // Ekstraksi nilai variabel matematika
    let k = match[1] === "" || match[1] === "-" ? (match[1] === "-" ? -1 : 1) : parseFloat(match[1]);
    let a = match[2] === "" || match[2] === "-" ? (match[2] === "-" ? -1 : 1) : parseFloat(match[2]);
    let b = parseFloat(match[3]);
    let n = parseFloat(match[4]);

    if (n === -1) {
        alert("Untuk pangkat n = -1 hasil berupa ln. Kalkulator ini khusus untuk n ≠ -1.");
        return;
    }

    const resultBox = document.getElementById('result-box');
    const langkahDiv = document.getElementById('langkah-langkah');
    const btnCopy = document.getElementById('btn-copy');

    const tandaB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const pangkatBaru = n + 1;
    const penyebutBawah = a * pangkatBaru;
    const pengaliK = k !== 1 ? k : '';

    // PERBAIKAN TOTAL: Menulis rumus MathJax tanpa tab/spasi baru di dalam tanda $$ 
    // Menggunakan double backslash tunggal agar langsung diterjemahkan sebagai simbol oleh MathJax
    let htmlLangkah = `
        <p><strong>Soal yang terdeteksi:</strong></p>
        <p>$$\\int ${pengaliK}(${a}x ${tandaB})^{${n}} dx$$</p>
        <hr>
        <p><strong>Langkah 1: Misalkan komponen di dalam kurung sebagai $u$</strong></p>
        <p>$$u = ${a}x ${tandaB}$$</p>
        
        <p><strong>Langkah 2: Cari turunan $u$ terhadap $x$</strong></p>
        <p>$$\\frac{du}{dx} = ${a} \\implies dx = \\frac{du}{${a}}$$</p>
        
        <p><strong>Langkah 3: Substitusikan nilai $u$ dan $dx$ ke dalam soal awal</strong></p>
        <p>$$\\int ${pengaliK} u^{${n}} \\cdot \\frac{du}{${a}} = \\frac{${k}}{${a}} \\int u^{${n}} du$$</p>
        
        <p><strong>Langkah 4: Integralkan nilai $u$ menggunakan aturan pangkat</strong></p>
        <p>$$\\frac{${k}}{${a}} \\cdot \\left( \\frac{1}{${pangkatBaru}} u^{${pangkatBaru}} \\right) + C = \\frac{${k}}{${penyebutBawah}} u^{${pangkatBaru}} + C$$</p>
        
        <p><strong>Langkah 5: Kembalikan variabel $u$ menjadi fungsi $x$ semula</strong></p>
        <p>$$\\text{Hasil Akhir} = \\frac{${k}}{${penyebutBawah}} (${a}x ${tandaB})^{${pangkatBaru}} + C$$</p>
    `;

    // Inject string ke HTML DOM
    langkahDiv.innerHTML = htmlLangkah;
    
    // Buka display box hasil
    resultBox.style.display = 'block';
    btnCopy.style.display = 'block';

    // Paksa MathJax v3 melakukan compile ulang khusus pada area div langkah-langkah
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([langkahDiv]).catch(function (err) {
            console.error("Gagal merender simbol matematika: " + err.message);
        });
    }
}

function salinTeks() {
    const zonatemu = document.getElementById('langkah-langkah').innerText;
    navigator.clipboard.writeText(zonatemu).then(() => {
        alert("Langkah penyelesaian berhasil disalin!");
    }).catch(err => {
        alert("Gagal menyalin teks: ", err);
    });
}