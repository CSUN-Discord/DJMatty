/*
posts the current queue that's playing
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const {createQueueEmbed, createRows} = require('../global/globalFunctions')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current queue."),
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
      return interaction.followUp({content: "There is no queue."})

    try {
      let startQueue = 0;
      let endQueue = 10;

      const queueMessage = await interaction.followUp({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: createRows(queue)})

      // const userFilter = (input) => input.user.id == interaction.user.id;
      const collector = interaction.channel
          .createMessageComponentCollector({ time: 840000, idle: 30000})
      // .createMessageComponentCollector({ filter: userFilter, time: 840000, idle: 30000})
      collector.on('collect', async input => {
        // console.log(input.user.id)
        // console.log(interaction.user.id)
        try{
          if (input.customId === 'first') {
            startQueue = 0;
            endQueue = startQueue + 10;
          } else if (input.customId === 'previous') {
            startQueue -= 10;

            if (startQueue < 0) {
              startQueue = 0;
              endQueue = startQueue + 10;
            } else
              endQueue -= 10;
          } else if (input.customId === 'next') {
            endQueue += 10;
            if (endQueue > queue.songs.length) {
              endQueue = queue.songs.length;
              startQueue = endQueue - 10;
            }
            else
              startQueue += 10;
          } else if (input.customId === 'last') {
            startQueue = queue.songs.length-10;
            endQueue = queue.songs.length;
          } else if (input.customId === 'shuffle') {
            if (queue != null)
              queue.shuffle();
          } else if (input.customId === 'play') {
            if (queue.isPlaying)
              queue.setPaused(false);
          } else if (input.customId === 'pause') {
            if (queue.isPlaying)
              queue.setPaused(true);
          } else if (input.customId === 'skip') {
            if (queue.isPlaying)
              queue.skip();
          } else if (input.customId === 'repeatQueue') {
            if (queue.isPlaying)
              queue.setRepeatMode(2)
          } else if (input.customId === 'repeatTrack') {
            if (queue.isPlaying)
              queue.setRepeatMode(1)
          } else if (input.customId === 'repeatStop') {
            if (queue.isPlaying)
              queue.setRepeatMode(0)
          } else {
            queue.setVolume(input.values[0]);
          }
          if (queue == null) return;
          if (!queue.isPlaying) {
            await input.update({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
          }
          else
            await input.update({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: createRows(queue)})

        } catch (e) {
          // console.log(e)
        }
      });
      collector.on('end', collected => {
        try {
          queueMessage.edit({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
          // collected.get([...collected.keys()][0]).message.edit({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
        } catch (e) {
          // console.log(e)
        }
      });

    } catch (e) {
      console.log(e)
      return interaction.followUp("There was a problem with printing the queue.")
    }
  },
};
