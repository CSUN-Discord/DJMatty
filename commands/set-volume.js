/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-volume")
    .setDescription("Set the volume.")
      .addNumberOption(option =>
        option
            .setName("volume")
            .setDescription("Number from 0 -100")
            .setRequired(true)
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

    let volume = interaction.options.getNumber("volume");

    if (volume > 100) volume = 100;
    if (volume < 0) volume = 0;

    if (queue == null)
      return interaction.followUp({content: "Nothing is playing right now."})
    queue.setVolume(volume);
    return interaction.followUp({content: "Volume has been changed."})

  },
};
