module.exports = async (client) => {
    console.log("Ready!");
    await (await client.users.fetch(client.config.tris_id)).send("Ready!");
    for(let guild of client.guilds.cache.values()){
        await client.CreateGuild(guild.id);
    }
    setInterval(()=>{
        client.user.setActivity(`${client.users.cache.size.toString()} users in ${client.guilds.cache.size.toString()} servers | !help`);
    }, 10000);
}
