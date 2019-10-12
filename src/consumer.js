const config = require('config');
const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus");

async function main() {
    //Cria a conexão com o Service Bus utilizando as configurações em config/default.json
    const cliente = ServiceBusClient.createFromConnectionString(config.get('Azure.serviceBus.connectionString'));
    const fila = cliente.createQueueClient(config.get('Azure.serviceBus.queueName'));
    const receiver = fila.createReceiver(ReceiveMode.ReceiveAndDelete); //Cria um receptor no modo ReceiveAndDelete

    try {
        //Cria um loop que aguarda novas mensagens serem inseridas na fila para consumi-las
        for await (let message of receiver.getMessageIterator()) {
            if (typeof message != 'undefined') {
                console.log(`Mensagem recebida: ${message.body}`);
                await message.complete(); //Informa que a mensagem foi lida
            }
        }

        //Consume um conjunto de 10 mensagens de uma única vez
        //const messages = await receiver.receiveMessages(10);
        //console.log(`${messages.length} mensagens recebidas:`);
        //for await (let message of messages) {
        //    console.log(message.body);
        //    await message.complete();
        //}

        await fila.close(); //Finaliza o cliente da fila
    } finally {
        await cliente.close(); //Finaliza o cliente do Service Bus
    }
}

main().catch((err) => {
    console.log("Error occurred: ", err);
});