import React from 'react';
import ReactDOM from 'react-dom';

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
        };
        this.playPause = this.playPause.bind(this);
        this.videoRef = React.createRef();
        this.trackTime = this.trackTime.bind(this);
        this.volume = this.volume.bind(this);
        this.fullScreen = this.fullScreen.bind(this);

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
    }

    trackTime(e){
        this.setState({
            remaining: e.target.duration - e.target.currentTime,
            duration: e.target.duration,
            currentTime: e.target.currentTime,
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
                console.log(response);
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
        console.log(this.state);

        let progress = this.state.currentTime*100/this.state.duration;

        let PlayPause = this.state.switch ? "fa fa-pause-circle" : "fa fa-play-circle";

        let minutes = Math.floor(this.state.remaining/60);
        minutes = (""+minutes).length===1 ? "0"+minutes : minutes;//Checks if mins are one digit by turning it into string that now beasues length, if length is 1(single digit), if it is, then adds zero in front of it.
        let seconds = Math.floor(this.state.remaining%60);
        seconds = (""+seconds).length===1 ? "0"+seconds : seconds;//Same as mins, but for seconds.
        let remainingTime = minutes+" : "+seconds;

        let videoUrl = this.state.video && this.state.video.name ? "/storage/"+this.state.user.name+"'s Videos/"+this.state.video.name : null;

        let video = videoUrl ? <div  className={"videoWrapper"}><video ref={this.videoRef} preload="auto" autoPlay onTimeUpdate={this.trackTime}>
            <source src={videoUrl} type="video/mp4"/>
            <source src={videoUrl} type="video/ogg"/>
            Your browser does not support the video tag.
            </video>
            <div className="progress">
                <div className="progress-bar bg-success" style={{width: progress+"%"}}></div>
            </div>
            <div id="controls">
            
                <button className="btnV" onClick={this.playPause}><i className={PlayPause}></i></button>
                <div className="time">{remainingTime}</div>
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
            </div>
        );
    
    }

}

if(document.getElementById('show')){

    ReactDOM.render(<Show/>, document.getElementById('show'));

}