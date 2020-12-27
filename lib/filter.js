const { exec } = require('child_process');

let createGST = function(mcast, port, samplerate, channels){
	let gst = [
		`gst-launch-1.0 -q udpsrc address=${mcast} port=${port}`,
		`application/x-rtp, clock-rate=${samplerate}, channels=${channels}`,
		`rtpjitterbuffer`,
		`rtpL24depay`,
		`audioconvert`,
		`wavenc`,
		`fdsink`
	];

	return gst.join(' ! ');
}

let getffplayfilter = function(title, filter){
	return 'ffplay -hide_banner -loglevel error -window_title "'+title+'" -f lavfi "amovie=/dev/stdin, '+filter+' [out0]"';
}

exports.launchFilter = function(mcast, port, samplerate, channels, type){
	let filter;

	switch(type){
		case 'ebur':
			filter = 'ffplay -hide_banner -loglevel error -window_title "ebur128" -f lavfi "amovie=/dev/stdin,ebur128=video=1:size=1280x720:meter=9:gauge=shortterm:scale=absolute:target=-10[v-ebur][a];[a]showvolume=b=4:w=720:h=30:t=0:dm=3,transpose=2[v-sv];[v-ebur][v-sv]hstack=2[out0]"';
		break;
		case 'spectrum':
			filter = 'ffplay -hide_banner -loglevel error -window_title "spectrum" -f lavfi "amovie=/dev/stdin,asplit [i-sp][i-sv];[i-sp]showspectrum=size=1280x720:slide=scroll:color=rainbow:orientation=horizontal:legend=1:scale=cbrt:start=100:stop=22000[v-sp];[i-sv]showvolume=b=4:w=848:h=30:t=0:dm=3,transpose=2[v-sv];[v-sp][v-sv]hstack=2[out0]"';
		break;
		case 'ahistogram':
			filter = getffplayfilter('ahistogram', 'ahistogram=slide=scroll:dmode=separate')
		break;
		case 'avectorscope':
			filter = getffplayfilter('avectorscope', 'avectorscope=zoom=1.3:rc=2:gc=200:bc=10:rf=1:gf=8:bf=7')
		break;
		case 'showcqt':
			filter = getffplayfilter('showcqt', 'showcqt')
		break;
		case 'showfreqs':
			filter = getffplayfilter('showfreqs', 'showfreqs=cmode=separate')
		break;
		case 'showspatial':
			filter = getffplayfilter('showspatial', 'showspatial')
		break;
		case 'abitscope':
			filter = getffplayfilter('abitscope', 'abitscope')
		break;
		case 'showwaves':
			filter = getffplayfilter('showwaves', 'showwaves=mode=line')
		break;
		case 'aphasemeter':
			filter = 'ffplay -hide_banner -loglevel error -window_title "aphasemeter" -f lavfi "amovie=/dev/stdin, aphasemeter [a][out0], [a] anullsink"';
		break;
		case 'showvolume':
			filter = getffplayfilter('showvolume', 'showvolume=t=0:dm=3')
		break;
		default:
			return;
	}

	exec(createGST(mcast, port, samplerate, channels)+' | '+filter);
}

exports.getFilterTypes = function(){
	return [
		'ebur',
		'spectrum',
		'ahistogram',
		'avectorscope',
		'showcqt',
		'showfreqs',
		'showspatial',
		'abitscope',
		'showwaves',
		'aphasemeter',
		'showvolume'
	];
}