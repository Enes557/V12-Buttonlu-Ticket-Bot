const Discord = require("discord.js");
const db = require("quick.db");
const client = new Discord.Client(); 
const disbut = require('discord-buttons')
    disbut(client);

const express = require("express")
const app = express()
app.get("/errors", (req, res, next) => {
    const errors = JSON.parse(req.body.jsonString)
})
process.on("unhandledRejection", (reason, promise) => {})


//sunucuya katıldığında
   client.on("guildCreate", async guild => {
        guild.owner.send("You or any of your officials added me to the server. To Create a Ticket Message, You Can Enter Any Channel and Type '!create', But Before That, You Have to Set a Channel Category with '!category <cetegory id>'. Good Uses.");
    });



//mesaj fonksiyonu
    client.on('message', async (message) => {
        let args = message.content.trim().split(/ +/g)
        var sunucu = message.guild.id;
        var yetki = message.member.hasPermission('ADMINISTRATOR');
        if (args[0] == "!create") {
                    if(!yetki) return;
            if (!db.get(sunucu)) return message.channel.send('Please Complete Installation. !category <category id>');
            message.delete()
            let button = new disbut.MessageButton()
            .setStyle('blurple')
            .setEmoji("🎫")
            .setLabel('Create')
            .setID('create')      


            const embed = new Discord.MessageEmbed()
    .setColor('#6064f4')
    .setTitle('Ticket Manager')
    .setDescription("You can open a ticket here.\nPlease Do Not Open Unnecessary Ticket!")
    .setFooter('Official Owner of This Server \''+message.guild.owner.user.tag+'\'', 'https://i.hizliresim.com/3kcyfrj.png');


    
            message.channel.send(embed, {buttons:[button]});
        };


//kategori ayarlama fonksiyonu

if (args[0] == "!category") {
            if(!yetki) return;
    if(db.get(sunucu)) return message.channel.send('A Category Has Already Been Added!');
    if(args[1] | typeof args[1] === 'number'){
        if(!yetki) return;
        db.set(sunucu, args[1])
            message.channel.send("Category Added Successfully.");

        }else{
            message.channel.send("Please Enter a Valid Category ID!");

        }};


        if (args[0] == "!reset") {
                    if(!yetki) return;
            if(!db.get(sunucu)) return message.channel.send('No Setting Found to Reset');
        db.delete(sunucu)
        message.channel.send("All Settings Related to This Server Have Been Reset.");
        }


//klasik yardım şeysi işte

        if(args[0] == "!help"){


     const embed = new Discord.MessageEmbed()
    .setColor('#6064f4')
    .setTitle('Help Menu')
    .setDescription("Prefix > !\n\n!create > Creates a ticket creation message\n!category > Opens a ticket channel in the category you specify\n!reset > Reset All Settings")
    .setFooter(client.user.username, 'https://i.hizliresim.com/3kcyfrj.png');
        message.channel.send(embed);    

    }

    
            });


//button için

       client.on('clickButton', async (button) => {
                var sunucu = button.guild.id;
      if (button.id === 'create') {


        button.guild.channels.create("ticket-"+button.clicker.user.username, {
        type: "text",
        parent: db.get(sunucu),
        permissionOverwrites: [
           {
             id: button.guild.roles.everyone, 
             deny: ['VIEW_CHANNEL']
           },
           {
             id: button.clicker.user,
             allow: ['VIEW_CHANNEL']
           }
        ],
      }).then(channel => {
        //ticket kanalına atıcak mesaj
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#f04444')
            .setTitle('New Support Request!')
            .setDescription("We will deal with you as soon as possible.")
                .setFooter(client.user.username, 'https://i.hizliresim.com/3kcyfrj.png');

                 let ticketkapat1 = new disbut.MessageButton()
            .setStyle('red')
            .setEmoji("🗑")
            .setLabel('Close')
            .setID('close')

            channel.send(exampleEmbed, {buttons:[ticketkapat1]});

      })

      }

                  if (button.id === 'close') {
            button.channel.delete()
      }
    });



    client.login("token");