const fs = require("fs-readdir-recursive");
module.exports = (client) => {
    const files = fs("./commands/");
    for(let file of files){
        if(!file.endsWith(".js")) return;
        console.log(`Loading command ${file}`);
        const command = require(`../commands/${file}`);
        client.commands.set(command.config.name, command);
        if(command.config.aliases) command.config.aliases.forEach(a => client.aliases.set(a, command.config.name));
    }
}