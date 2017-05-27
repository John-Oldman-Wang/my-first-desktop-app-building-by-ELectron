function MusicVisualizer(obj){
	this.source=null;
	this.count=0;
	this.analyser=MusicVisualizer.ac.createAnalyser();
	this.size=obj.size;
	this.analyser.fftSize=this.size* 2;
	this.gainNode=MusicVisualizer.ac[MusicVisualizer.ac.createGain?"createGain":"createGainNode"]();
	this.gainNode.connect(MusicVisualizer.ac.destination);
	this.analyser.connect(this.gainNode)
	this.xhr=new XMLHttpRequest();
	this.visualizer=obj.visualizer
	this.visualize()
	this.onended=obj.onended
}
MusicVisualizer.ac=new (window.AudioContext || window.webkitAudioContext)();
MusicVisualizer.prototype.load=function(url,cb){
	this.xhr.open("GET",url)
	this.xhr.responseType="arraybuffer"
	var self=this
	this.xhr.onload=function(){
		cb(self.xhr.response)
	}
	this.xhr.send()
}
MusicVisualizer.prototype.decode=function(arraybuffer,cb){
	MusicVisualizer.ac.decodeAudioData(arraybuffer,function(buffer){
		cb(buffer)
	},function(err){
		console.log(err)
	})
}
MusicVisualizer.prototype.play=function(url){
	var n=++ this.count
	var self=this
	this.stop()
	this.load(url,function(arraybuffer){
		if(n!= self.count) return;
		self.decode(arraybuffer,function(buffer){
			if(n!= self.count) return;
			var bs=MusicVisualizer.ac.createBufferSource()
			bs.connect(self.analyser)
			bs.buffer=buffer;
			bs[bs.start?"start":"noteOn"](0)
			bs.onended=self.onended
			self.source=bs
		})
	})

}
MusicVisualizer.prototype.stop=function(){
	this.source&&this.source[this.source.stop?"stop":"noteOff"](0)
}
MusicVisualizer.prototype.start=function(){
	this.source&&this.source[this.source.start?"start":"noteOn"](0)
}
MusicVisualizer.prototype.changeVolume=function(val){
	var val=parseFloat(val)
	this.gainNode.gain.value=val>1?1:val
}
MusicVisualizer.prototype.visualize=function(){
	var arr=new Uint8Array(this.analyser.frequencyBinCount)
	requestAnimationFrame=window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
	var self=this
	//this.analyser.getByteFrequencyData(arr)
	function v(){
		self.analyser.getByteFrequencyData(arr)
		self.visualizer(arr)
		//console.log(arr)
		requestAnimationFrame(v)
	}
	requestAnimationFrame(v)
}
module.exports=MusicVisualizer