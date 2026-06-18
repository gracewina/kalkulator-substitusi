function prosesSubstitusi() {
    // Mengambil input dan otomatis mengubah '**' menjadi '^' agar didukung oleh Algebrite
    let rawF = document.getElementById('input-f').value.trim();
    let rawU = document.getElementById('input-u').value.trim();

    // Proses konversi otomatis jika user mengetik menggunakan format komputer / Python (**)
    const inputF = rawF.replace(/\*\*/g, '^');
    const inputU = rawU.replace(/\*\*/g, '^');

    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');

    // Reset halaman tampilan hasil/error
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';

    if (!inputF || !inputU) {
        showError("Mohon masukkan fungsi f(x) dan pemisalan u terlebih dahulu.");
        return;
    }

    try {
        // 1. Hitung turunan dari u -> du/dx menggunakan Algebrite
        let du_dx = Algebrite.derivative(inputU, 'x').toString();
        
        // 2. Kalkulasi integral akhir otomatis
        let hasilIntegral = Algebrite.integral(inputF, 'x').toString();

        if (hasilIntegral === "integral(" + inputF + ")") {
            showError("Maaf, fungsi terlalu kompleks atau tidak dapat diselesaikan dengan aturan substitusi dasar library ini.");
            return;
        }

        // Tampilkan Box Hasil
        resultContainer.style.display = 'block';

        // Konversi format string matematika ke bentuk kode presentasi LaTeX via Algebrite printf
        let f_latex = Algebrite.printf(inputF);
        let u_latex = Algebrite.printf(inputU);
        let dudx_latex = Algebrite.printf(du_dx);
        let hasil_latex = Algebrite.printf(hasilIntegral);

        // Render Langkah 1
        document.getElementById('step-1-math').innerHTML = `$$u = ${u_latex}$$`;

        // Render Langkah 2
        document.getElementById('step-2-math').innerHTML = `$$\\frac{du}{dx} = ${dudx_latex} \\implies dx = \\frac{du}{${dudx_latex}}$$`;

        // Render Langkah 3
        document.getElementById('step-3-math').innerHTML = `$$\\int ${f_latex} \\, dx = \\int g(u) \\, du$$`;

        // Render Langkah 4
        document.getElementById('step-4-math').innerHTML = `$$\\int g(u) \\, du = F(u) + C$$`;

        // Render Langkah 5 (Hasil Akhir)
        document.getElementById('step-5-math').innerHTML = `$$\\int ${f_latex} \\, dx = ${hasil_latex} + C$$`;

        // Instruksikan MathJax untuk memproses simbol LaTeX baru
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }

    } catch (error) {
        showError("Terjadi kesalahan format penulisan matematika. Pastikan aturan pengetikan benar (gunakan '*' untuk perkalian seperti 2*x).");
        console.error(error);
    }
}

function showError(msg) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = msg;
    errorContainer.style.display = 'block';
}
