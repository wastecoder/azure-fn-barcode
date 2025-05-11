# Gerador e Validador de Código de Barras para Boletos com Azure Functions

Este repositório contém o código de um desafio de projeto do bootcamp **Microsoft Azure Cloud Native** da DIO.
O objetivo principal é criar um sistema funcional para gerar códigos de barras de boletos a partir de dados fornecidos, além de validar esses códigos gerados.
Este projeto utiliza o Azure Service Bus para o enfileiramento das informações geradas e expõe APIs através de Azure Functions para a geração e validação dos códigos.


## :file_folder: Estrutura do Projeto

```bash
azure-fn-barcode/
├── fnGeradorBoletos/
├── fnValidaBoleto/
└── front/
```

* `fnGeradorBoletos/`: Contém o código da Azure Function responsável por gerar código de barras.
  * Recebe a data de vencimento e valor do boleto via HTTP.
  * Gera o código de barras como uma imagem Base64.
  * Envia os dados para a fila do Azure Service Bus.
* `fnValidaBoleto/`: Contém o código da Azure Function responsável por validar um código de barras de boleto.
    * Recebe o código de barras via HTTP.
    * Verifica se o código possui o formato esperado (44 caracteres).
    * Extrai e valida a data de vencimento presente no código de barras.
    * Retorna um resultado JSON indicando se o código é válido e, em caso positivo, a data de vencimento extraída.
* `front/`: Contém os arquivos do front-end (HTML, CSS e JavaScript).
  * Fornece uma interface para o usuário interagir com as Azure Functions.
  * Permite a inserção de dados para geração e validação do código de barras.


## :package: Serviços do Microsoft Azure Utilizados

* **Grupo de Recursos:** Organiza todos os recursos relacionados ao projeto.
* **Barramento de Serviço (Service Bus):** Serviço de mensagens confiável para comunicação entre a função de geração e validação com outros sistemas.
* **Fila do Service Bus:** Fila para armazenar as informações dos códigos de barras gerados.


## :gear: Processo de Criação

1.  **Projeto no Microsoft Visual Studio:** Criado para codificar duas Azure Functions distintas: `fnGeradorBoletos` e `fnValidaBoleto`.

2.  **Criação do Grupo de Recursos no Portal Azure:** Feito para organizar todos os recursos relacionados a este projeto.

3.  **Criação do Service Bus:** Dentro do Grupo de Recursos, um Service Bus foi provisionado.

4.  **Configuração da Cadeia de Conexão do Service Bus:**
    * Na seção "Políticas de acesso compartilhado" do **Service Bus**, a "Cadeia de conexão primária" foi copiada.
    * Essa conexão foi inserida na variável de ambiente `ServiceBusConnectionString` dentro do arquivo `local.settings.json` da função `fnGeradorBoletos`.
    * Isso permitiu que a função enviasse mensagens para o Service Bus.

5.  **Criação da Fila no Service Bus:**
    * Dentro do **Service Bus**, uma fila foi criada para receber as mensagens contendo os dados dos boletos gerados.

6.  **Configuração de CORS nas Azure Functions:**
    * A configuração abaixo foi adicionada ao `local.settings.json` de ambas as funções (`fnGeradorBoletos` e `fnValidaBoleto`).
    * Ela habilita o CORS (Cross-Origin Resource Sharing) durante o desenvolvimento local, permitindo requisições de qualquer origem (`*`):

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        // ... outras configurações ...
      },
      "Host": {
        "CORS": "*"
      }
    }
    ```

7.  **Desenvolvimento do Front-end:** Criado para fornecer uma interface amigável para gerar e validar código de barras.


## :bulb: Insights e Possibilidades

* **Desacoplamento com Service Bus:** O uso do Azure Service Bus permite um desacoplamento entre a função que gera o código de barras e qualquer sistema que precise consumir essa informação. Isso torna o sistema mais escalável e resiliente.
* **Arquitetura Serverless:** As Azure Functions permitem executar o backend da aplicação sem a necessidade de gerenciar servidores, focando apenas na lógica de negócio e pagando apenas pelo tempo de execução.
* **Extensibilidade:** Novas funcionalidades, como diferentes formatos de código de barras ou lógicas de validação mais complexas, podem ser adicionadas como novas Azure Functions ou dentro das existentes com relativa facilidade.
* **Integração com Outros Serviços Azure:** O Service Bus pode ser integrado com outros serviços do Azure, como Logic Apps ou Power Automate, para criar fluxos de trabalho mais complexos em torno da geração e processamento de boletos.


## :computer: Instalação e Execução
Para executar este projeto e testar a funcionalidade de geração de código de barras:

1. **Crie os Recursos do Azure:**
   * Utilize o Portal Azure ou a Azure CLI, crie um `Grupo de Recursos` e, dentro dele, um `Service Bus`.
   * Dentro do Service Bus, crie uma fila chamada `gerador-codigo-barras`

2. **Obtenha a Cadeia de Conexão do Service Bus:**
   * No Portal Azure, navegue até o seu Service Bus.
   * Em "Configurações", clique em "Políticas de acesso compartilhado".
   * Selecione uma política existente e copie o valor da "Cadeia de conexão primária/secundária".

3. **Configure a Cadeia de Conexão na Azure Function:**
   * Abra o projeto fnGeradorBoletos no Microsoft Visual Studio.
   * Entre no arquivo local.settings.json.
   * Adicione a variável de ambiente ServiceBusConnectionString com a cadeia de conexão copiada na etapa anterior:

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        // ... outras configurações ...
        "ServiceBusConnectionString": "Endpoint=sb://..."
      },
      "Host": {
        "CORS": "*"
      }
    }
    ```

4. **Configure a Porta da Azure Function no Front-end:**
   * Navegue até a pasta `front/js` e localize o arquivo `configs.js`.
   * Ajuste as portas das URLs da API para corresponder às portas mostradas no console ao executar as Azure Functions localmente.

 5. **Executar as Azure Functions Localmente:**
    * No Microsoft Visual Studio, execute ambos os projetos de Azure Function.
    * Assim você poderá ver as portas das APIs e poderá configurar no passo anterior.
    * Caso já esteja configurado, deixe executando para o próximo passo.

6. **Abra o Front-end:**
   * Abra o arquivo `front/index.html` no seu navegador.

Agora você deverá conseguir interagir com o front-end, insira os dados do boleto e clique em "Gerar Código de Barras" para visualizar a imagem gerada.
Para testar a validação, gere um código de barras no campo antes e clique em "Validar Código" para ver o resultado (válido/inválido).
Ambas as funcionalidades (geração e validação) também podem ser testadas utilizando ferramentas como o Postman, enviando requisições POST para as URLs das respectivas Azure Functions.
