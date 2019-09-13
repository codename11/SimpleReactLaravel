import React from 'react';
import ReactDOM from 'react-dom';

class Example extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: JSON.parse(this.props.user),
        };
        
    }

    render(){
        
        const user = this.state.user;
        console.log(user);
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Data from Laravel to React component</div>
                            
                            <div className="card-body">{user.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

if(document.getElementById('example')){

    let user = document.getElementById('example').getAttribute('user');
    ReactDOM.render(<Example user={user}/>, document.getElementById('example'));

}
