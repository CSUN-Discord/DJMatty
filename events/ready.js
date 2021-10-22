/*
event that happens on start up to display activity
 */

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    client.user.setActivity("to the radio.", {
      type: "LISTENING",
    });

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
