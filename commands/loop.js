/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop track, queue, or turn it off.")
      .addStringOption(option =>
          option
              .setName("mode")
              .setDescription("Loop track, queue, or turn it off.")
              .setRequired(true)
              .addChoice("track", "track")
              .addChoice("queue", "queue")
              .addChoice("off", "off"),
      ),

  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    interaction.deferReply({fetchReply: true})
    let queue = interaction.client.player.getQueue(interaction.guild.id);
    const mode = interaction.options.getString("mode");

    if (queue == null)
      return interaction.followUp({content: "Nothing is playing right now."})
    if (!queue.isPlaying)
      return interaction.followUp({content: "Nothing is playing right now."})
    switch (mode) {
      case "track":
        queue.setRepeatMode(1)
        return interaction.followUp({content: `${queue.nowPlaying.name} is looped.`})
      case "queue":
        queue.setRepeatMode(2)
        return interaction.followUp({content: "Queue is looped."})
      case "off":
        queue.setRepeatMode(0)
        return interaction.followUp({content: "Loop is turned off."})
    }
  },
};
