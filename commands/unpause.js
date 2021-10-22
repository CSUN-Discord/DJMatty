/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unpause")
    .setDescription("Unpauses the queue."),
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    interaction.deferReply({fetchReply: true})
    let queue = interaction.client.player.getQueue(interaction.guild.id);

    if (queue == null)
      return interaction.followUp({content: "Nothing is playing right now."})
    if (!queue.isPlaying)
      return interaction.followUp({content: "Nothing is in queue right now."})
    queue.setPaused(false);
    return interaction.followUp({content: `${queue.nowPlaying.name} is resumed.`})

  },
};
