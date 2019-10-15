import React from 'react';

class UpdateModal extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            thumbnail: {},
            fullFileName: "",
            message: "",
            token: null,

        };
        this.getCkEditor = this.getCkEditor.bind(this);
        this.setStateOnModal = this.setStateOnModal.bind(this);
        
    }

    getCkEditor(){
        console.log("got ckeditor");
        let editor = CKEDITOR.instances["ckeditor"];
        if (editor) { 
            editor.destroy(true); 
        }
        CKEDITOR.replace("ckeditor");
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

    render(){

        //console.log(this.state);
        const thumbHolder = (this.props.video.thumbnail && Object.entries(this.props.video.thumbnail).length !== 0) ? this.props.video.thumbnail : (this.props.video.thumbnail ? this.props.video.thumbnail : "Choose thumbnail");
        const description = (this.state && this.props.video && this.props.video.description) ? this.props.video.description : "";

        return (
            <div className="container" style={{paddingLeft: "0px"}}>

                <button type="button" style={{float: "left"}} className="btn btn-outline-success btn-sm" data-toggle="modal" data-target="#myModal" onClick={this.setStateOnModal}>
                    Update
                </button>

                <div className="modal fade" id="myModal">
                    <div className="modal-dialog full_modal-dialog">
                        <div className="modal-content">
                        
                            <div className="modal-header">
                                <h4 className="modal-title">Update video post</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            
                            <div className="modal-body">
                                
                                <form id="updateForm" method='POST' encType="multipart/form-data">

                                <input type="hidden" name="_method" value="PUT"/>
                                <input type="hidden" name="_token" defaultValue={this.props.token}/>
                                <input id="videoId" type="hidden" name="videoId" defaultValue={this.props.video.id}/>

                                    <div className="form-group">
                                        <label htmlFor="title">Title:</label>
                                        <input type="text" maxLength="24" className="form-control" name="title" id="title" required defaultValue={this.props.video.title}/>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <textarea className="form-control" rows="5" name="description" id="ckeditor" onChange={this.props.textArea} required value={description ? description : ""}/>
                                    </div>
                                    
                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="thumbnail" name="thumbnail" placeholder={thumbHolder}/>
                                        <label className="custom-file-label" htmlFor="thumbnail">{thumbHolder}</label>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="video" name="video" placeholder={this.props.video.name} disabled/>
                                        <label className="custom-file-label" htmlFor="video">{this.props.video.name ? this.props.video.name : "Choose video"}</label>
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="subtitle" name="subtitle" onChange={this.fileUpload}/>
                                        <label className="custom-file-label" htmlFor="subtitle">{this.state.clip && this.state.clip.fullFileName ? this.state.clip.fullFileName : "Choose subtitle(.srt)"}</label>
                                    </div>

                                </form>

                            </div>
                            
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" style={{position: "absolute", left: "0px", marginLeft: "1rem"}} onClick={()=>{this.props.handleSubmit();this.props.formClosePurge();}} data-dismiss='modal'>Update</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.props.modalClose}>Close</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
        );
    
    }

}

export default UpdateModal;
