module.exports.run = async (client, message, args) => {
    message.reply(`Leaderboards for this server can be found at http://${client.config.server_ip}/leaderboards/${message.guild.id}`);
}
module.exports.config = {
    name:"leaderboard",
    aliases:['leaderboards'],
    description:"View leaderboards."
}
