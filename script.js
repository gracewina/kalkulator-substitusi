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

// Fungsi mengubah angka menjadi pecahan HTML murni yang rapi
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

    // REGEX BARU: Mendukung variabel luar dan pangkat x di dalam kurung secara opsional
    // Pola: ∫ [k_luar][x^[p_luar]] ( [a]x^[p_dalam] [+-] [b] ) ^ [n] dx
    const polaMulus = /(?:∫)?(-?\d*)(?:x(?:\^?(\d+))?)?\(?(-?\d*)x(?:\^?(\d+))?([+-]\d+)\)\^?(-?\d+)(?:dx)?/;
    const match = soal.match(polaMulus);

    if (!match) {
        alert("Format soal tidak dikenali! Gunakan format seperti: ∫ x(x^2 + 3)^5 dx atau ∫ 3x^2(2x^3 - 1)^4 dx");
        return;
    }

    // Ambil nilai dari hasil pencocokan Regex
    let kLuarTeks = match[1];
    let pLuarTeks = match[2];
    let aTeks = match[3];
    let pDalamTeks = match[4];
    let b = parseFloat(match[5]);
    let n = parseFloat(match[6]);

    // Logika penentuan nilai default jika user tidak mengetik angka secara eksplisit
    let k = kLuarTeks === "" ? 1 : (kLuarTeks === "-" ? -1 : parseFloat(kLuarTeks));
    let pLuar = soal.includes('x(') || soal.includes('x^') ? (pLuarTeks === undefined || pLuarTeks === "" ? 1 : parseFloat(pLuarTeks)) : 0;
    let a = aTeks === "" ? 1 : (aTeks === "-" ? -1 : parseFloat(aTeks));
    let pDalam = pDalamTeks === undefined || pDalamTeks === "" ? 1 : parseFloat(pDalamTeks);

    if (n === -1) {
        alert("Untuk pangkat n = -1 hasil berupa ln. Kalkulator ini khusus untuk n ≠ -1.");
        return;
    }

    // Hitung turunan u (du/dx = a * pDalam * x^(pDalam - 1))
    let koefDu = a * pDalam;
    let pangkatDu = pDalam - 1;

    // Hitung nilai akhir penyebut pecahan luar
    let penyebutBawah = koefDu * (n + 1);
    let pangkatBaru = n + 1;
    const tandaB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

    const resultBox = document.getElementById('result-box');
    const langkahDiv = document.getElementById('langkah-langkah');
    const btnCopy = document.getElementById('btn-copy');

    // Susun visualisasi langkah penyelesaian menggunakan HTML murni tanpa $$
    let htmlLangkah = `
        <p><strong>Soal yang terdeteksi:</strong></p>
        <p style="font-size: 22px; text-align: center; margin: 15px 0; font-weight: bold;">
            ∫ ${kLuarTeks === "-" ? "-" : (k !== 1 ? k : "")}${pLuar > 0 ? `x<sup>${pLuar}</sup>` : ""}(${aTeks === "-" ? "-" : (a !== 1 ? a : "")}x<sup>${pDalam}</sup> ${tandaB})<sup>${n}</sup> dx
        </p>
        <hr style="border:0; border-top: 1px solid #ccc; margin: 15px 0;">
        
        <p><strong>Langkah 1: Misalkan komponen di dalam kurung sebagai u</strong></p>
        <p style="font-size: 18px; text-align: center; margin: 10px 0;">u = ${a !== 1 ? a : ""}x<sup>${pDalam}</sup> ${tandaB}</p>
        
        <p><strong>Langkah 2: Cari turunan u terhadap x (du/dx)</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">dx</div>
            </div>
            <div>= ${koefDu}x<sup>${pangkatDu}</sup> &nbsp;⇒&nbsp; dx = </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">${koefDu}x<sup>${pangkatDu}</sup></div>
            </div>
        </div>
        
        <p><strong>Langkah 3: Substitusikan nilai u dan dx ke dalam soal awal (variabel x luar tereliminasi habis)</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div>∫ u<sup>${n}</sup> · </div>
            ${kePecahanTeks(k, koefDu)} du
        </div>
        
        <p><strong>Langkah 4: Integralkan nilai u menggunakan aturan pangkat (Pangkat n + 1)</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; margin: 15px 0;">
            ${kePecahanTeks(k, koefDu)}
            <div> · </div>
            ${kePecahanTeks(1, pangkatBaru)}
            <div>u<sup>${pangkatBaru}</sup> + C</div>
        </div>
        
        <p><strong>Langkah 5: Sederhanakan koefisien akhir dan kembalikan nilai u ke fungsi semula</strong></p>
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