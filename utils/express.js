const express = require("express");
const server = express();
server.set('view engine', 'ejs');


module.exports = async (client) => {
    server.get("/leaderboards/:guild", async (req,res)=>{

        let guild = req.params.guild;
        if(!client.guilds.cache.get(guild)){
            res.end("Guild id " + guild + " doesn't exist, or maybe the bot isn't in the server anymore.");
            return;
        }
        let title = client.guilds.cache.get(guild).name;
        let [rows] = await client.db.query("select user_id, wins, losses from players where guild_id=? and (wins<>0 or losses<>0) order by (wins-losses) desc, wins desc;", [guild]);

        let users = [];
        for(let row of rows){
            let user = {};
            try{
                user.username = (await client.users.fetch(row.user_id)).username;
                user.wins = row.wins;
                user.losses = row.losses;
                users.push(user);
            } catch(e){
                console.log("player doesn't exist");
            }
        }

        res.render('leaderboards.ejs', {title, users});

    });

    server.listen(client.config.port, ()=>{
        console.log(`Server is running on port ${client.config.port}`);
    })


}
