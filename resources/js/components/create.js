import React from 'react';
import ReactDOM from 'react-dom';

class Create extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: "",
            weather: "",
            request: "",
            fullFileName: "",
            fileUrl: "",
            fileName: "",
            fileExt: "",
            video: null,
            message: "",
            switch: false,
            remaining: null,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.playPause = this.playPause.bind(this);
        this.videoRef = React.createRef();
        this.trackTime = this.trackTime.bind(this);
        this.volume = this.volume.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
    }

    fullScreen(){

        let elem = this.videoRef.current;
        if (elem.requestFullscreen){
            elem.requestFullscreen();
          } 
          else if (elem.mozRequestFullScreen){ /* Firefox */
            elem.mozRequestFullScreen();
          } 
          else if (elem.webkitRequestFullscreen){ /* Chrome, Safari & Opera */
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

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    fileUpload(e) {

        this.setState({
            fullFileName: e.target.value ? e.target.value.split("\\").pop() : this.state.filePlaceholder,
            fileUrl: e.target.value ? e.target.value : this.state.filePlaceholder,
            fileName: (e.target.value.split("\\").pop()).split(".")[0],
            fileExt: (e.target.value.split("\\").pop()).split(".")[1],
        });
        
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        let forma = e.target;
        let formElements = {};
        formElements.title = forma.elements[0].value;
        formElements.description = forma.elements[1].value;
        formElements.video = forma.elements[2].files[0];

        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        let myformData = new FormData();
        myformData.append('title', formElements.title);
        myformData.append('description', formElements.description);
        myformData.append('video', formElements.video);
        myformData.append('fullFileName', this.state.fullFileName);
        myformData.append('fileUrl', this.state.fileUrl);
        myformData.append('fileName', this.state.fileName);
        myformData.append('fileExt', this.state.fileExt);
        myformData.append('_token', token);
        myformData.append('message', "bravo");
        
        $.ajax({
            url: '/upload',
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

    componentDidMount(){

        $.getJSON('https://ipinfo.io/geo', (response) => { 
        
            let apiKey ="51540f31c56cd698baf3fa00a533d487";
            let location = response.loc.split(",");
            
            let url = "http://api.openweathermap.org/data/2.5/weather?lat="+location[0]+"&lon="+location[1]+"&appid="+apiKey;
            
            $.ajax({
                url: url, 
                async: true, 
                success: (data) => {

                    console.log("success");
                    this.setState({
                        weather: data,
                    });

                }, 
                error: (data)=>{

                    console.log("error");
                    console.log(data);

                }

            });

        });

        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

        $.ajax({
            url: '/infoAjax',
            type: 'POST',
            data: {_token: token , message: "bravo"},
            dataType: 'JSON',
    
            success: (response) => { 

                console.log("success");
                console.log(response);
                this.setState({
                    user: response.user,
                    request: response.request,
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
        const user = this.state.user ? this.state.user : "";
        const temp = this.state.weather.main ? (this.state.weather.main.temp-273.15).toFixed(2) : "";
        
        let PlayPause = this.state.switch ? "fa fa-pause-circle" : "fa fa-play-circle";
        
        let minutes = Math.floor(this.state.remaining/60);
        minutes = (""+minutes).length===1 ? "0"+minutes : minutes;//Checks if mins are one digit by turning it into string that now beasues length, if length is 1(single digit), if it is, then adds zero in front of it.
        let seconds = Math.floor(this.state.remaining%60);
        seconds = (""+seconds).length===1 ? "0"+seconds : seconds;//Same as mins, but for seconds.
        let remainingTime = minutes+" : "+seconds;

        let videoUrl = this.state.video && this.state.video.name ? "/storage/"+this.state.user.name+"'s Videos/"+this.state.video.name : null;
        let video = videoUrl ? <div  className={"videoWrapper"}><video  ref={this.videoRef} preload="auto" autoPlay onTimeUpdate={this.trackTime}>
            <source src={videoUrl} type="video/mp4"/>
            <source src={videoUrl} type="video/ogg"/>
            Your browser does not support the video tag.
            </video>
            <div id="controls">
                
                <button className="btnV" onClick={this.playPause}><i className={PlayPause}></i></button>
                <div className="time">{remainingTime}</div>
                <input type="range" className="custom-range" id="customRange" name="points1" onChange={this.volume}/>
                <div className="time" onClick={this.fullScreen}><i className="fa fa-expand"></i></div>
            
            </div>
        </div> : "";
        
        let message = this.state.message ? ((this.state.message.indexOf("success") > -1) ? <div className={"alert alert-success"}>{this.state.message}</div> : <div className={"alert alert-warning"}>{this.state.message}</div>) : "";
        
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            
                            <div className="card-header">Data from Laravel to React component with Ajax's help</div>
                            <div className="card-body text-center">
                                Currently logged user: {user.name} <br/>
                                Current temperature: {temp}°C <br/><br/>
                                {message}
                                <form onSubmit={this.handleSubmit} encType="multipart/form-data">

                                    <div className="form-group">
                                        <label htmlFor="title">Title:</label>
                                        <input type="text" maxlength="24" className="form-control" name="title" id="title" required/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <textarea className="form-control" rows="5" name="description" id="description" required></textarea>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="customFile" name="video" onChange={this.fileUpload} required/>
                                        <label className="custom-file-label" htmlFor="customFile">{this.state.fullFileName ? this.state.fullFileName : "Choose file"}</label>
                                    </div>

                                    <input className="btn btn-outline-primary" type="submit" value="Submit" />
                                </form>
                                
                                {video}

                            </div>
                            <div className="card-footer">Go at it. Upload an video!</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    
    }

}

if(document.getElementById('create')){

    ReactDOM.render(<Create/>, document.getElementById('create'));

}

