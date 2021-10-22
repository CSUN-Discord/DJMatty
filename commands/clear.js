/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue."),
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    interaction.deferReply({fetchReply: true})
    let queue = interaction.client.player.getQueue(interaction.guild.id);

    if (queue == null || queue.songs.length < 1)
      return interaction.followUp({content: "Nothing to clear."})
    queue.clearQueue();
    return interaction.followUp({content: `The queue is cleared.`})

  },
};
