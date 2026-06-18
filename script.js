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

    try {
        // --- SISTEM PENYARING ERROR OTOMATIS (ANTI-GLITCH) ---
        
        // 1. Jika ada kurung yang langsung diikuti angka, ubah jadi pangkat. Contoh: (x+1)3 menjadi (x+1)^3
        rawF = rawF.replace(/\)(\d+)/g, ')^$1');
        rawU = rawU.replace(/\)(\d+)/g, ')^$1');

        // 2. Jika ada x diikuti angka tanpa pangkat, ubah jadi pangkat. Contoh: x2 menjadi x^2
        rawF = rawF.replace(/x(\d+)/g, 'x^$1');
        rawU = rawU.replace(/x(\d+)/g, 'x^$1');

        // 3. Ubah pangkat dua bintang (**) khas Python menjadi caping (^) khas Algebrite
        let inputF = rawF.replace(/\*\*/g, '^');
        let inputU = rawU.replace(/\*\*/g, '^');

        // 4. Tambahkan bintang perkalian jika angka menempel dengan x. Contoh: 2x menjadi 2*x
        inputF = inputF.replace(/(\d+)x/g, '$1*x');
        inputU = inputU.replace(/(\d+)x/g, '$1*x');
        
        // 5. Tambahkan bintang perkalian antar kurung atau x dengan kurung. Contoh: x(x^2) menjadi x*(x^2)
        inputF = inputF.replace(/x\(/g, 'x*(').replace(/\)\(/g, ')*(');
        inputU = inputU.replace(/x\(/g, 'x*(').replace(/\)\(/g, ')*(');

        // --- PROSES KALKULASI MATEMATIKA ---
        
        // Hitung turunan du/dx
        let du_dx = Algebrite.derivative(inputU, 'x').toString();
        
        // Hitung integral akhir f(x) dx
        let hasilIntegral = Algebrite.integral(inputF, 'x').toString();

        if (hasilIntegral === "integral(" + inputF + ")") {
            showError("Maaf, fungsi terlalu kompleks atau tidak dapat diselesaikan dengan aturan substitusi dasar library ini.");
            return;
        }

        // Jika semua kalkulasi aman, tampilkan container hasil
        resultContainer.style.display = 'block';

        // Format ke tampilan rumus LaTeX yang cantik
        let f_latex = Algebrite.printf(inputF);
        let u_latex = Algebrite.printf(inputU);
        let dudx_latex = Algebrite.printf(du_dx);
        let hasil_latex = Algebrite.printf(hasilIntegral);

        // Pasang hasil ke halaman HTML
        document.getElementById('step-1-math').innerHTML = `$$u = ${u_latex}$$`;
        document.getElementById('step-2-math').innerHTML = `$$\\frac{du}{dx} = ${dudx_latex} \\implies dx = \\frac{du}{${dudx_latex}}$$`;
        document.getElementById('step-3-math').innerHTML = `$$\\int ${f_latex} \\, dx = \\int g(u) \\, du$$`;
        document.getElementById('step-4-math').innerHTML = `$$\\int g(u) \\, du = F(u) + C$$`;
        document.getElementById('step-5-math').innerHTML = `$$\\int ${f_latex} \\, dx = ${hasil_latex} + C$$`;

        // Perintahkan MathJax menggambar simbol matematika
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }

    } catch (error) {
        showError("Terjadi kesalahan format matematika. Pastikan jumlah kurung pembuka '(' dan penutup ')' sudah seimbang.");
        console.error(error);
    }
}

function showError(msg) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = msg;
    errorContainer.style.display = 'block';
}