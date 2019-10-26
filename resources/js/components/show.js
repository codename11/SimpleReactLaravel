import React from 'react';
import ReactDOM from 'react-dom';
import UpdateModal from './updateModal.js';
import DeleteModal from './deleteModal.js';
import Subtitles from './subtitles.js';

const Subtitle = require('subtitle')
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')

let subTimer = null;

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
            line: null,
            firstSub: null,

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

        this.wrapRef = React.createRef();

        this.ifEscapeIsPressed = this.ifEscapeIsPressed.bind(this);
        this.switch = this.switch.bind(this);
    }

    switch(){

        this.setState({
            switch: !this.state.switch
        },this.playPause());
        
    }

    subLine(){

        let s1 = this.state.subtitles.map((item,i) =>{
            
            if(item.id===Number(this.state.currentSubs.value)){
                
                return item.text;
            }

        });

        let filtered = s1.filter(function (el) {
            return el != undefined;
        });

        s1 = filtered[0];

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
                subs: null,
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

        if($('#myModal').is(':visible'))console.log("modal is visible.");
        this.setState({
            thumbnail: null,
        });

        $('#myModal').modal('hide');
        if(!$('#myModal').is(':visible'))console.log("modal is not visible.");

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
        let elem1 = this.wrapRef.current;

        if(elem1.requestFullscreen){
            elem1.requestFullscreen();
        } 
        else if(elem1.mozRequestFullScreen){
            elem1.mozRequestFullScreen();
        } 
        else if(elem1.webkitRequestFullscreen){
            elem1.webkitRequestFullscreen();
        } 
        else if (elem1.msRequestFullscreen){
            elem1.msRequestFullscreen();
        }

        elem.controls = true;
        
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

        let currTime = (this.state.currentTime*1000);//In ms.
        let inc = 0;

        if(this.state.subs){
            
            let subDur = 0;
    
            while(inc<this.state.subs.length){
                subDur = this.state.subs[inc].end-this.state.subs[inc].start;
                
                let start = this.state.subs[inc].start;
                let end = this.state.subs[inc].end;

                if(currTime<=end && currTime>=start){
                    
                    this.setState({
                        line: this.state.subs[inc].text,
                    });

                }

                if(currTime>=end){

                    this.setState({
                        line: "",
                    });

                }

                inc++;
            }
                
        }

    }

    playPause(){

        if(this.state.switch === false){
            this.videoRef.current.pause();
        }

        if(this.state.switch === true){
            this.videoRef.current.play();
        }
        
    }

    ifEscapeIsPressed(){
        let elem = this.videoRef.current;
        elem.controls = false;
    }

    componentDidMount(){

        document.addEventListener("keyup", (e) => {

            if(e.key===" "){
                
                this.switch();

            }
            
        });

        document.addEventListener("fullscreenchange", (e) => {

            if(document.webkitIsFullScreen === false){
                this.ifEscapeIsPressed();
            }
            else if(document.mozFullScreen === false){
                this.ifEscapeIsPressed();
            }
            else if(document.msFullscreenElement === false){
                this.ifEscapeIsPressed();
            }

        });
        
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
                console.log(response);
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
        //console.log(this.state);

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

        let video = videoUrl ? <div ref={this.wrapRef}  className={"videoWrapper"}>
            <div className="subWrapper">
                <video id="video" ref={this.videoRef} preload="auto" autoPlay onTimeUpdate={this.trackTime} muted={this.state.muted} onClick={this.switch}>
                <source src={videoUrl} type="video/mp4"/>
                <source src={videoUrl} type="video/ogg"/>
                Your browser does not support the video tag.
                </video>
                <Subtitles klasa="subTitles" subtitles={this.state.subtitles} currentTime={this.state.currentTime} currentSubs={this.state.currentSubs} subLine={this.state.line} />
            </div>

            <div id="progress" onClick={this.trackProgress} className="progress text-center">
                <div id="progress-bar-num" className="progress-bar-num">{Math.round(this.state.width.toFixed(2))+"%"}</div>
                <div id="progress-bar" onClick={this.trackProgress} className="progress-bar bg-success" style={{width: Math.round(this.state.width.toFixed(2))+"%"}}></div>
            </div>
            <div id="controls">
            
                <button className="btnV" onClick={this.switch}><i className={PlayPause}></i></button>
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
                <UpdateModal firstSub={this.state.subtitles[0]} modalClose={this.modalClose} formClosePurge={this.formClosePurge} textArea={this.textArea} handleSubmit={this.handleSubmit} user={this.state.user} video={this.state.video} token={this.state.token}/>
            
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