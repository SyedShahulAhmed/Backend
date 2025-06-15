const fs = require('fs');
const os = require('os');
const EventEmitter = require('events'); // ✅ Correct module

class Logger extends EventEmitter {
    log(msg) {
        this.emit('msg', { msg });
    }
}

const logger = new Logger();
const logFile = './event.txt';

const logToFile = (e) => {
    const logMsg = `${new Date().toISOString()}  ${e.msg}\n`; 
    fs.appendFileSync(logFile, logMsg);
};

logger.on('msg', logToFile);

setInterval(() => {
    const memoryUsage = (os.freemem() / os.totalmem()) * 100;
    logger.log(`Current memory usage: ${memoryUsage.toFixed(2)}%`);
}, 3000);

logger.log("Application Started");
logger.log("Application Event Occurred");
