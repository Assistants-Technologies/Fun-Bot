import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

export default {
    name: "docs",
    description: "Uses ai to search docs for an answer!",
    usage: "docs <prompt>",
    data: new SlashCommandBuilder()
        .setName("docs")
        .setDescription("Uses ai to search docs for an answer!")
        .addStringOption((option) =>
            option.setName("query").setDescription("Answer to search for.").setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return
        const query = interaction.options.getString("query")
    }
}
