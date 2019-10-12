const config = require('config');
const { ServiceBusClient } = require("@azure/service-bus");

async function main() {
    //Cria a conexão com o Service Bus utilizando as configurações em config/default.json
    const cliente = ServiceBusClient.createFromConnectionString(config.get('Azure.serviceBus.connectionString'));
    const fila = cliente.createQueueClient(config.get('Azure.serviceBus.queueName'));
    const sender = fila.createSender();

    try {
        //Fabricamos 20 mensagens
        for (let i = 0; i < 20; i++) {
            //Esse será o conteúdo das nossas mensagens
            const message = {
                body: `Mensagem ${i}`,
                label: `testes`,
                properties: {
                    country: `Brazil`,
                    state: `PE`
                }
            };
            await sender.send(message); //Envia mensagem
            console.log(`Enviou a mensagem ${i}`)
        }

        await fila.close(); //Finaliza o cliente da fila
    } finally {

        await cliente.close(); //Finaliza o cliente do Service Bus
    }
}

main().catch((err) => {
    console.log(err);
});