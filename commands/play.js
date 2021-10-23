/*
plays a playlist or song
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

const {getDuration} = require('../global/globalFunctions')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Supports Youtube, Spotify, and Apple.")
      .addStringOption(option =>
        option
            .setName("name")
            .setDescription("Song/Playlist name or link.")
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

    const songName = interaction.options.getString("name");

    let queue = interaction.client.player.getQueue(interaction.guild.id);

    if (queue == null)
      queue = interaction.client.player.createQueue(interaction.guild.id);
    try {
      await queue.join(interaction.member.voice.channel);
    } catch (e) {
      return interaction.followUp({content: "Join a voice channel."})
    }
    let playlistSong = null;
    let song = null;

    playlistSong = await queue.playlist(songName, {requestedBy: interaction.user}).catch(async playlistResponse => {
      console.log(playlistResponse)
      song = await queue.play(songName, {requestedBy: interaction.user}).catch(songResponse => {
        console.log(songResponse)
        return interaction.followUp({content: "There was a problem playing this track."})
      });
    });

    const addedEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTimestamp()

    if (song != null) {
      try {
        addedEmbed
            .setTitle(`${song.name} was added to the queue.`)
            .setURL(`${song.url}`)
            .setAuthor(`${song.author}`)
            .setThumbnail(`${song.thumbnail}`)
            .setDescription(`${song.requestedBy} (${song.requestedBy.tag})`)
            .addFields(
                {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
                {name: 'Song Duration', value: `${song.duration}`, inline: true},
                {name: 'Total Queue Duration', value: `${getDuration(queue, 0, queue.songs.length)}`, inline: true}
            )
        return interaction.followUp({embeds: [addedEmbed]})
      } catch (e) {
        console.log(e)
        return interaction.followUp({content: "There was a problem adding to the queue."})
      }
    }
    else if (playlistSong != null) {
      try {
        addedEmbed
            .setTitle(`${playlistSong.name} was added to the queue.`)
            .setURL(`${playlistSong.url}`)
            .setDescription(`${playlistSong.songs.length} new songs were added\n${playlistSong.songs[0].requestedBy} (${playlistSong.songs[0].requestedBy.tag})`)
            .addFields(
                {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
                {name: 'Playlist Duration', value: `${getDuration(playlistSong, 0, playlistSong.songs.length)}`, inline: true},
                {name: 'Total Queue Duration', value: `${getDuration(queue, 0, queue.songs.length)}`, inline: true}
            )
        return interaction.followUp({embeds: [addedEmbed]})
      } catch (e) {
        console.log(e)
        return interaction.followUp({content: "There was a problem adding to the queue."})
      }
    }
    else {
      console.log("Not song or playlist")
      return interaction.followUp({content: "There was a problem adding to the queue."})
    }
  },
};
