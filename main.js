const fs = require('fs');
const { Command } = require('commander');
const sdp = require('./lib/sdp');
const filter = require('./lib/filter');

const program = new Command();
program.version('1.0.0');
program.option('-f, --file <file>', 'Input sdp file');
program.option('-t, --type <type>', 'Visualtization type: '+filter.getFilterTypes().join(', '));

program.parse(process.argv);

let sdpParsed;
if(program.file){
	sdpParsed = sdp.parse(fs.readFileSync(program.file, 'utf-8'));
}else{
	console.error('Please specify input sdp file.');
	program.help();
	process.exit();
}

if(!sdpParsed.isSupported){
	console.error('Unsupported SDP file. Reason:', sdpParsed.unsupportedReason);
	process.exit();
}

if(!program.type){
	console.error('Please specify a visualtization type.');
	program.help();
	process.exit();
}

if(filter.getFilterTypes().indexOf(program.type) === -1){
	console.error('Please specify a valid visualtization type.');
	program.help();
	process.exit();
}

filter.launchFilter(sdpParsed.mcast, sdpParsed.media[0].port, sdpParsed.samplerate, sdpParsed.channels, program.type);