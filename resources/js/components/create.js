import React from 'react';
import ReactDOM from 'react-dom';

class Create extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: "",
            weather: "",
            request: "",
            clip: {},
            thumbnail: {},
            fullFileName: "",
            fileUrl: "",
            fileName: "",
            fileExt: "",
            video: null,
            message: "",
            switch: false,
            remaining: null,
            subtitle: {},

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.playPause = this.playPause.bind(this);
        this.videoRef = React.createRef();
        this.trackTime = this.trackTime.bind(this);
        this.volume = this.volume.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
        this.getCkEditor = this.getCkEditor.bind(this);
    }

    getCkEditor(){
        console.log("got ckeditor");
        CKEDITOR.replace("ckeditor");
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

        this.setState({
            value: event.target.value
        });
        
    }

    fileUpload(e) {

        if(e.target.id==="video"){
            
            let clip = {};
            clip.fullFileName = e.target.value ? e.target.value.split("\\").pop() : this.state.clip.filePlaceholder;
            clip.fileUrl = e.target.value ? e.target.value : this.state.clip.filePlaceholder;
            clip.fileName = (e.target.value.split("\\").pop()).split(".")[0];
            clip.fileExt = (e.target.value.split("\\").pop()).split(".")[1];

            this.setState({
                clip: clip,
            });

        }

        if(e.target.id==="thumbnail"){
            
            let thumbnail = {};
            thumbnail.fullFileName = e.target.value ? e.target.value.split("\\").pop() : this.state.thumbnail.filePlaceholder;
            thumbnail.fileUrl = e.target.value ? e.target.value : this.state.thumbnail.filePlaceholder;
            thumbnail.fileName = (e.target.value.split("\\").pop()).split(".")[0];
            thumbnail.fileExt = (e.target.value.split("\\").pop()).split(".")[1];

            this.setState({
                thumbnail: thumbnail,
            });

        }

        if(e.target.id==="subtitle"){
            
            let subtitle = {};
            subtitle.fullFileName = e.target.value ? e.target.value.split("\\").pop() : this.state.subtitle.filePlaceholder;
            subtitle.fileUrl = e.target.value ? e.target.value : this.state.subtitle.filePlaceholder;
            subtitle.fileName = (e.target.value.split("\\").pop()).split(".")[0];
            subtitle.fileExt = (e.target.value.split("\\").pop()).split(".")[1];

            this.setState({
                subtitle: subtitle,
            });

        }
        
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        let forma = e.target;
        let formElements = {};
        formElements.title = forma.elements[0].value;
        formElements.description = CKEDITOR.instances.ckeditor.getData();
        formElements.thumbnail = forma.elements[2].files[0];
        formElements.video = forma.elements[3].files[0];
        formElements.subtitle = forma.elements[4].files[0];
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        let myformData = new FormData();
        myformData.append('title', formElements.title);
        myformData.append('description', formElements.description);
        myformData.append('thumbnail', formElements.thumbnail);
        myformData.append('video', formElements.video);
        myformData.append('subtitle', formElements.subtitle);
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
        this.getCkEditor();
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
                                        <input type="text" maxLength="24" className="form-control" name="title" id="title" required/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <textarea className="form-control" rows="5" name="description" id="ckeditor" required></textarea>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="thumbnail" name="thumbnail" onChange={this.fileUpload} required/>
                                        <label className="custom-file-label" htmlFor="thumbnail">{this.state.thumbnail.fullFileName ? this.state.thumbnail.fullFileName : "Choose thumbnail"}</label>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="video" name="video" onChange={this.fileUpload} required/>
                                        <label className="custom-file-label" htmlFor="video">{this.state.clip.fullFileName ? this.state.clip.fullFileName : "Choose video"}</label>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="subtitle" name="subtitle" onChange={this.fileUpload}/>
                                        <label className="custom-file-label" htmlFor="subtitle">{this.state.subtitle.fullFileName ? this.state.subtitle.fullFileName : "Choose subtitle(.srt)"}</label>
                                    </div>

                                    <input className="btn btn-outline-primary" type="submit" value="Submit" />
                                </form>

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

