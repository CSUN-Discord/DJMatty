/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop, but don't disconnect the bot."),
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
    queue.stop();
    return interaction.followUp({content: "Player has stopped."})

  },
};
