document.addEventListener("DOMContentLoaded", function () {
    // Define a data padrão para o campo de data (hoje)
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split("T")[0];
    document.getElementById("dataVencimento").value = dataFormatada;
});

async function gerarCodigoBarras() {
    const dataVencimento = document.getElementById("dataVencimento").value;
    const valor = document.getElementById("valor").value;

    // Validação de campos
    if (!dataVencimento || !valor) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (parseFloat(valor) <= 0) {
        alert("O valor deve ser maior que zero.");
        return;
    }

    mostrarLoader();

    try {
        const response = await fetch(CONFIG.URL_API_GERACAO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dataVencimento,
                valor: parseFloat(valor),
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById(
            "barcodeImage"
        ).src = `data:image/png;base64,${data.imagemBase64}`;
        document.getElementById("barcodeText").textContent = data.barcode;

        document.getElementById("resultContent").style.display = "block";
    } catch (error) {
        console.error("Erro ao gerar o código de barras:", error);
        alert(
            "Erro ao gerar o código de barras. Verifique o console para mais detalhes."
        );
    } finally {
        esconderLoader();
    }
}

async function validarCodigo() {
    const barcode = document.getElementById("barcodeText").innerText;

    if (!barcode) {
        alert("Nenhum código de barras para validar.");
        return;
    }

    try {
        const response = await fetch(CONFIG.URL_API_VALIDACAO, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ barcode }),
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const result = await response.json();
        updateValidationUI(result);
    } catch (error) {
        console.error("Erro ao validar o código de barras:", error);
        alert(
            "Erro ao validar o código de barras. Verifique o console para mais detalhes."
        );
    }
}

function updateValidationUI(result) {
    const barcodeResult = document.getElementById("barcodeText");
    const validationMessage = document.getElementById("validationMessage");

    // Limpar estilos anteriores
    barcodeResult.classList.remove("barcode-valid", "barcode-invalid");
    validationMessage.classList.remove(
        "validation-valid",
        "validation-invalid"
    );

    if (result.valido === true) {
        barcodeResult.classList.add("barcode-valid");
        validationMessage.textContent = "Código de barras válido!";
        validationMessage.classList.add("validation-valid");
    } else {
        barcodeResult.classList.add("barcode-invalid");
        validationMessage.textContent = "Código de barras inválido!";
        validationMessage.classList.add("validation-invalid");
    }
}

function mostrarLoader() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("resultContent").style.display = "none";
    document.getElementById("gerarButton").disabled = true;
}

function esconderLoader() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("gerarButton").disabled = false;
}
