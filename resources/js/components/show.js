import React from 'react';
import ReactDOM from 'react-dom';
import UpdateModal from './updateModal.js';
import DeleteModal from './deleteModal.js';
import Subtitles from './subtitles.js';

const Subtitle = require('subtitle')
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')

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
            permissions: null,
            next: null,
            prev: null,
            surplus: null,
            subtitles: null,
            currentSubs: null,
            subs: null,

        };
        this.playPause = this.playPause.bind(this);
        this.videoRef = React.createRef();
        this.trackTime = this.trackTime.bind(this);
        this.volume = this.volume.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
        this.progressRef = React.createRef();
        this.trackProgress = this.trackProgress.bind(this);
        this.mute = this.mute.bind(this);
        this.delete = this.delete.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.textArea = this.textArea.bind(this);
        this.formClosePurge = this.formClosePurge.bind(this);
        this.modalClose = this.modalClose.bind(this);

        this.currentSubs = this.currentSubs.bind(this);
        this.subLine = this.subLine.bind(this);

    }

    subLine(){

        let s1 = this.state.subtitles.map((item,i) =>{

            if(item.id===Number(this.state.currentSubs.value)){
                return item.text;
            }

        });
        s1 = s1[0];
        let s2 = parse(s1);

        this.setState({
            subs: s2,
        });

    }

    currentSubs(e){

        if(e.target.value){

            this.setState({
                currentSubs: {
                    value: e.target.value,
                    name: e.target.options[e.target.selectedIndex].text,
                },
            },this.subLine);

        }
        else{

            this.setState({
                currentSubs: null,
            });

        }

    }

//Handles update
    modalClose(){

        this.setState({
            thumbnail: null,
        });

    }

    formClosePurge(){

        let forma = document.getElementById("updateForm");
        let len = forma.children.length;
        let formElemArr = [];
        for(let i=0;i<len;i++){

            if(forma.children[i].name){

                formElemArr.push(forma.children[i]);

            }

            if(forma.children[i].children.length>0){
                
                for(let j=0;j<forma.children[i].children.length;j++){
                    
                    if(forma.children[i].children[j].nodeName!=="LABEL"){
                        
                        formElemArr.push(forma.children[i].children[j]);

                    }
                    
                }
                
            }

        }

        if($('#myModal').is(':visible'))console.log("yes");
        this.setState({
            thumbnail: null,
        });

        $('#myModal').modal('hide');
        if(!$('#myModal').is(':visible'))console.log("no");

    }

    textArea(e){
        
        this.setState({
            video: {...this.state.video, description: e.target.value},
        });
        
    }

    handleSubmit() {
        
        let urlId = window.location.href;
        let getaVideoId = urlId.lastIndexOf("/");
        let videoId = urlId.substring(getaVideoId+1, urlId.length);

        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        
        let forma = document.getElementById("updateForm");
        let formElements = {};
        formElements.method = forma.elements[0].value;
        formElements.token = forma.elements[1].value;
        formElements.videoId = forma.elements[2].value;
        formElements.title = forma.elements[3].value;
        formElements.description = CKEDITOR.instances.ckeditor.getData();
        formElements.thumbnail = forma.elements[5].files[0];
        formElements.video = forma.elements[6].files[0];

        let myformData = new FormData();
        myformData.append('method', formElements.method);
        myformData.append('_token', token);
        myformData.append('videoId', formElements.videoId);
        myformData.append('title', formElements.title);
        myformData.append('description', formElements.description);
        myformData.append('thumbnail', formElements.thumbnail);
        myformData.append('video', formElements.video);
        myformData.append('message', "bravo");
        
        $.ajax({
            url: '/uploadUpdate/'+videoId,
            enctype: 'multipart/form-data',
            type: 'POST',
            data: myformData,
            dataType: 'JSON',
            cache: false,
            contentType: false,
            processData: false,
            success: (response) => { 

                console.log("success");
                console.log(response);
                this.setState({
                    video: response.video,
                    user: response.user,
                    message: response.message,
                });

                formElements.title = null;
                formElements.description = null;
                formElements.video = null;
                
            },
            error: (response) => {

                console.log("error");
                console.log(response);
                this.setState({
                    message: response.message,
                });

            }

        });

    }
//
    delete(){

        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

        let urlId = window.location.href;
        let getaVideoId = urlId.lastIndexOf("/");
        let videoId = urlId.substring(getaVideoId+1, urlId.length);
        
        $.ajax({
            url: '/deleteAjax/'+videoId,
            type: 'POST',
            data: {_token: token, message: "bravo", videoId: videoId},
            dataType: 'JSON',
            success: (response) => { 
                console.log("success");
                console.log(response);
                window.location.href = "/list";
            },
            error: (response) => {
                console.log("error");
                console.log(response);
            }
        }); 
        
    }

    mute(){

        this.setState({
            muted: !this.state.muted,
        });

    }

    trackProgress(e){

        let msClick = e.nativeEvent.offsetX;

        let parentWidth = 0;
        let OnePercentOfparentWidth = 0;
        let OnePercentOfmsClick = 0;
        let videoDuration = 0;
        let OnePercentOfvideoDuration = 0;
        let rew = 0;

        if(e.target.id==="progress"){
            
            parent = e.target;
            parentWidth = parent.offsetWidth;
            OnePercentOfparentWidth = parentWidth/100;
            OnePercentOfmsClick = msClick/OnePercentOfparentWidth;
            videoDuration = this.videoRef.current.duration;
            OnePercentOfvideoDuration = videoDuration/100;
            
            rew = OnePercentOfvideoDuration*OnePercentOfmsClick;
            this.videoRef.current.currentTime = rew;

        }

        if(e.target.parentNode.id==="progress"){
            
            parent = e.target.parentNode;
            parentWidth = parent.offsetWidth;
            OnePercentOfparentWidth = parentWidth/100;
            OnePercentOfmsClick = msClick/OnePercentOfparentWidth;
            videoDuration = this.videoRef.current.duration;
            OnePercentOfvideoDuration = videoDuration/100;

            rew = OnePercentOfvideoDuration*OnePercentOfmsClick;
            this.videoRef.current.currentTime = rew;
            
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
                    permissions: response.permissions,
                    next: response.next,
                    prev: response.prev,
                    subtitles: response.subtitles,
                }); 
                
            },
            error: (response) => {
                console.log("error");
                console.log(response);
            }
        }); 

    }

    render(){
        //console.log(this.state.subs);

        let PlayPause = this.state.switch ? "fa fa-pause-circle" : "fa fa-play-circle";

        let minutes = Math.floor(this.state.remaining/60);
        minutes = (""+minutes).length===1 ? "0"+minutes : minutes;//Checks if mins are one digit by turning it into string that now beasues length, if length is 1(single digit), if it is, then adds zero in front of it.
        let seconds = Math.floor(this.state.remaining%60);
        seconds = (""+seconds).length===1 ? "0"+seconds : seconds;//Same as mins, but for seconds.
        let remainingTime = minutes+" : "+seconds;

        let videoUrl = this.state.video && this.state.video.name ? "/storage/"+this.state.user.name+"'s Videos/"+this.state.video.name : null;

        let muted = this.state.muted ? "fas fa-volume-mute" : "fas fa-volume-up";

        let subtitles = this.state.subtitles ? this.state.subtitles.map((item, i)=>{

            return <option key={i} value={item.id}>{item.name}</option>

        }) : null;
        
        /*Stuck here*/
        let currTime = (this.state.currentTime*1000);

        let subLine = (currTime<904) ? "blah" : "trt";
        console.log("****");
        console.log((this.state.currentTime*1000));
        console.log(this.state.subs ? this.state.subs.start : "");
        console.log(subLine);
        console.log(this.state.subs ? this.state.subs.end : "");
        console.log("****");

        let video = videoUrl ? <div  className={"videoWrapper"}>
            <div className="subWrapper">
                <video id="video" ref={this.videoRef} preload="auto" autoPlay onTimeUpdate={this.trackTime} muted={this.state.muted} onClick={this.playPause}>
                <source src={videoUrl} type="video/mp4"/>
                <source src={videoUrl} type="video/ogg"/>
                Your browser does not support the video tag.
                </video>
                <div className="subTitles">subTitles</div>
                <Subtitles subtitles={this.state.subtitles} currentTime={this.state.currentTime} currentSubs={this.state.currentSubs}/>
            </div>

            <div id="progress" onClick={this.trackProgress} className="progress text-center">
                <div id="progress-bar-num" className="progress-bar-num">{Math.round(this.state.width.toFixed(2))+"%"}</div>
                <div id="progress-bar" onClick={this.trackProgress} className="progress-bar bg-success" style={{width: Math.round(this.state.width.toFixed(2))+"%"}}></div>
            </div>
            <div id="controls">
            
                <button className="btnV" onClick={this.playPause}><i className={PlayPause}></i></button>
                <div className="time">{remainingTime}</div>
                <div className="muted" onClick={this.mute}><i className={muted}></i></div>
                <input type="range" className="custom-range" id="customRange" name="points1" onChange={this.volume}/>
                <div className="time" onClick={this.fullScreen}><i className="fa fa-expand"></i></div>
                <div id="subSelect" className="form-group">
                    <select className="form-control" id="subs" onChange={this.currentSubs}>
                        <option value="">Choose subtitles</option>
                        {subtitles}
                    </select>
                </div>
            
            </div>
        </div> : "";

        let UpdateAndDelete = this.state.permissions ? <div className="grid-container2">
                
                <DeleteModal delete={this.delete}/>
                <UpdateModal modalClose={this.modalClose} formClosePurge={this.formClosePurge} textArea={this.textArea} handleSubmit={this.handleSubmit} user={this.state.user} video={this.state.video} token={this.state.token}/>
            
            </div> : "";

        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">

                        <a href='/list' className='btn goback'><i className="fas fa-angle-double-left"></i></a>
                        <div className='nextPrev'>
                            <a href={"/list/"+this.state.prev} className='btn prev'><i className='fas fa-arrow-left'></i></a>
                            <a href={"/list/"+this.state.next} className='btn next'><i className='fas fa-arrow-right'></i></a>
                        </div>
                        {this.state.video.name}

                    </div>
                    <div className="card-body videoCardBody">
                        {video}
                        
                        <hr/>

                            <p className="desc" dangerouslySetInnerHTML={{__html:this.state.video.description}}></p>

                    </div>
                    <div className="card-footer"> 
                        Uploaded by {this.state.user.name} 
                        
                        {UpdateAndDelete}
                        
                    </div>
                </div>
            </div>
        );
    
    }

}

if(document.getElementById('show')){

    ReactDOM.render(<Show/>, document.getElementById('show'));

}