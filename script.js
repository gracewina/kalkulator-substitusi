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

// Fungsi pembantu untuk mencari FPB (untuk menyederhanakan pecahan)
function cariFPB(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

// Fungsi untuk mengubah desimal menjadi teks pecahan biasa yang rapi
function kePecahanTeks(pembilang, penyebut) {
    if (pembilang === 0) return "0";
    
    // Tentukan tanda minus di depan
    let tanda = (pembilang * penyebut < 0) ? "-" : "";
    pembilang = Math.abs(pembilang);
    penyebut = Math.abs(penyebut);
    
    // Sederhanakan menggunakan FPB
    let fpb = cariFPB(pembilang, penyebut);
    pembilang = pembilang / fpb;
    penyebut = penyebut / fpb;
    
    if (penyebut === 1) {
        return `${tanda}${pembilang}`;
    }
    
    // Render ke dalam bentuk HTML pecahan atas-bawah
    return `
        <div style="display: inline-block; vertical-align: middle; text-align: center; font-size: 16px; margin: 0 4px;">
            <div style="border-bottom: 2px solid #333; padding: 0 2px;">${tanda}${pembilang}</div>
            <div style="padding: 0 2px;">${penyebut}</div>
        </div>
    `;
}

function prosesIntegralLanjutan() {
    let soalRaw = document.getElementById('input-soal').value;
    
    // Bersihkan spasi
    let soal = soalRaw.replace(/\s+/g, '');

    // Pola Regex yang disempurnakan untuk mendeteksi k(ax+b)^n 
    // Mendukung pangkat positif, negatif, dan desimal (contoh: ^5, ^-3, ^0.5)
    const pola = /(?:∫)?(-?\d*\.?\d*)\(?(-?\d*\.?\d*)x([+-]\d*\.?\d*)\)\^?(-?\d*\.?\d*)(?:dx)?/;
    const match = soal.match(pola);

    if (!match) {
        alert("Format soal tidak dikenali! Contoh format: ∫ (2x + 3)^5 dx");
        return;
    }

    // Ekstraksi nilai angka koefisien
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
    
    // Hitung penyebut bawah hasil perkalian (a * pangkat baru)
    const penyebutBawah = a * pangkatBaru;
    const pengaliK = k !== 1 ? k : '';

    // Buat format tampilan pecahan agar rapi
    let pecahanAwalLuar = kePecahanTeks(k, a);
    let pecahanAturanPangkat = kePecahanTeks(1, pangkatBaru);
    let pecahanHasilAkhir = kePecahanTeks(k, penyebutBawah);

    let htmlLangkah = `
        <p><strong>Soal yang terdeteksi:</strong></p>
        <p style="font-size: 22px; text-align: center; margin: 15px 0; font-weight: bold;">
            ∫ ${pengaliK}(${a}x ${tandaB})<sup>${n}</sup> dx
        </p>
        <hr style="border:0; border-top: 1px solid #ccc; margin: 15px 0;">
        
        <p><strong>Langkah 1: Misalkan komponen di dalam kurung sebagai u</strong></p>
        <p style="font-size: 18px; text-align: center; margin: 10px 0;">u = ${a}x ${tandaB}</p>
        
        <p><strong>Langkah 2: Cari turunan u terhadap x</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; padding-bottom: 2px;">du</div>
                <div style="padding-top: 2px;">dx</div>
            </div>
            <div>= ${a} &nbsp;⇒&nbsp; dx = </div>
            ${kePecahanTeks(1, a)} du
        </div>
        
        <p><strong>Langkah 3: Substitusikan nilai u dan dx ke dalam soal awal</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; margin: 15px 0;">
            <div>∫ ${pengaliK}u<sup>${n}</sup> · </div>
            ${kePecahanTeks(1, a)} du
            <div> = </div>
            ${pecahanAwalLuar}
            <div>∫ u<sup>${n}</sup> du</div>
        </div>
        
        <p><strong>Langkah 4: Integralkan nilai u menggunakan aturan pangkat (Pangkat n + 1)</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; margin: 15px 0;">
            ${pecahanAwalLuar}
            <div> · </div>
            ${pecahanAturanPangkat}
            <div>u<sup>${pangkatBaru}</sup> + C</div>
        </div>
        
        <p><strong>Langkah 5: Sederhanakan pecahan dan kembalikan variabel u menjadi x semula</strong></p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 20px; margin: 20px 0; color: #2b6cb0; font-weight: bold;">
            <div>Hasil Akhir = </div>
            ${pecahanHasilAkhir}
            <div>(${a}x ${tandaB})<sup>${pangkatBaru}</sup> + C</div>
        </div>
    `;

    // Masukkan ke HTML DOM
    langkahDiv.innerHTML = htmlLangkah;
    
    // Tampilkan box hasil
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