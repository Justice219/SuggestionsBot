const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const acceptCommand = new SlashCommandBuilder()
    .setName('accept-suggestion')
    .setDescription('Accept a suggestion')
    .addStringOption(option =>
        option.setName('message_id')
            .setDescription('The ID of the suggestion message')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('Reason for accepting')
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

const denyCommand = new SlashCommandBuilder()
    .setName('deny-suggestion')
    .setDescription('Deny a suggestion')
    .addStringOption(option =>
        option.setName('message_id')
            .setDescription('The ID of the suggestion message')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('Reason for denying')
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

module.exports = {
    data: [acceptCommand, denyCommand],
    async execute(interaction) {
        const messageId = interaction.options.getString('message_id');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const isAccepting = interaction.commandName === 'accept-suggestion';

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            if (!message.embeds.length) {
                return interaction.reply({ content: 'This message is not a suggestion!', ephemeral: true });
            }

            const oldEmbed = message.embeds[0];
            const newEmbed = EmbedBuilder.from(oldEmbed)
                .setColor(isAccepting ? '#00ff00' : '#ff0000');
            
            // Update the status field
            const statusField = newEmbed.data.fields.find(f => f.name === 'Status');
            statusField.value = isAccepting ? '✅ Accepted' : '❌ Denied';
            
            // Add reason field
            newEmbed.addFields({ name: 'Reason', value: reason });

            await message.edit({ embeds: [newEmbed] });
            await interaction.reply({ 
                content: `Suggestion has been ${isAccepting ? 'accepted' : 'denied'}!`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'Failed to find the suggestion message. Make sure the ID is correct!', 
                ephemeral: true 
            });
        }
    }
}; 