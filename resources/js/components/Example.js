import React from 'react';
import ReactDOM from 'react-dom';

class Example extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: JSON.parse(this.props.user),
        };

    }

    componentDidMount(){

        $.getJSON('https://ipinfo.io/geo', (response) => { 
            //console.log(response);

            let url = "http://api.openweathermap.org/data/2.5/weather?q="+response.city+","+response.country+"&appid=d42174afed4a1bb7fb19c043dee296b5";

            $.ajax({
                url: url, 
                async: true, 
                success: (data) => {

                    this.setState({
                        ...data,
                    });

                }, 
                error: (data)=>{
                    console.log(data);
                }

            });

        });

    }

    render(){
        
        const user = this.state.user;
        console.log(this.state);
        const temp = this.state.main ? (this.state.main.temp-273.15).toFixed(2) : "";
        
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Data from Laravel to React component</div>
                            
                            <div className="card-body">
                                Currently logged user:{user.name} <br/>
                                Current temperature: {temp}
                            </div>
                            
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
