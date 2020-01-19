import React from 'react';

class DeleteModal extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {

        };

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
        
        return (
            <div className="container">

                <button type="button" className='btn btn-outline-danger btn-sm' data-toggle="modal" data-target="#myModalDel">
                    Delete
                </button>

                <div className="modal fade" id="myModalDel">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                        
                            
                            <div className="modal-header">
                                <h4 className="modal-title">Are you sure you want to delete this video?</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            
                            
                            <div className="modal-body">
                                <button className='btn btn-outline-danger btn-sm' onClick={this.props.delete}>Delete</button>
                            </div>
                            
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
        </div>
        );
    
    }

}

export default DeleteModal;