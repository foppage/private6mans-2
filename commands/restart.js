const { exec } = require('child_process');
module.exports.run = async (client, message, args) => {
    exec("pm2 restart 6mans2", (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
      
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      })
}

module.exports.config = {
    name:"restart",
    tris_only:true
}