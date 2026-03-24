module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    try {
        await client.RemovePlayerFromQueue(message.author.id, message.guild.id);
        embed.addField("Player left the queue.", `<@${message.author.id}> left the queue.`);
        let queue = await client.GetQueue(message.guild.id);
        if(queue.length > 0){
            embed.addField(`Current queue members: ${queue.length}`, await client.PlayerArrayToString(queue));
        } else {
            embed.addField("Queue empty", "There is nobody in the queue.");
        }
        
        await message.channel.send(embed);
    } catch (e){
        
        embed.setTitle("You aren't in the queue!")
        await message.channel.send(embed);
    }
}

module.exports.config = {
    name: "leave",
    description:"Leave the queue.",
    aliases: ["l"]
}