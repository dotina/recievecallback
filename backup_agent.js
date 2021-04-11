const cron = require('node-cron');
const fs = require('fs-extra');

const getDateFormated = (date, type) => {
    const dateString = date.toLocaleDateString(); // e.g. "21/11/2016"
    const time = date.toLocaleTimeString(); // e.g. "08:00:00 AM"
    const timeString = `${time.slice(0,8)} ${time.split(' ')[1]}`
    const datetimeString = `${dateString} ${timeString}`
    switch (type) {
        case 'DATE':
            return dateString
        case 'TIME':
            return timeString
        case 'DATETIME':
            return datetimeString
        default:
            return date.toLocaleString()
    }
}

const backup_task = cron.schedule('* */3 * * *', () => {
    console.log('running backup tasks every 3 hours');
    const timestamp = getDateFormated(new Date(), 'DATETIME').replace(/[\/ :]/gi, '_');
    if (!fs.existsSync(`${__dirname}/logs/backup`)) fs.mkdirSync(`${__dirname}/logs/backup`)

    try {
        if (fs.existsSync(`${__dirname}/logs/successLogs.log`)) fs.moveSync(`${__dirname}/logs/successLogs.log`, `${__dirname}/logs/backup/successLogs_${timestamp}.log`)
        if (fs.existsSync(`${__dirname}/logs/errorLogs.log`)) fs.moveSync(`${__dirname}/logs/errorLogs.log`, `${__dirname}/logs/backup/errorLog_${timestamp}.log`)
    } catch (err) {
        console.log("Error occured while backing up log file " + err)
    }
});

module.exports = { backup_task, getDateFormated }