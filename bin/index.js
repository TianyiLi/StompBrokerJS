const argv = require('minimist')(process.argv.slice(2))
const { createServer } = require('http')
const StompServer = require('../stompServer')
const port = parseInt(argv['P']) | parseInt(argv['port']) | 61614
if (argv['H'] || argv['help'] || argv['h']) {
    console.log('Usage: stomp-broker [options]')
    console.log('\nOptions:')
    console.log('\t -P, --port [PORT]\tAssign a port to stomp-broker')
    console.log('\t -V, --version\t\tCheck Version of stomp-broker-js')
    console.log('\t -D, --debug\t\tEnable debug mode')

    return
}
if (argv['V'] || argv['version']) {
    let {version} = require('../package.json')
    console.log(version)
    return
}

let server = createServer()
let stompServer = new StompServer({
    server,
    debug: argv['debug'] || argv['D'] ?
        function () { console.log(arguments) } :
        function () { },
    path: argv['path'] || argv['P'] ? argv['path'] | argv['P'] : undefined
})

server.listen(port, function(){
    console.log(`Listening on ${port}`)
})
