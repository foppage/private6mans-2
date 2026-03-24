module.exports.run = async (client, message, args) => {
    message.reply(`Pong! Latency is ${Math.round(client.ping)}ms.`);
}
module.exports.config = {
    name:"ping",
    description:"Latency to discord."
}