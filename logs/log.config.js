
var logConfig={
	appenders: {
        // ruleConsole: {type: 'console'},
        ruleFile: {
            type: 'file',
            filename: 'logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 1024,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['ruleFile'], level: 'off'}
    }
}
module.exports =logConfig;