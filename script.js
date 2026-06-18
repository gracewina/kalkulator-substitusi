function prosesSubstitusi() {
    let rawF = document.getElementById('input-f').value.trim();
    let rawU = document.getElementById('input-u').value.trim();

    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');

    // Reset Tampilan awal
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';

    if (!rawF || !rawU) {
        showError("Mohon masukkan fungsi f(x) dan pemisalan u terlebih dahulu.");
        return;
    }

    try {
        // --- SISTEM FORMATTING AMAN (SANITASI INPUT) ---
        
        // 1. Bersihkan semua spasi berlebih
        let inputF = rawF.replace(/\s+/g, '');
        let inputU = rawU.replace(/\s+/g, '');

        // 2. Ubah format pangkat Python (**) menjadi format Algebrite (^) jika ada
        inputF = inputF.replace(/\*\*/g, '^');
        inputU = inputU.replace(/\*\*/g, '^');

        // 3. Sederhanakan kurung bungkus pada variabel tunggal berpangkat, misal: (x^3) -> x^3
        // Menggunakan pencocokan karakter non-kurung yang lebih aman
        inputF = inputF.replace(/\((x\^\d+)\)/g, "$1");
        inputU = inputU.replace(/\((x\^\d+)\)/g, "$1");

        // 4. Tambahkan '*' otomatis untuk angka menempel di depan x (Contoh: 2x -> 2*x)
        inputF = inputF.replace(/(\d+)(x)/g, '$1*$2');
        inputU = inputU.replace(/(\d+)(x)/g, '$1*$2');

        // 5. Tambahkan '*' otomatis untuk angka di depan kurung buka (Contoh: 2(x^3) -> 2*(x^3))
        inputF = inputF.replace(/(\d+)\(/g, '$1*(');
        inputU = inputU.replace(/(\d+)\(/g, '$1*(');

        // 6. Tambahkan '*' otomatis di antara x dan kurung (Contoh: x(x+1) -> x*(x+1))
        inputF = inputF.replace(/x\(/g, 'x*(');
        inputU = inputU.replace(/x\(/g, 'x*(');

        // --- PROSES INTEGRAL ---
        
        // Hitung turunan du/dx
        let du_dx = Algebrite.derivative(inputU, 'x').toString();
        
        // Hitung integral otomatis dari f(x) terhadap x
        let hasilIntegral = Algebrite.integral(inputF, 'x').toString();

        // Cek jika Algebrite gagal menyelesaikan integralnya
        if (hasilIntegral === "integral(" + inputF + ")") {
            showError("Maaf, fungsi terlalu kompleks atau tidak dapat diselesaikan dengan aturan substitusi dasar library ini.");
            return;
        }

        // Tampilkan Container Hasil
        resultContainer.style.display = 'block';

        // Format hasil string ke bentuk kode tampilan LaTeX via Algebrite printf
        let f_latex = Algebrite.printf(inputF);
        let u_latex = Algebrite.printf(inputU);
        let dudx_latex = Algebrite.printf(du_dx);
        let hasil_latex = Algebrite.printf(hasilIntegral);

        // Pasang hasil langkah pengerjaan ke komponen HTML
        document.getElementById('step-1-math').innerHTML = `$$u = ${u_latex}$$`;
        document.getElementById('step-2-math').innerHTML = `$$\\frac{du}{dx} = ${dudx_latex} \\implies dx = \\frac{du}{${dudx_latex}}$$`;
        document.getElementById('step-3-math').innerHTML = `$$\\int ${f_latex} \\, dx = \\int g(u) \\, du$$`;
        document.getElementById('step-4-math').innerHTML = `$$\\int g(u) \\, du = F(u) + C$$`;
        document.getElementById('step-5-math').innerHTML = `$$\\int ${f_latex} \\, dx = ${hasil_latex} + C$$`;

        // Perintahkan MathJax untuk merender ulang rumus matematika di layar
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }

    } catch (error) {
        // PERBAIKAN: Menampilkan pesan kesalahan riil dari sistem/Algebrite agar mudah dilacak
        showError("Pesan Sistem: " + error.message + ". Periksa kembali format penulisan matematika Anda.");
        console.error(error);
    }
}

function showError(msg) {
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = msg;
    errorContainer.style.display = 'block';
}