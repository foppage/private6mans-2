module.exports.run = async (client, message, args) => {
    let players = ['226060704233422849','485467366021398528','229523615815696385','177401686627844096','144552272217505792'];
    let queue = new Array();
    for(let i = 0; i < await client.GetTeamSize(message.guild.id) * 2 - 1; i++){
        queue.push(players[i]);
    }
    await client.UpdateQueue(message.guild.id, queue);
    message.reply("Populated queue, quickly Tris queue so the queue pops!");
}

module.exports.config = {
    name:"populate",
    tris_only:true,
    aliases:['p']
}