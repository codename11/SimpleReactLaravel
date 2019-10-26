import React from 'react';
import ReactDOM from 'react-dom';

class Addsub extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            videos: null,
            videoId: null,
            subtitle: null,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.select = this.select.bind(this);
    }

    select(e){

        this.setState({
            videoId: e.target.value,
        });

    }

    fileUpload(e) {

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

        formElements.videoId = this.state.videoId;
        formElements.subtitle = forma.elements[forma.elements.length-2].files[0];
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        let myformData = new FormData();

        myformData.append('videoId', formElements.videoId);
        myformData.append('subtitle', formElements.subtitle);
        myformData.append('_token', token);
        myformData.append('message', "bravo");

        $.ajax({
            url: '/addSubToVideo',
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
                
            },
            error: (response) => {

                console.log("error");
                console.log(response);

            }

        });

    }    

    componentDidMount(){
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

        $.ajax({
            url: '/addSubAjax',
            type: 'POST',
            data: {_token: token , message: "bravo"},
            dataType: 'JSON',
    
            success: (response) => { 

                console.log("success");
                console.log(response);

                this.setState({
                    videos: response.videos,
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

        let videos = this.state.videos ? this.state.videos.map((item, index) => {

            return <option key={index} value={item.id}>{item.name.substr(0, 30)+"..."}</option>
                        
        }) : null;

        return (
            <div className="container">
                <form id="addsubToVideo" onSubmit={this.handleSubmit} encType="multipart/form-data">

                    <div className="form-group">
                        <label htmlFor="video">Add sub to movie:</label>
                        <select className="form-control" id="videoId" name="videoId" onChange={this.select} required>
                            {videos}
                        </select>
                    </div>

                    <div className="custom-file mb-3">
                        <input type="file" className="custom-file-input" id="subtitle" name="subtitle" onChange={this.fileUpload} placeholder={"Add subtitle"} required/>
                        <label className="custom-file-label" htmlFor="subtitle">{this.state.subtitle ? this.state.subtitle.fileName : "Add subtitle"}</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                
            </div>
        );
    
    }

}

if(document.getElementById('addsub')){

    ReactDOM.render(<Addsub/>, document.getElementById('addsub'));

}