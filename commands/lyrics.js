/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { MessageEmbed, Util} = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Prints lyrics of current song."),
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
      return interaction.followUp({content: "Nothing is playing right now."})

    const name = queue.nowPlaying.name;
    const url = new URL(`https://some-random-api.ml/lyrics`);
    url.searchParams.append("title", name);

    try {
      const { data } = await axios.get(url.href);

      const lyrics = data.lyrics;

      const [first, ...rest] = Util.splitMessage(lyrics);

      const msg = new MessageEmbed({
        title: `${data.title} - ${data.author}`,
        thumbnail: { url: data.thumbnail.genius },
        description: first,
      });

      interaction
          .followUp({
            embeds: [msg],
          })
          .then((r) => {
            // Max characters were reached so send the rest of the lyrics
            if (rest.length) {
              for (const text of rest) {
                // send the rest of the lyrics
                const msg = new MessageEmbed({
                  description: text,
                });
                interaction.followUp({
                  embeds: [msg],
                });
              }
            }
          });
    } catch (e) {
      await interaction.followUp({ content: "Song lyrics not found." });
      console.log(e);
    }
  },
};
