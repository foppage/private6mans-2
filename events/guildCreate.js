module.exports = async (client, guild) =>{
    await client.CreateGuild(guild.id);
    await (await client.users.fetch(client.config.tris_id)).send(`Joined ${guild.name}: ${guild.memberCount} members`);
}