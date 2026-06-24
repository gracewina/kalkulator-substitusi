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

// Fungsi pembantu untuk mencari FPB
function cariFPB(x, y) {
    x = Math.abs(Math.round(x));
    y = Math.abs(Math.round(y));
    while(y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

// Fungsi mengubah angka menjadi pecahan HTML murni (Atas - Bawah) tanpa desimal
function kePecahanTeks(pembilang, penyebut) {
    if (pembilang === 0) return "0";
    
    if (pembilang % penyebut === 0) {
        return `${pembilang / penyebut}`;
    }

    let tanda = (pembilang * penyebut < 0) ? "-" : "";
    let p = Math.abs(Math.round(pembilang));
    let q = Math.abs(Math.round(penyebut));
    
    let fpb = cariFPB(p, q);
    p = p / fpb;
    q = q / fpb;
    
    if (q === 1) return `${tanda}${p}`;
    
    return `
        <div style="display: inline-block; vertical-align: middle; text-align: center; font-size: 16px; margin: 0 4px;">
            <div style="border-bottom: 2px solid #333; padding: 0 2px;">${tanda}${p}</div>
            <div style="padding: 0 2px;">${q}</div>
        </div>
    `;
}

function prosesIntegralLanjutan() {
    let soalRaw = document.getElementById('input-soal').value;
    let soal = soalRaw.replace(/\s+/g, ''); // Bersihkan spasi

    // REGEX: Mendukung variabel luar dan pangkat x di dalam kurung secara opsional
    const polaMulus = /(?:∫)?(-?\d*)(?:x(?:\^?(\d+))?)?\(?(-?\d*)x(?:\^?(\d+))?([+-]\d+)\)\^?(-?\d+)(?:dx)?/;
    const match = soal.match(polaMulus);

    if (!match) {
        alert("Format soal tidak dikenali! Gunakan format seperti: ∫ x(x^2 + 3)^5 dx");
        return;
    }

    let kLuarTeks = match[1];
    let pLuarTeks = match[2];
    let aTeks = match[3];
    let pDalamTeks = match[4];
    let b = parseFloat(match[5]);
    let n = parseFloat(match[6]);

    let k = kLuarTeks === "" ? 1 : (kLuarTeks === "-" ? -1 : parseFloat(kLuarTeks));
    let pLuar = soal.includes('x(') || soal.includes('x^') ? (pLuarTeks === undefined || pLuarTeks === "" ? 1 : parseFloat(pLuarTeks)) : 0;
    let a = aTeks === "" ? 1 : (aTeks === "-" ? -1 : parseFloat(aTeks));
    let pDalam = pDalamTeks === undefined || pDalamTeks === "" ? 1 : parseFloat(pDalamTeks);

    if (n === -1) {
        alert("Untuk pangkat n = -1 hasil berupa ln.");
        return;
    }

    // Perhitungan kalkulus substitusi komponen
    let koefDu = a * pDalam;
    let pangkatDu = pDalam - 1;
    let pangkatBaru = n + 1;
    let penyebutBawah = koefDu * pangkatBaru;
    const tandaB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

    const resultBox = document.getElementById('result-box');
    const langkahDiv = document.getElementById('langkah-langkah');
    const btnCopy = document.getElementById('btn-copy');

    // PENJABARAN TAHAPAN MATEMATIKA YANG SANGAT DETAIL (TANPA LOMPATAN)
    let htmlLangkah = `
        <p><strong>Soal yang terdeteksi:</strong></p>
        <p style="font-size: 22px; text-align: center; margin: 15px 0; font-weight: bold; color: #1a202c;">
            ∫ ${kLuarTeks === "-" ? "-" : (k !== 1 ? k : "")}${pLuar > 0 ? `x<sup>${pLuar}</sup>` : ""}(${aTeks === "-" ? "-" : (a !== 1 ? a : "")}x<sup>${pDalam}</sup> ${tandaB})<sup>${n}</sup> dx
        </p>
        <hr style="border:0; border-top: 1px solid #e2e8f0; margin: 15px 0;">
        
        <p><strong>Langkah 1: Lakukan Pemisalan Variabel</strong></p>
        <p>Kita misalkan fungsi yang berada di dalam kurung sebagai variabel <b>u</b>:</p>
        <p style="font-size: 18px; text-align: center; margin: 10px 0; background-color: #edf2f7; padding: 8px; border-radius: 4px; display: inline-block; min-width: 180px;">
            <b>u = ${a !== 1 ? a : ""}x<sup>${pDalam}</sup> ${tandaB}</b>
        </p>
        
        <p><strong>Langkah 2: Cari Turunan u terhadap x (Mencari Nilai dx)</strong></p>
        <p>Turunkan fungsi <b>u</b> menggunakan aturan turunan aljabar:</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">dx</div>
            </div>
            <div>= ${a !== 1 ? a : ""} · ${pDalam}x<sup>${pDalam} - 1</sup></div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">dx</div>
            </div>
            <div>= ${koefDu}x<sup>${pangkatDu}</sup></div>
        </div>
        <p>Ubah persamaan di atas agar kita mendapatkan nilai dari komponen <b>dx</b>:</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div><b>dx = </b></div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">${koefDu}x<sup>${pangkatDu}</sup></div>
            </div>
        </div>
        
        <p><strong>Langkah 3: Substitusikan u dan dx ke dalam Persamaan Awal</strong></p>
        <p>Ganti fungsi dalam kurung menjadi <b>u</b> dan ganti <b>dx</b> menjadi nilai turunan yang diperoleh:</p>
        <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div>∫ ${k !== 1 ? k : ""}${pLuar > 0 ? `x<sup>${pLuar}</sup>` : ""} · (u)<sup>${n}</sup> · </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">${koefDu}x<sup>${pangkatDu}</sup></div>
            </div>
        </div>
        ${pLuar > 0 ? `
        <p style="font-size: 15px; color: #4a5568; font-style: italic; background: #fffaf0; border-left: 4px solid #dd6b20; padding: 8px; margin: 10px 0;">
            *Proses Eliminasi: Variabel <b>x<sup>${pLuar}</sup></b> pada bagian pembilang di luar kurung membagi habis variabel <b>x<sup>${pangkatDu}</sup></b> pada bagian penyebut, sehingga variabel x hilang sepenuhnya dari integral.
        </p>
        ` : ""}
        <p>Keluarkan konstanta angka ke depan tanda integral (<b>∫</b>):</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div>= ∫ </div>
            <div style="text-align: center; display: inline-block; vertical-align: middle;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">${k}</div>
                <div style="padding-top: 2px;">${koefDu}</div>
            </div>
            <div> · u<sup>${n}</sup> du</div>
            <div> = </div>
            ${kePecahanTeks(k, koefDu)}
            <div> ∫ u<sup>${n}</sup> du</div>
        </div>
        
        <p><strong>Langkah 4: Integralkan Variabel u menggunakan Aturan Pangkat</strong></p>
        <p>Gunakan rumus dasar integral aljabar $$\\int u^n du = \\frac{1}{n+1} u^{n+1}$$ :</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; margin: 15px 0;">
            <div>= </div>
            ${kePecahanTeks(k, koefDu)}
            <div> · </div>
            <div style="text-align: center; display: inline-block; vertical-align: middle;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">1</div>
                <div style="padding-top: 2px;">${n} + 1</div>
            </div>
            <div> · u<sup>${n} + 1</sup> + C</div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; margin: 15px 0;">
            <div>= </div>
            ${kePecahanTeks(k, koefDu)}
            <div> · </div>
            ${kePecahanTeks(1, pangkatBaru)}
            <div> · u<sup>${pangkatBaru}</sup> + C</div>
        </div>
        <p>Kalikan kedua nilai pecahan pembilang dengan pembilang, serta penyebut dengan penyebut:</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; margin: 15px 0;">
            <div>= </div>
            <div style="text-align: center; display: inline-block; vertical-align: middle;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">${k} · 1</div>
                <div style="padding-top: 2px;">${koefDu} · ${pangkatBaru}</div>
            </div>
            <div> · u<sup>${pangkatBaru}</sup> + C</div>
            <div> = </div>
            ${kePecahanTeks(k, penyebutBawah)}
            <div> · u<sup>${pangkatBaru}</sup> + C</div>
        </div>
        
        <p><strong>Langkah 5: Kembalikan Nilai u Menjadi Fungsi x Semula</strong></p>
        <p>Substitusikan kembali nilai pemisalan <b>u = ${a !== 1 ? a : ""}x<sup>${pDalam}</sup> ${tandaB}</b> untuk mendapatkan jawaban akhir:</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 20px; margin: 20px 0; color: #2b6cb0; font-weight: bold;">
            <div>Hasil Akhir = </div>
            ${kePecahanTeks(k, penyebutBawah)}
            <div>(${a !== 1 ? a : ""}x<sup>${pDalam}</sup> ${tandaB})<sup>${pangkatBaru}</sup> + C</div>
        </div>
    `;

    langkahDiv.innerHTML = htmlLangkah;
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