using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace fnValidaBoleto
{
    public class Function1
    {
        private readonly ILogger<Function1> _logger;

        public Function1(ILogger<Function1> logger)
        {
            _logger = logger;
        }

        [Function("barcode-validate")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            string barcodeData = data?.barcode;

            if (string.IsNullOrEmpty(barcodeData))
            {
                return new BadRequestObjectResult("O campo barcode � obrigat�rio");
            }

            if (barcodeData.Length != 44)
            {
                var result = new { valido = false, mensagem = "O campo barcode deve ter 44 caracteres" };
                return new BadRequestObjectResult(result);
            }

            string datePart = barcodeData.Substring(3, 8);
            if (!DateTime.TryParseExact(datePart, "yyyyMMdd", null, System.Globalization.DateTimeStyles.None, out DateTime dateObj))
            {
                var result = new { valido = false, mensagem = "Data de Vencimento inv�lida" };
                return new BadRequestObjectResult(result);
            }

            var resultOk = new { valido = true, mensagem = "Boleto v�lido", vencimento = dateObj.ToString("dd-MM-yyyy") };
            return new OkObjectResult(resultOk);
        }
    }
}
