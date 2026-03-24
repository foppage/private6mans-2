module.exports = async (client, message) => {
    if (message.author.bot) return;
    if(message.channel.type!="text") return;
    let prefix =  await client.GetPrefix(message.guild.id);
    message.prefix = prefix;
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.split(" ");
    let command = args.shift();
    command = command.substring(message.prefix.length).toLowerCase();

    let cmd = client.commands.get(command);
    if(!cmd) cmd = client.commands.get(client.aliases.get(command));

    if(!cmd) return;

    if(cmd.config.permissions){
        let allowed = false;
        cmd.config.permissions.forEach(p =>{
            if(message.member.permissions.has(p)) allowed=true;
        });
        if (!allowed) return message.channel.send(`**Error:** \`No permissions: ${cmd.config.permissions.toString()}\``);
    }

    if(cmd.config.tris_only){
        if(message.member.id!==client.config.tris_id) return message.channel.send("You found a **Tris only command**. Unfortunately, since you're not **Tris**, you can't run this command.");
    }

    cmd.run(client, message, args);

};
