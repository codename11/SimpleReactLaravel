import React from 'react';
import ReactDOM from 'react-dom';

class Example extends React.Component {
    
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

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.handleChange = this.handleChange.bind(this);

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
                });

                formElements.title = null;
                formElements.description = null;
                formElements.video = null;
                
            },
            error: (response) => {

                console.log("error");
                console.log(response);
                
            }

        });

    }    

    componentDidMount(){

        $.getJSON('https://ipinfo.io/geo', (response) => { 

            let url = "http://api.openweathermap.org/data/2.5/weather?q="+response.city+","+response.country+"&appid=d42174afed4a1bb7fb19c043dee296b5";

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
            url: '/indexAjax',
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
        
        let videoUrl = this.state.video && this.state.video.name ? "/storage/videos/"+this.state.video.name : null;
        let video = videoUrl ? <video width="320" height="240" controls preload="auto" autoPlay>
            <source src={videoUrl} type="video/mp4"/>
            <source src={videoUrl} type="video/ogg"/>
            Your browser does not support the video tag.
        </video> : "";

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            
                            <div className="card-header">Data from Laravel to React component with Ajax's help</div>
                            <div className="card-body text-center">
                                Currently logged user: {user.name} <br/>
                                Current temperature: {temp}°C <br/><br/>

                                <form onSubmit={this.handleSubmit} encType="multipart/form-data">

                                    <div className="form-group">
                                        <label htmlFor="title">Title:</label>
                                        <input type="text" className="form-control" name="title" id="title" required/>
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
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    
    }

}

if(document.getElementById('example')){

    ReactDOM.render(<Example/>, document.getElementById('example'));

}
