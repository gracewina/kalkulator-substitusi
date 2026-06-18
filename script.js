function prosesSubstitusi() {
    let rawF = document.getElementById('input-f').value.trim();
    let rawU = document.getElementById('input-u').value.trim();

    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');

    // Reset Tampilan
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';

    if (!rawF || !rawU) {
        showError("Mohon masukkan fungsi f(x) dan pemisalan u terlebih dahulu.");
        return;
    }

    // --- SISTEM AUTO-CORRECT FORMAT GRACEWINNA ---
    // 1. Ubah x2 atau x3 menjadi x^2 atau x^3 secara otomatis
    rawF = rawF.replace(/x(\d+)/g, 'x^$1');
    rawU = rawU.replace(/x(\d+)/g, 'x^$1');

    // 2. Ubah format pangkat Python (**) menjadi format Algebrite (^)
    let inputF = rawF.replace(/\*\*/g, '^');
    let inputU = rawU.replace(/\*\*/g, '^');

    // 3. Tambahkan bintang (*) otomatis jika user menulis 2x atau 3x
    inputF = inputF.replace(/(\d+)x/g, '$1*x');
    inputU = inputU.replace(/(\d+)x/g, '$1*x');
    // ----------------------------------------------

    try {
        // 1. Hitung turunan dari u -> du/dx menggunakan Algebrite
        let du_dx = Algebrite.derivative(inputU, 'x').toString();
        
        // 2. Kalkulasi integral akhir otomatis
        let hasilIntegral = Algebrite.integral(inputF, 'x').toString();

        if (hasilIntegral === "integral(" + inputF + ")") {
            showError("Maaf, fungsi terlalu kompleks atau tidak dapat diselesaikan dengan aturan substitusi dasar library ini.");
            return;
        }

        // Tampilkan Box Hasil jika sukses
        resultContainer.style.display = 'block';

        // Konversi format string matematika ke bentuk kode presentasi LaTeX via Algebrite printf
        let f_latex = Algebrite.printf(inputF);
        let u_latex = Algebrite.printf(inputU);
        let dudx_latex = Algebrite.printf(du_dx);
        let hasil_latex = Algebrite.printf(hasilIntegral);

        // Render Langkah ke HTML
        document.getElementById('step-1-math').innerHTML = `$$u = ${u_latex}$$`;
        document.getElementById('step-2-math').innerHTML = `$$\\frac{du}{dx} = ${dudx_latex} \\implies dx = \\frac{du}{${dudx_latex}}$$`;
        document.getElementById('step-3-math').innerHTML = `$$\\int ${f_latex} \\, dx = \\int g(u) \\, du$$`;
        document.getElementById('step-4-math').innerHTML = `$$\\int g(u) \\, du = F(u) + C$$`;
        document.getElementById('step-5-math').innerHTML = `$$\\int ${f_latex} \\, dx = ${hasil_latex} + C$$`;

        // Jalankan MathJax
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }

    } catch (error) {
        showError("Terjadi kesalahan format matematika. Pastikan kurung tertutup dengan benar.");
        console.error(error);
    }
}

function showError(msg) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = msg;
    errorContainer.style.display = 'block';
}