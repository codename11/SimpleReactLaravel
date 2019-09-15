import React from 'react';
import ReactDOM from 'react-dom';

class Example extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: "",
            weather: "",
        };

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
                    user: response,
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
        const user = this.state.user ? this.state.user : "";
        const temp = this.state.weather.main ? (this.state.weather.main.temp-273.15).toFixed(2) : "";
        
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Data from Laravel to React component</div>
                            <div className="card-body">
                                Currently logged user: {user.name} <br/>
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

    ReactDOM.render(<Example/>, document.getElementById('example'));

}
