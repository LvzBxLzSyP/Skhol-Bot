const { client } = require('../../../bot');
const { developerID, logChannelID } = require('../../../config');

module.exports = {
    name: 'unhandledRejection',
    process: true,
    async execute(error) {
        console.error('[錯誤] 發生了錯誤！', error);

        const logChannel = client.channels.cache.get(logChannelID);

        // 確保 error 有 stack，沒有就轉成字串
        let stackText = '';
        if (error instanceof Error) {
            stackText = error.stack || String(error);
        } else {
            stackText = typeof error === 'string' ? error : JSON.stringify(error, null, 2);
        }

        // 分割成行，避免過長
        const stackLines = stackText.split('\n');
        const shortError = stackLines.slice(0, 3).concat(['...']).concat(stackLines.slice(-2)).join('\n');

        const developers = developerID.map(devUser => `<@${devUser}>`).join(' ');
        const logEmbed = {
            title: ':x: 錯誤內容',
            description: `\`\`\`${shortError}\`\`\``,
            timestamp: new Date().toISOString(),
            color: 0xE74C3C,
        };

        if (logChannel) {
            logChannel.send({ content: `${developers} 發生了錯誤！`, embeds: [logEmbed] });
        } else {
            console.error('[錯誤] 找不到 logChannel，無法傳送訊息。');
        }
    }
};