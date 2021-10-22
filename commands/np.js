/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("Shows the current song that's playing."),
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

    const ProgressBar = queue.createProgressBar({block: `▬`, arrow: `⚪`});
    const nowPlayingEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(queue.nowPlaying.author)
        .setTitle(`Now Playing: ${queue.nowPlaying.name}`)
        .setURL(queue.nowPlaying.url)
        .setThumbnail(queue.nowPlaying.thumbnail)
        .setTimestamp()
    if (queue.paused)
      nowPlayingEmbed.setDescription(`⏸ Requested By: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag}) \n${ProgressBar.prettier}`)
    else
      nowPlayingEmbed.setDescription(`▶ Requested By: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag}) \n${ProgressBar.prettier}`)

    return interaction.followUp({embeds: [nowPlayingEmbed]})
  },
};
