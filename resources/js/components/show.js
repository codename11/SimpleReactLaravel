import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './updateModal.js';

class Show extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            video: "",
            switch: false,
            remaining: null,
            user: "",
            progress: 0,
            duration: 0,
            currentTime: 0,
            muted: false,
            volume: 0,
            width: 0,
            token: null,

        };
        this.playPause = this.playPause.bind(this);
        this.videoRef = React.createRef();
        this.trackTime = this.trackTime.bind(this);
        this.volume = this.volume.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
        this.progressRef = React.createRef();
        this.trackProgress = this.trackProgress.bind(this);
        this.mute = this.mute.bind(this);
        
    }

    mute(){

        this.setState({
            muted: !this.state.muted,
        });

    }

    trackProgress(e){

        let msClick1 = e.pageX;
        let surplus = 26;

        if(e.target.id==="progress-bar"){

            let elemWidth = e.target.offsetWidth; 
            let parentWidth = e.target.parentElement.offsetWidth;
            let rewTime = Math.round(msClick1/(parentWidth/100).toFixed(2));

            this.setState({
                remaining: this.state.duration - ((this.state.duration/100)*rewTime),
                duration: this.state.duration,
                currentTime: ((this.state.duration/100)*rewTime)-surplus,
                width: (elemWidth/(parentWidth/100)),
            });
            this.videoRef.current.currentTime = ((this.state.duration/100)*rewTime)-surplus;

        }

        if(e.target.id==="progress"){

            let childWidth = e.target.childNodes[1].offsetWidth; 
            let myWidth = e.target.offsetWidth;
            let rewTime = Math.round(msClick1/(myWidth/100).toFixed(2));

            this.setState({
                remaining: this.state.duration - ((this.state.duration/100)*rewTime),
                duration: this.state.duration,
                currentTime: ((this.state.duration/100)*rewTime)-surplus,
                width: (childWidth/(myWidth/100)),
            });
            this.videoRef.current.currentTime = ((this.state.duration/100)*rewTime)-surplus;

        }
        
    }

    fullScreen(){

        let elem = this.videoRef.current;
        if(elem.requestFullscreen){
            elem.requestFullscreen();
        } 
        else if(elem.mozRequestFullScreen){ /* Firefox */
            elem.mozRequestFullScreen();
        } 
        else if(elem.webkitRequestFullscreen){ /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } 
        else if (elem.msRequestFullscreen){ /* IE/Edge */
            elem.msRequestFullscreen();
        }

    }

    volume(e){

        this.videoRef.current.volume = e.target.value/100;
        this.setState({
            volume: (e.target.value/100),
            muted: true ? (this.videoRef.current.volume===0) : false,
        });

    }

    trackTime(e){
        this.setState({
            remaining: e.target.duration - e.target.currentTime,
            duration: e.target.duration,
            currentTime: e.target.currentTime,
            width: e.target.currentTime*100/e.target.duration,
        });
    }

    playPause(){

        this.setState({
            switch: !this.state.switch
        });
        
        if(this.videoRef.current.paused){
            this.videoRef.current.play();
        }
        else{
            this.videoRef.current.pause();
        }

    }

    componentDidMount(){
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        
        this.setState({
            token: token,
        });

        let urlId = window.location.href;
        let getaVideoIdId = urlId.lastIndexOf("/");
        let videoId = urlId.substring(getaVideoIdId+1, urlId.length);
        
        $.ajax({
            url: '/showAjax',
            type: 'POST',
            data: {_token: token , message: "bravo", videoId: videoId},
            dataType: 'JSON',
            success: (response) => { 
                console.log("success");
                //console.log(response);
                this.setState({
                    video: response.video,
                    user: response.user,
                }); 
                
            },
            error: (response) => {
                console.log("error");
                console.log(response);
            }
        }); 

    }

    render(){
        //console.log(this.state);
        
        let progress = this.state.currentTime*100/this.state.duration;

        let PlayPause = this.state.switch ? "fa fa-pause-circle" : "fa fa-play-circle";

        let minutes = Math.floor(this.state.remaining/60);
        minutes = (""+minutes).length===1 ? "0"+minutes : minutes;//Checks if mins are one digit by turning it into string that now beasues length, if length is 1(single digit), if it is, then adds zero in front of it.
        let seconds = Math.floor(this.state.remaining%60);
        seconds = (""+seconds).length===1 ? "0"+seconds : seconds;//Same as mins, but for seconds.
        let remainingTime = minutes+" : "+seconds;

        let videoUrl = this.state.video && this.state.video.name ? "/storage/"+this.state.user.name+"'s Videos/"+this.state.video.name : null;

        let muted = this.state.muted ? "fas fa-volume-mute" : "fas fa-volume-up";

        let video = videoUrl ? <div  className={"videoWrapper"}><video ref={this.videoRef} preload="auto" autoPlay onTimeUpdate={this.trackTime} muted={this.state.muted}>
            <source src={videoUrl} type="video/mp4"/>
            <source src={videoUrl} type="video/ogg"/>
            Your browser does not support the video tag.
            </video>
            <div id="progress" onClick={this.trackProgress} className="progress text-center">
                <div className="progress-bar-num">{Math.round(progress.toFixed(2))+"%"}</div>
                <div id="progress-bar" onClick={this.trackProgress} className="progress-bar bg-success" style={{width: Math.round(progress.toFixed(2))+"%"}}></div>
            </div>
            <div id="controls">
            
                <button className="btnV" onClick={this.playPause}><i className={PlayPause}></i></button>
                <div className="time">{remainingTime}</div>
                <div className="muted" onClick={this.mute}><i className={muted}></i></div>
                <input type="range" className="custom-range" id="customRange" name="points1" onChange={this.volume}/>
                <div className="time" onClick={this.fullScreen}><i className="fa fa-expand"></i></div>
            
            </div>
        </div> : "";

        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">{this.state.video.name}</div>
                    <div className="card-body videoCardBody">{video}</div>
                    <div className="card-footer"> Uploaded by {this.state.user.name}</div>
                </div>
                <Modal user={this.state.user} video={this.state.video} token={this.state.token}/>
            </div>
        );
    
    }

}

if(document.getElementById('show')){

    ReactDOM.render(<Show/>, document.getElementById('show'));

}