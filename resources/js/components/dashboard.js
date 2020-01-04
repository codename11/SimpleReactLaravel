import React from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: "",
            weather: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    
    handleSubmit(e) {
        e.preventDefault();

    }    

    componentDidMount(){

        $.getJSON('https://ipinfo.io/geo', (response) => { 

            let apiKey ="51540f31c56cd698baf3fa00a533d487";
            let location = response.loc.split(",");
            
            let url = "https://api.openweathermap.org/data/2.5/weather?lat="+location[0]+"&lon="+location[1]+"&appid="+apiKey;

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
            url: '/dashboardInfo',
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
        const temp = this.state.weather.main ? (this.state.weather.main.temp-273.15).toFixed(2) : "";
        let tempText = "";

        if(temp > 30){
            tempText = "It is rather hot";
        }
        else if(temp < 25 && temp > 20){
            tempText = "It's quite nice";
        }
        else if(temp < 20 && temp > 10){
            tempText = "It's starting to get chilly at";
        }
        else if(temp < 10){
            tempText = "It is going to be quite cold at";
        }

        return (
            <div className="container">

                <div className="card">
                    <div className="card-header">Hello {this.state.user.name}! {tempText} {temp}°C</div>
                    <div className="card-body">

                    <button className="btn btn-outline-success">
                        <a className="nav-link" href="/create">Upload an Video</a>
                    </button>

                    </div> 
                    <div className="card-footer">Go at it. Upload an video!</div>
                </div>

            </div>
        );
    
    }

}

if(document.getElementById('dashboard')){

    ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));

}
