const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('../config/suggestions.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ 
                    content: 'There was an error executing this command!', 
                    ephemeral: true 
                });
            }
            return;
        }

        // Handle Select Menus, Modals, and Buttons
        if (!interaction.isStringSelectMenu() && !interaction.isModalSubmit() && !interaction.isButton()) return;

        // Handle category selection
        if (interaction.isStringSelectMenu() && interaction.customId === 'suggestion_category') {
            const modal = new ModalBuilder()
                .setCustomId(`suggestion_modal_${interaction.values[0]}`)
                .setTitle('Create Suggestion');

            const titleInput = new TextInputBuilder()
                .setCustomId('suggestion_title')
                .setLabel('Suggestion Title')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const descriptionInput = new TextInputBuilder()
                .setCustomId('suggestion_description')
                .setLabel('Suggestion Description')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descriptionInput)
            );

            await interaction.showModal(modal);
        }

        // Handle modal submission
        if (interaction.isModalSubmit() && interaction.customId.startsWith('suggestion_modal_')) {
            const category = interaction.customId.replace('suggestion_modal_', '');
            const categoryConfig = config.categories.find(c => c.name === category);
            
            const title = interaction.fields.getTextInputValue('suggestion_title');
            const description = interaction.fields.getTextInputValue('suggestion_description');

            const embed = new EmbedBuilder()
                .setTitle(`${categoryConfig.emoji} ${title}`)
                .setDescription(description)
                .setColor('#2f3136')
                .addFields(
                    { name: 'Category', value: category, inline: true },
                    { name: 'Status', value: '📊 Pending', inline: true },
                    { name: 'Votes', value: '👍 0 | 👎 0', inline: true }
                )
                .setFooter({ text: `Suggested by ${interaction.user.tag}` })
                .setTimestamp();

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('suggestion_upvote')
                        .setEmoji('👍')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('suggestion_downvote')
                        .setEmoji('👎')
                        .setStyle(ButtonStyle.Secondary)
                );

            const channel = interaction.client.channels.cache.get(categoryConfig.channelId);
            await channel.send({ embeds: [embed], components: [buttons] });
            await interaction.reply({ content: 'Your suggestion has been submitted!', ephemeral: true });
        }

        // Handle voting
        if (interaction.isButton()) {
            if (interaction.customId === 'suggestion_upvote' || interaction.customId === 'suggestion_downvote') {
                // Get the current embed
                const message = interaction.message;
                const embed = message.embeds[0];
                
                // Parse current votes
                const votesField = embed.fields.find(f => f.name === 'Votes');
                const [upvotes, downvotes] = votesField.value.match(/\d+/g).map(Number);

                // Update votes
                const newUpvotes = interaction.customId === 'suggestion_upvote' ? upvotes + 1 : upvotes;
                const newDownvotes = interaction.customId === 'suggestion_downvote' ? downvotes + 1 : downvotes;

                // Update embed
                embed.fields.find(f => f.name === 'Votes').value = `👍 ${newUpvotes} | 👎 ${newDownvotes}`;

                await message.edit({ embeds: [embed] });
                await interaction.reply({ content: 'Your vote has been recorded!', ephemeral: true });
            }
        }
    }
}; 