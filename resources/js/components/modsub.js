import React from 'react';
import ReactDOM from 'react-dom';

let click = 0;
class Modsub extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            videos: null,
            subtitles: null,
            subText: null,
            subTextFormId: null,
        };
        this.select = this.select.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCkEditor = this.getCkEditor.bind(this);

    }

    getCkEditor(){
        console.log("got ckeditor");
        CKEDITOR.replace("ckeditor");
    }

    select(e){

        this.handleSubmit(e);
        
    }  

    handleSubmit(e) {
        click++;
        e.preventDefault();

        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        let formId =  e.target.id==="subText" ?  e.target.id : e.target.parentElement.parentElement.id;
        let url = "";
        let formElements = {};
        let myformData = new FormData();

        if(formId==="videos"){
            console.log(formId);
            url = "/modSubOfVideo";
            formElements.videoId = e.target.value;
            myformData.append('videoId', formElements.videoId);

        }
        
        if(formId==="subtitles"){
            console.log(formId);
            url = "/openSubOfVideo";
            formElements.subId = e.target.value;
            
            this.setState({
                subTextFormId: formElements.subId,
            });

            myformData.append('subId', formElements.subId);

        }

        if(formId==="subText"){
            console.log(formId);
            url = "/writeSubOfVideo";
            formElements.subId = e.target.elements[0].value;
            formElements.subText = e.target.elements[1].value;
            console.log(formElements.subId);
            this.setState({
                subText: formElements.subText,
            });

            myformData.append('subText', formElements.subText);
            myformData.append('subId', formElements.subId);
            
        }

        myformData.append('_token', token);
        myformData.append('message', "bravo");
  
        $.ajax({
            url: url,
            enctype: 'multipart/form-data',
            type: 'POST',
            data: myformData,
            dataType: 'JSON',
            cache: false,
            contentType: false,
            processData: false,
            success: (response) => { 
                console.log(click);
                console.log("success");
                
                if(formId==="videos"){
                    
                    this.setState({
                        subtitles: response.subtitles,
                    });
                }
                
                if(formId==="subtitles"){
                    
                    this.setState({
                        subText: response.subText,
                    });
                    this.getCkEditor();
                }
                
                if(formId==="subText"){
                    console.log(response);
                    this.setState({
                        subText: response.subText,
                    });
                }

            },
            error: (response) => {

                console.log("error");
                console.log(response);

            }

        });

    }   

    componentDidMount(){
        //get all videos
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

        $.ajax({
            url: '/addSubAjax',
            type: 'POST',
            data: {_token: token , message: "bravo"},
            dataType: 'JSON',
    
            success: (response) => { 

                console.log("success");
                //console.log(response);

                this.setState({
                    videos: response.videos,
                });
    
            },
            error: (response) => {

                console.log("error");
                //console.log(response);
                
            }

        });

    }

    render(){
        /*console.log("****");
        console.log(this.state);
        console.log("****");*/
        
        let videos = this.state.videos ? this.state.videos.map((item, index) => {

            return <option key={index} value={item.id}>{item.name.substr(0, 30)+"..."}</option>
                        
        }) : null;

        let subs = this.state.subtitles ? this.state.subtitles.map((item, index) => {

            return <option key={index} value={item.id}>{item.name.substr(0, 30)+"..."}</option>
                        
        }) : null;

        let subtitles = subs ? <form id="subtitles" encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="subtitles">Choose sub to modify:</label>
                    <select className="form-control" id="subtitlesId" name="subtitlesId" onChange={this.select} required>
                        {subs}
                    </select>
                </div>
            </form>
        : "";

        let subTextPre = "<pre>"+this.state.subText+"</pre>";
        let subText = this.state.subText ? <form id="subText" onSubmit={this.handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <input type="hidden" name="subId" value={this.state.subTextFormId}/>
                    <label htmlFor="subText">Modify subtitle:</label>
                    <textarea className="form-control" rows="5" id="ckeditor" name="subTextId" defaultValue={subTextPre}/>
                </div>
                <button type="submit" className="btn btn-outline-primary">Submit</button>
            </form>
        : "";

        return (
            <div className="container">
                <form id="videos" encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="video">Choose video:</label>
                        <select className="form-control" id="videoId" name="videoId" onChange={this.select} required>
                            {videos}
                        </select>
                    </div>
                </form>

                {subtitles}

                {subText}

            </div>
        );
    
    }

}

if(document.getElementById('modsub')){

    ReactDOM.render(<Modsub/>, document.getElementById('modsub'));

}