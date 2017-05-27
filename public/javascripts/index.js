function $(s){
	return document.querySelectorAll(s)
}
var size=128
var box=$("#box")[0]
var height,width
var canvas=document.createElement("canvas")
var ctx=canvas.getContext("2d")
box.appendChild(canvas)
var lis=$("#list li");
var mv=new MusicVisualizer({
	size:size,
	visualizer:draw,
	onended:function(){
		var lis=$("#list li");
		var r=Math.round(Math.random()*(lis.length-1))
		lis[r].click()
	}
})
function binding(){
	lis=$("#list li");
	for(var i=0;i<lis.length;i++){
		lis[i].onclick=function(){
			for(var j=0;j<lis.length;j++){
				lis[j].className=""
			}
			this.className="selected"
			if(mv.source){
				mv.source.onended=""
			}
			try{
				mv.play("/musics/"+this.title)
			}catch(e){
				alert('e')
			}
			$(".image")[0].getElementsByTagName('img')[0].src="/images/"+this.title+".jpg"
		}
	}
}
binding()
document.getElementById("nextOne").onclick=function(){
	try{
		mv.source.stop()
	}catch(e){
		lis[Math.round(Math.random()*(lis.length-1))].click()
	}
	
}
document.getElementById("stop").onclick=function(){
	try{
		mv.source.onended=""
		mv.source.stop()
		mv.source=null
	}catch(e){
		
	}
	
}
document.getElementById("refresh").onclick=refresh
function refresh(){
	this.onclick=""
	var self=this
	var xhr=new XMLHttpRequest();
	xhr.open("GET","/musiclist")
	xhr.onload=function(){
		var obj=JSON.parse(this.response)
		var onmusicname=$(".selected")[0]?$(".selected")[0].title:''
		var ul=document.getElementById("list")
		ul.innerHTML=""
		for(var i=0;i<obj.length;i++){
			var li=document.createElement("li")
			if(obj[i]==onmusicname){
				li.className="selected"
			}
			li.title=obj[i]
			li.innerHTML=obj[i]
			ul.appendChild(li)
		}
		binding()
		self.onclick=refresh
	}
	xhr.send()
}
//document.body.style.width=window.screen.width+"px"
function resize(){
	document.body.style.height=window.innerHeight+"px"
	height=box.clientHeight-10;
	width=box.clientWidth-10;
	canvas.height=height;
	canvas.width=width;
	var line=ctx.createLinearGradient(0,0,0,height)
	line.addColorStop(0,"red")
	line.addColorStop(0.33,"orange")
	line.addColorStop(0.67,"yellow")
	line.addColorStop(1,"green")
	ctx.fillStyle=line
	//
}
resize()
window.onresize=resize;
function random(m,n){
	return Math.round(Math.random()*(n-m)+m)
}
function getDots(){
	Dots=[]
	for(var i=0;i<size;i++){
		Dots.push({
			cap:0
		})
	}
}
getDots()
function draw(arr){
	//console.log(arr)
	ctx.clearRect(0,0,width,height)
	var w=width/size
	for(var i=0;i<size;i++){
		var o=Dots[i]
		var h=arr[i]/256*height-w*1.2
		if(h>0||o.cap>0){
			ctx.fillRect(w*i+w*0.2,height-h,w*0.8,h)
			ctx.fillRect(w*i+w*0.2,height-o.cap-w*0.8,w*0.8,w*0.8)
		}
		o.cap--;
		if(o.cap<0)
			o.cap=0
		if(h>0){
			o.cap=o.cap<(h+w*0.6)?(h+w*0.4):o.cap
		}
	}
}
$("#volume")[0].onchange=function(){
	mv.changeVolume(this.value/this.max);
}
$("#volume")[0].onchange();