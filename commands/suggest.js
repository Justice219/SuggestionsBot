const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('../config/suggestions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Create a new suggestion'),

    async execute(interaction) {
        // Create category selection menu
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('suggestion_category')
                    .setPlaceholder('Select a category')
                    .addOptions(
                        config.categories.map(category => ({
                            label: category.name,
                            value: category.name,
                            emoji: category.emoji
                        }))
                    )
            );

        await interaction.reply({
            content: 'Please select a category for your suggestion:',
            components: [row],
            ephemeral: true
        });
    }
}; 