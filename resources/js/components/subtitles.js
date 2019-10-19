import React from 'react';
import ReactDOM from 'react-dom';

class Subtitles extends React.Component {
    
    constructor(props) {

        super(props);

    }

    render(){
        
        return (
            <div className={this.props.klasa} dangerouslySetInnerHTML={{ __html: this.props.subLine }} style={this.props.style}>
                
            </div>
        );
    
    }

}

export default Subtitles;