/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove tracks from the queue.")
      .addNumberOption(option =>
          option
              .setName("queue-position")
              .setDescription("Position of the song in the queue.")
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

    const queuePosition = interaction.options.getNumber("queue-position");

    if (queue == null)
      return interaction.followUp({content: "Nothing in queue."})
    if (queue.songs.length < 1)
      return interaction.followUp({content: "Nothing in queue."})
    const song = queue.remove(queuePosition-1);
    if (song != null)
      return interaction.followUp({content: `Removed song: ${song.name} at position: ${queuePosition}`})
    return interaction.followUp({content: `Could not remove song.`})

  },
};
