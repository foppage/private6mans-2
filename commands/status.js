module.exports.run = async (client, message, args) =>{
    let embed = require("../utils/embed")(client);
    let queue = await client.GetQueue(message.guild.id);
    if(queue.length==0){
        embed.addField("The queue is empty.", "There are no players in the queue.");
        await message.channel.send(embed);
        return;
    }
    embed.addField(`Current queue members: ${queue.length}`, await client.PlayerArrayToString(await client.GetQueue(message.guild.id)));
    await message.channel.send(embed);
}

module.exports.config = {
    name:"status",
    description:"List the queue members.",
    aliases:['s']
}