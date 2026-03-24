const { MessageEmbed } = require("discord.js");
module.exports = (client) =>{
    let embed = new MessageEmbed()
        .setColor(client.config.embed_colour)
        .setFooter("@Private6Mans | Bot created by @Gingertris1");
        //.setThumbnail(client.user.displayAvatarURL);
    return embed;
}
