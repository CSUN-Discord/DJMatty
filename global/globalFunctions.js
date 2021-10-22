const {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
module.exports = {
    createQueueEmbed: createQueueEmbed,
    getDuration: getDuration,
    msToTime: msToTime,
    getDescription: getDescription,
    createRows: createRows,
}

function createQueueEmbed (queue, startQueue, endQueue) {
    let nowPlaying;
    let repeating = "";
    let volume = "";

    if (!queue.isPlaying)
        nowPlaying = "Nothing is being played."
    else {
        const ProgressBar = queue.createProgressBar({block: `▬`, arrow: `⚪`});
        if (queue.paused)
            nowPlaying = `⏸ [${queue.nowPlaying.name}](${queue.nowPlaying.url}) - Requested by: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag})\n${ProgressBar.prettier}`
        else
            nowPlaying = `▶ [${queue.nowPlaying.name}](${queue.nowPlaying.url}) - Requested by: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag})\n${ProgressBar.prettier}`
    }

    switch (queue.repeatMode) {
        case 0:
            repeating = `❌`
            break;
        case 1:
            repeating =`🔂`
            break;
        case 2:
            repeating =`🔁`
            break;
    }

    if (queue.volume < 1)
        volume = `🔇`
    else if (queue.volume > 0 && queue.volume < 30)
        volume = `🔈`
    else if (queue.volume > 29 && queue.volume < 60)
        volume = `🔉`
    else if (queue.volume > 59)
        volume = `🔊`

    return new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Music Queue")
        .addFields(
            {name: 'Now Playing', value: `${nowPlaying}`},
            {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
            {name: 'Total Queue Duration', value: `${getDuration(queue, 0, queue.length)}`, inline: true},
            {name: 'Repeating', value: `${repeating}`, inline: true},
            {name: `${volume}`, value: `${queue.volume}`, inline: true},
        )
        .setTimestamp()
        .setDescription(`${getDescription(queue, startQueue, endQueue)}`);
}

function getDuration (queue, startQueue, endQueue) {
    const slicedArray = queue.songs.slice(startQueue, endQueue);
    let duration = 0;
    slicedArray.forEach(song => {
        const time = song.duration; //hh:mm:ss
        let splitTime = time.split(`:`);
        let ms = 0;
        if (splitTime.length === 3) {
            ms = Number(splitTime[0]) * 60 * 60 * 1000 + Number(splitTime[1]) * 60 * 1000 + Number(splitTime[2]) * 1000;
        }
        else  if (splitTime.length === 2) {
            ms = Number(splitTime[0]) * 60 * 1000 + Number(splitTime[1]) * 1000;
        }
        duration += ms
    });
    return msToTime(duration);
}

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days";
}

function getDescription (queue, startQueue, endQueue) {
    let description = ``;
    for (let i = startQueue; i < endQueue; i++) {
        try {
            description += `${i + 1}) \`\`${queue.songs[i].duration}\`\` [${queue.songs[i].name}](${queue.songs[i].url}) - ${queue.songs[i].requestedBy} (${queue.songs[i].requestedBy.tag}) Time Until: \`\`${getDuration(queue, 0, i)}\`\`\n`
        }catch (e) {
            // console.log(e)
        }
    }
    return description;
}

function createRows (queue) {
    let actionRows = [];

    const buttonRow1 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⏪")
                .setCustomId("first")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⬅")
                .setCustomId("previous")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("➡")
                .setCustomId("next")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⏩")
                .setCustomId("last")
        )

    const buttonRow2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("🔀")
                .setCustomId("shuffle")
        )

    if (queue.paused) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("▶")
                    .setCustomId("play")
            )
    } else {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("⏸")
                    .setCustomId("pause")
            )
    }
    buttonRow2
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⏭")
                .setCustomId("skip")
        )
    if (queue.repeatMode === 0) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("🔁")
                    .setCustomId("repeatQueue")
            )
    } else if (queue.repeatMode === 2){
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("🔂")
                    .setCustomId("repeatTrack")
            )
    } else if (queue.repeatMode === 1) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("🚫")
                    .setCustomId("repeatStop")
            )
    }

    const menuRow1 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('volume')
                .setPlaceholder('Select Volume')
                .addOptions([
                    {
                        label: '0',
                        description: 'Set volume to 0.',
                        value: "0",
                    },
                    {
                        label: '5',
                        description: 'Set volume to 5.',
                        value: "5",
                    },
                    {
                        label: '10',
                        description: 'Set volume to 10.',
                        value: "10",
                    },
                    {
                        label: '15',
                        description: 'Set volume to 15.',
                        value: "15",
                    },
                    {
                        label: '20',
                        description: 'Set volume to 20.',
                        value: "20",
                    },
                    {
                        label: '25',
                        description: 'Set volume to 25.',
                        value: "25",
                    },
                    {
                        label: '30',
                        description: 'Set volume to 30.',
                        value: "30",
                    },
                    {
                        label: '35',
                        description: 'Set volume to 35.',
                        value: "35",
                    },
                    {
                        label: '40',
                        description: 'Set volume to 40.',
                        value: "40",
                    },
                    {
                        label: '45',
                        description: 'Set volume to 45.',
                        value: "45",
                    },
                    {
                        label: '50',
                        description: 'Set volume to 50.',
                        value: "50",
                    },
                    {
                        label: '55',
                        description: 'Set volume to 55.',
                        value: "55",
                    },
                    {
                        label: '60',
                        description: 'Set volume to 60.',
                        value: "60",
                    },
                    {
                        label: '65',
                        description: 'Set volume to 65.',
                        value: "65",
                    },
                    {
                        label: '70',
                        description: 'Set volume to 70.',
                        value: "70",
                    },
                    {
                        label: '75',
                        description: 'Set volume to 75.',
                        value: "75",
                    },
                    {
                        label: '80',
                        description: 'Set volume to 80.',
                        value: "80",
                    },
                    {
                        label: '85',
                        description: 'Set volume to 85.',
                        value: "85",
                    },
                    {
                        label: '90',
                        description: 'Set volume to 90.',
                        value: "90",
                    },
                    {
                        label: '95',
                        description: 'Set volume to 95.',
                        value: "95",
                    },
                    {
                        label: '100',
                        description: 'Set volume to 100.',
                        value: "100",
                    },
                ]),
        )
    actionRows.push(buttonRow1)
    actionRows.push(buttonRow2)
    actionRows.push(menuRow1)

    return actionRows;
}