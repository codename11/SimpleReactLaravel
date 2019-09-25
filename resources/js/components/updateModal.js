import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: {},
            clip: {},
            thumbnail: {},
            fullFileName: "",
            video: {},
            message: "",
            token: null,

        };
        //this.videoRef = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.setStateOnModal = this.setStateOnModal.bind(this);
        this.textArea = this.textArea.bind(this);
        this.formClosePurge = this.formClosePurge.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.getCkEditor = this.getCkEditor.bind(this);
    }

    getCkEditor(){
        console.log("got ckeditor");
        CKEDITOR.replace("ckeditor");
    }

    modalClose(){

        this.setState({
            thumbnail: null,
        });

    }

    formClosePurge(e){

        let len = e.target.parentNode.children.length;
        let formElemArr = [];
        for(let i=0;i<len;i++){

            if(e.target.parentNode.children[i].name){

                formElemArr.push(e.target.parentNode.children[i]);

            }

            if(e.target.parentNode.children[i].children.length>0){
                
                for(let j=0;j<e.target.parentNode.children[i].children.length;j++){
                    
                    if(e.target.parentNode.children[i].children[j].nodeName!=="LABEL"){
                        
                        formElemArr.push(e.target.parentNode.children[i].children[j]);

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

        console.log(formElemArr);

    }

    textArea(e){
        
        this.setState({
            video: {...this.state.video, description: e.target.value},
        });
        
    }

    setStateOnModal(){
        this.getCkEditor();
        this.setState({
            video: this.props.video,
            user: this.props.user,
            token: this.props.token,
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
            console.log(thumbnail);
        }
        
    }
    
    handleSubmit(e) {
        e.preventDefault();

        let urlId = window.location.href;
        let getaVideoId = urlId.lastIndexOf("/");
        let videoId = urlId.substring(getaVideoId+1, urlId.length);
        
        let forma = e.target;
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
        myformData.append('_token', formElements.token);
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
                /*this.setState({
                    video: response.video,
                    user: response.user,
                    message: response.message,
                });*/

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

        this.setState({
            video: this.props.video,
            user: this.props.user,
            token: this.props.token,
        });

    }

    render(){

        //console.log(this.state);
        const thumbHolder = (this.state.thumbnail && Object.entries(this.state.thumbnail).length !== 0) ? this.state.thumbnail.fullFileName : (this.state.video.thumbnail ? this.state.video.thumbnail : "Choose thumbnail");
        
        return (
            <div className="container" style={{paddingLeft: "0px"}}>

                <button type="button" style={{float: "left"}} className="btn btn-outline-success btn-sm" data-toggle="modal" data-target="#myModal" onClick={this.setStateOnModal}>
                    Update
                </button>

                <div className="modal fade" id="myModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        
                            <div className="modal-header">
                                <h4 className="modal-title">Update video post</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            
                            <div className="modal-body">
                                
                                <form onSubmit={this.handleSubmit} encType="multipart/form-data">

                                <input type="hidden" name="_method" value="PUT"/>
                                <input type="hidden" name="_token" defaultValue={this.state.token}/>
                                <input id="videoId" type="hidden" name="videoId" defaultValue={this.state.video.id}/>

                                    <div className="form-group">
                                        <label htmlFor="title">Title:</label>
                                        <input type="text" maxLength="24" className="form-control" name="title" id="title" required defaultValue={this.state.video.title}/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <textarea className="form-control" rows="5" name="description" id="ckeditor" onChange={this.textArea} required value={this.state.video.description}/>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="thumbnail" name="thumbnail" onChange={this.fileUpload} placeholder={thumbHolder}/>
                                        <label className="custom-file-label" htmlFor="thumbnail">{thumbHolder}</label>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="video" name="video" onChange={this.fileUpload} placeholder={this.state.video.name} disabled/>
                                        <label className="custom-file-label" htmlFor="video">{this.state.video.name ? this.state.video.name : "Choose video"}</label>
                                    </div>

                                    <input className="btn btn-outline-primary" type="submit" value="Submit" onClick={this.formClosePurge}/>

                                </form>

                            </div>
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.modalClose}>Close</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
        );
    
    }

}

export default Modal;
