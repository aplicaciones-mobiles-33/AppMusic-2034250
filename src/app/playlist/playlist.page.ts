import { Component, OnInit, ViewChild } from '@angular/core';
import{IonRange} from "@ionic/angular";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {
@ViewChild("range", {static: false}) range: IonRange;

songs=[
  {
  title:"Ew",
  subtitle:"Joji",
  img: "/assets/img/joji.png",
  path: "/assets/img/ew-joji.mp3"
  },
  {
    title:"Run",
    subtitle:"Joji",
    img: "/assets/img/joji.png",
    path: "/assets/img/run-joji.mp3"
    },
    {
      title:"Gimme Love",
      subtitle:"Joji",
      img: "/assets/img/joji.png",
      path: "/assets/img/gimmelove-ew.mp3"
      }
    
];
  //Current song details
  currTitle;
  currSubtitle;
  currImage;

  progress=0;
  isPlaying= false;
  isTouched= false;

  currSecsText;
  durationText;
  currRangeTime;
  maxRangeValue;

  currSong: HTMLAudioElement;

  upNextImg;
  upNextTitle;
  upNextSubtitle;
  constructor() { }

  ngOnInit() {
  }
playSong(title,subTitle,img, song){
  if(this.currSong != null){
    this.currSong.pause();
  }
//open full player view
document.getElementById("fullPlayer").style.bottom="0px";
this.currTitle=title;
this.currSubtitle= subTitle;
this.currImage=img;

//Current song audio
this.currSong= new Audio(song);

this.currSong=new Audio(song);

this.currSong.play().then(() => {
  this.durationText = this.sToTime(this.currSong.duration);
  this.maxRangeValue = Number(this.currSong.duration.toFixed(2).toString().substring(0,5));
  var index =this.songs.findIndex(x => x.title == this.currTitle);
  if((index +1) == this.songs.length){
    this.upNextImg=this.songs[0].img;
    this.upNextTitle=this.songs[0].title;
    this.upNextSubtitle=this.songs[0].subtitle;
  }
  else{
    this.upNextImg=this.songs[index + 1].img;
    this.upNextTitle=this.songs[index + 1].title;
    this.upNextSubtitle=this.songs[index + 1].subtitle;
  }

  this.isPlaying=true;

})
this.currSong.addEventListener("timeupdate", () => {
  if (!this.isTouched){
    this.currRangeTime=Number(this.currSong.currentTime.toFixed(2).toString().substring(0,5));
    this.currSecsText=this.sToTime(this.currSong.currentTime);
    this.progress=(Math.floor(this.currSong.currentTime) / Math.floor(this.currSong.duration));

    if(this.currSong.currentTime== this.currSong.duration){
      this.PlayNext();

    }
  }
});
}
sToTime(t){
  return this.padZero(parseInt(String((t/(60)) % 60))) + ":" + this.padZero(parseInt(String((t) % 60)));
}
padZero(v){
  return (v < 10) ? "0" + v : v;

}
PlayNext(){
  var index = this.songs.findIndex(x=> x.title == this.currTitle);
  if((index + 1) == this.songs.length){
    this.playSong(this.songs[0].title, this.songs[0].subtitle, this.songs[0].img, this.songs[0].path);
  }
  else{
    var nextIndex = index + 1;
    this.playSong(this.songs[nextIndex].title,this.songs[nextIndex].subtitle, this.songs[nextIndex].img, this.songs[nextIndex].path);
  }
}
playPrev(){
  var index= this.songs.findIndex(x=>x.title== this.currTitle);
  if(index==0){
    var lastIndex= this.songs.length-1;
    this.playSong(this.songs[lastIndex].title,this.songs[lastIndex].subtitle, this.songs[lastIndex].img, this.songs[lastIndex].path );
  } else{
    var prevIndex= index -1;
    this.playSong(this.songs[prevIndex].title,this.songs[prevIndex].subtitle, this.songs[prevIndex].img, this.songs[prevIndex].path );
  }
}
minimize(){
  document.getElementById("fullPlayer").style.bottom="-1000px";
  document.getElementById("miniPlayer").style.bottom="0px";
}
maximize(){
  document.getElementById("fullPlayer").style.bottom="0px";
  document.getElementById("miniPlayer").style.bottom="-100px";
}
pause(){
  this.currSong.pause();
  this.isPlaying=false;
}
play(){
  this.currSong.play();
  this.isPlaying=true;
}
cancel(){
  document.getElementById("miniPlayer").style.bottom="-100px";
  this.currImage="";
  this.currTitle="";
  this.currSubtitle="";
  this.progress=0;
  this.currSong.pause();
  this.isPlaying=false;
}
 touchStart(){
   this.isTouched=true;
   this.currRangeTime=Number(this.range.value);
 }

 touchMove(){
   this.currSecsText=this.sToTime(this.range.value);
 }
 touchEnd(){
   this.isTouched=false;
   this.currSong.currentTime=Number(this.range.value);
   this.currSecsText=this.sToTime(this.currSong.currentTime)
   this.currRangeTime=Number(this.currSong.currentTime.toFixed(2).toString().substring(0,5));
   if(this.isPlaying){
     this.currSong.play();
   }
 }
}
