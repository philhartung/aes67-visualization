const sdpTransform = require('sdp-transform');

const preParse = function(sdp){
	//check if valid
	sdp = isSupportedStream(sdp);

	//get multicast from connection
	if(sdp.media[0] && sdp.media[0].connection && sdp.media[0].connection.ip){
		sdp.mcast = sdp.media[0].connection.ip.split('/')[0];
	}else if(sdp.connection && sdp.connection.ip){
		sdp.mcast = sdp.connection.ip.split('/')[0];
	}else{
		sdp.mcast = '-';
		sdp.isSupported = false;
	}

	sdp.description = sdp.description ? sdp.description : '';
	if(sdp.description == '' && sdp.media[0].description){
		sdp.description = sdp.media[0].description;
	}

	if(sdp.isSupported){
		sdp.codec = sdp.media[0].rtp[0].codec;
		sdp.samplerate = sdp.media[0].rtp[0].rate;
		sdp.channels = sdp.media[0].rtp[0].encoding;
	}

	return sdp;
}

const isSupportedStream = function(sdp){
	if(sdp.media.length != 1){
		sdp.isSupported = false;
		sdp.unsupportedReason = 'Unsupported media type';
		return sdp;
	}

	if(sdp.media[0].type != 'audio' || sdp.media[0].protocol != 'RTP/AVP'){
		sdp.isSupported = false;
		sdp.unsupportedReason = 'Unsupported media type';
		return sdp;
	}

	if(sdp.media[0].rtp.length != 1){
		sdp.isSupported = false;
		sdp.unsupportedReason = 'Unsupported rtpmap';
		return sdp;
	}

	if(sdp.media[0].rtp[0].rate != 48000 && sdp.media[0].rtp[0].rate != 44100){
		sdp.isSupported = false;
		sdp.unsupportedReason = 'Unsupported samplerate';
		return sdp;
	}

	if(sdp.media[0].rtp[0].codec != 'L24'){
		sdp.isSupported = false;
		sdp.unsupportedReason = 'Unsupported codec';
		return sdp;
	}

	if(sdp.media[0].rtp[0].encoding < 1 || sdp.media[0].rtp[0].encoding > 8){
		sdp.isSupported = false;
		sdp.unsupportedReason = 'Unsupported channel number';
		return sdp;
	}

	sdp.isSupported = true;
	return sdp;
}


exports.parse = function(raw){
	let sdp = sdpTransform.parse(raw);
	return preParse(sdp);
}