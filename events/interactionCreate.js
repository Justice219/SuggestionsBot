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
                .setAuthor({ 
                    name: interaction.user.tag, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTitle(`${categoryConfig.emoji} ${title}`)
                .setDescription([
                    '```',
                    description,
                    '```'
                ].join('\n'))
                .setColor('#5865F2') // Discord Blurple color
                .addFields([
                    {
                        name: '**Status**',
                        value: '📊 Pending',
                        inline: true
                    },
                    {
                        name: '**Category**',
                        value: `${categoryConfig.emoji} ${category}`,
                        inline: true
                    },
                    {
                        name: '**Votes**',
                        value: [
                            '```diff',
                            '+ 0 Upvotes',
                            '- 0 Downvotes',
                            '```'
                        ].join('\n'),
                        inline: true
                    }
                ])
                .setFooter({ 
                    text: `Suggestion ID: ${interaction.id}` 
                })
                .setTimestamp();

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('suggestion_upvote')
                        .setEmoji('👍')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Upvote (0)'),
                    new ButtonBuilder()
                        .setCustomId('suggestion_downvote')
                        .setEmoji('👎')
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Downvote (0)')
                );

            const channel = interaction.client.channels.cache.get(categoryConfig.channelId);
            await channel.send({ embeds: [embed], components: [buttons] });
            await interaction.reply({ 
                content: '✅ Your suggestion has been submitted successfully!', 
                ephemeral: true 
            });
        }

        // Handle voting
        if (interaction.isButton()) {
            if (interaction.customId === 'suggestion_upvote' || interaction.customId === 'suggestion_downvote') {
                const message = interaction.message;
                const embed = message.embeds[0];
                
                // Parse current votes from button labels
                const upvotes = parseInt(message.components[0].components[0].label.match(/\d+/)[0]) || 0;
                const downvotes = parseInt(message.components[0].components[1].label.match(/\d+/)[0]) || 0;

                // Update votes
                const newUpvotes = interaction.customId === 'suggestion_upvote' ? upvotes + 1 : upvotes;
                const newDownvotes = interaction.customId === 'suggestion_downvote' ? downvotes + 1 : downvotes;

                // Update embed
                const votesField = embed.fields.find(f => f.name === '**Votes**');
                votesField.value = [
                    '```diff',
                    `+ ${newUpvotes} Upvotes`,
                    `- ${newDownvotes} Downvotes`,
                    '```'
                ].join('\n');

                const newEmbed = EmbedBuilder.from(embed);

                // Update buttons
                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('suggestion_upvote')
                            .setEmoji('👍')
                            .setStyle(ButtonStyle.Success)
                            .setLabel(`Upvote (${newUpvotes})`),
                        new ButtonBuilder()
                            .setCustomId('suggestion_downvote')
                            .setEmoji('👎')
                            .setStyle(ButtonStyle.Danger)
                            .setLabel(`Downvote (${newDownvotes})`)
                    );

                await message.edit({ embeds: [newEmbed], components: [buttons] });
                await interaction.reply({ 
                    content: `✅ You ${interaction.customId === 'suggestion_upvote' ? 'upvoted' : 'downvoted'} the suggestion!`, 
                    ephemeral: true 
                });
            }
        }
    }
}; 