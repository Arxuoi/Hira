const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.loadCommands();
    }

    loadCommands() {
        const commandsDir = path.join(__dirname, '../commands');
        const categories = fs.readdirSync(commandsDir);

        for (const category of categories) {
            const categoryPath = path.join(commandsDir, category);
            
            if (!fs.statSync(categoryPath).isDirectory()) continue;

            const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                const command = require(filePath);

                if (command.name) {
                    this.commands.set(command.name, command);
                    
                    if (command.aliases) {
                        for (const alias of command.aliases) {
                            this.aliases.set(alias, command.name);
                        }
                    }
                }
            }
        }

        console.log(`✅ Loaded ${this.commands.size} commands`);
    }

    getCommand(name) {
        const commandName = this.aliases.get(name) || name;
        return this.commands.get(commandName);
    }

    getAllCommands() {
        return this.commands;
    }
}

module.exports = new CommandHandler();
