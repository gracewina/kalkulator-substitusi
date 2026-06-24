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

    // PERBAIKAN UTAMA: Menggunakan tag HTML murni dan simbol asli 
    // agar langsung tampil sebagai simbol matematika tanpa ketergantungan MathJax
    let htmlLangkah = `
        <p><strong>Soal yang terdeteksi:</strong></p>
        <p style="font-size: 20px; text-align: center; margin: 15px 0;">
            <b>∫</b> ${pengaliK}(${a}x ${tandaB})<sup>${n}</sup> dx
        </p>
        <hr>
        <p><strong>Langkah 1: Misalkan komponen di dalam kurung sebagai <i>u</i></strong></p>
        <p style="font-size: 18px; text-align: center;">u = ${a}x ${tandaB}</p>
        
        <p><strong>Langkah 2: Cari turunan <i>u</i> terhadap <i>x</i></strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 10px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">dx</div>
            </div>
            <div>= ${a} &nbsp;⇒&nbsp; dx = </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">${a}</div>
            </div>
        </div>
        
        <p><strong>Langkah 3: Substitusikan nilai <i>u</i> dan <i>dx</i> ke dalam soal awal</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 10px 0;">
            <div><b>∫</b> ${pengaliK}u<sup>${n}</sup> · </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">${a}</div>
            </div>
            <div> = </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">${k}</div>
                <div style="padding-top: 2px;">${a}</div>
            </div>
            <div><b>∫</b> u<sup>${n}</sup> du</div>
        </div>
        
        <p><strong>Langkah 4: Integralkan nilai <i>u</i> menggunakan aturan pangkat</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; margin: 10px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">${k}</div>
                <div style="padding-top: 2px;">${a}</div>
            </div>
            <div> · </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">1</div>
                <div style="padding-top: 2px;">${pangkatBaru}</div>
            </div>
            <div>u<sup>${pangkatBaru}</sup> + C = </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">${k}</div>
                <div style="padding-top: 2px;">${penyebutBawah}</div>
            </div>
            <div>u<sup>${pangkatBaru}</sup> + C</div>
        </div>
        
        <p><strong>Langkah 5: Kembalikan variabel <i>u</i> menjadi fungsi <i>x</i> semula</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 20px; margin: 15px 0; color: #2b6cb0;">
            <div><b>Hasil Akhir = </b></div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">${k}</div>
                <div style="padding-top: 2px;">${penyebutBawah}</div>
            </div>
            <div>(${a}x ${tandaB})<sup>${pangkatBaru}</sup> + C</div>
        </div>
    `;

    // Inject string ke HTML DOM
    langkahDiv.innerHTML = htmlLangkah;
    
    // Buka display box hasil
    resultBox.style.display = 'block';
    btnCopy.style.display = 'block';
}

function salinTeks() {
    const zonatemu = document.getElementById('langkah-langkah').innerText;
    navigator.clipboard.writeText(zonatemu).then(() => {
        alert("Langkah penyelesaian berhasil disalin!");
    }).catch(err => {
        alert("Gagal menyalin teks: ", err);
    });
}