module.exports.run = async (client, message, args) =>{
    let embed = require("../utils/embed")(client);
    if(args.length > 1){
        embed.addField("Too many arguments!", "If you are trying to change the prefix for this server, you must use the command with one argument, that being the prefix you want to change it to.");
        await message.channel.send(embed);
        return;
    }
    if(args.length == 1){
        let allowed = false;
        let perms = ["ADMINISTRATOR", "MANAGE_GUILD"];
        perms.forEach(p =>{
            if(message.member.permissions.has(p)) allowed=true;
        });
        if (!allowed) return message.channel.send(`**Error:** \`No permissions: ${perms.toString()}\``);
        let prefix = args[0];
        try {
            await client.SetPrefix(prefix, message.guild.id);
        }catch (e){
            embed.addField("Something went wrong!", e);
            await message.channel.send(embed);
            return;
        }
        embed.addField("Prefix changed!", `Prefix for this server is now \`${prefix}\`.`);
        await message.channel.send(embed);
        return;
    }
    let prefix = await client.GetPrefix(message.guild.id);
    embed.addField("Command prefix", `Prefix for this server is \`${prefix}\`.`);
    await message.channel.send(embed);
    return;
}

module.exports.config = {
    name:'prefix',
    description:"View or change the prefix for this server."
}