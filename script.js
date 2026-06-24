function hitungIntegral() {
    // Mengambil nilai input
    const a = parseFloat(document.getElementById('input-a').value);
    const b = parseFloat(document.getElementById('input-b').value);
    const n = parseFloat(document.getElementById('input-n').value);
    
    if (isNaN(a) || isNaN(b) || isNaN(n)) {
        alert("Mohon masukkan semua angka dengan benar!");
        return;
    }

    if (n === -1) {
        alert("Untuk pangkat n = -1, hasilnya adalah fungsi Logaritma Natural (ln). Kalkulator ini khusus untuk n ≠ -1.");
        return;
    }

    const resultBox = document.getElementById('result-box');
    const langkahDiv = document.getElementById('langkah-langkah');
    
    // Tanda tambah atau kurang untuk visualisasi b
    const tandaB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const pangkatBaru = n + 1;
    const koefisienDepan = (1 / (a * pangkatBaru)).toFixed(4); // dibulatkan 4 angka belakang koma jika desimal
    
    // Menyusun teks langkah-langkah menggunakan format MathJax (LaTeX)
    let htmlLangkah = `
        <p><strong>Soal:</strong> Tentukan $\\int (${a}x ${tandaB})^{${n}} \\, dx$</p>
        <hr>
        <p><strong>Langkah 1: Misalkan komponen di dalam kurung sebagai $u$</strong></p>
        <p>$$u = ${a}x ${tandaB}$$</p>
        
        <p><strong>Langkah 2: Turunkan $u$ terhadap $x$ ($du/dx$)</strong></p>
        <p>$$\\frac{du}{dx} = ${a} \\implies dx = \\frac{du}{${a}}$$</p>
        
        <p><strong>Langkah 3: Substitusikan $u$ dan $dx$ ke dalam integral semula</strong></p>
        <p>$$\\int u^{${n}} \\cdot \\frac{du}{${a}} = \\frac{1}{${a}} \\int u^{${n}} \\, du$$</p>
        
        <p><strong>Langkah 4: Integralkan fungsi $u$ sesuai aturan pangkat</strong></p>
        <p>$$\\frac{1}{${a}} \\cdot \\left( \\frac{1}{${n} + 1} u^{${n} + 1} \\right) + C$$</p>
        <p>$$\\frac{1}{${a}} \\cdot \\frac{1}{${pangkatBaru}} u^{${pangkatBaru}} + C = \\frac{1}{${a * pangkatBaru}} u^{${pangkatBaru}} + C$$</p>
        
        <p><strong>Langkah 5: Kembalikan nilai $u$ ke bentuk $x$ semula</strong></p>
        <p>$$\\text{Hasil Akhir} = \\frac{1}{${a * pangkatBaru}} (${a}x ${tandaB})^{${pangkatBaru}} + C$$</p>
    `;
    
    // Masukkan ke HTML
    langkahDiv.innerHTML = htmlLangkah;
    resultBox.style.display = 'block';
    
    // Memicu MathJax untuk me-render ulang rumus matematika baru
    MathJax.typeset();
}