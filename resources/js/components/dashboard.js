import React from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            user: "",
            weather: "",
            users: null,
            clickedRowData: {
                id: null,
                name: null,
                email: null,
                email_verified_at: null,
                created_at: null,
                updated_at: null,
                avatar: null,
                role_id: null,
            },
            permission: null,
            checkedRadioVal: null,
            changedUserIndex: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getRowData = this.getRowData.bind(this);
        this.updateUserRole = this.updateUserRole.bind(this);
        this.checkRadio = this.checkRadio.bind(this);
    }
    
    checkRadio(e){

        this.setState({
            checkedRadioVal: e.target.value,
        });

    }
    
    updateUserRole(e){
        e.preventDefault();
        let forma = e.target;
        let user_id = forma.elements[0].value;
        let role_id = null;
        
        let radios = document.getElementsByName('role_id');
        for(let i=0;i<radios.length;i++){

            if(radios[i].checked){

                role_id = radios[i].value;

            }

        }

        if(role_id){

            let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

            $.ajax({
                url: '/updateRole',
                type: 'POST',
                data: {_token: token , message: "bravo", user_id: user_id, role_id: role_id},
                dataType: 'JSON',
        
                success: (response) => { 

                    console.log("success");
                    //console.log(response);
                    let changedUserIndex = 0;
                    for(let i=0;i<this.state.users.length;i++){

                        if(""+this.state.users[i].id===this.state.clickedRowData.id){
                            changedUserIndex = i;
                        }

                    }

                    let arr = [...this.state.users];
                    arr[changedUserIndex].role_id=role_id;
                    this.setState({
                        users: [...arr],
                        changedUserIndex: changedUserIndex,
                    });
        
                },
                error: (response) => {

                    console.log("error");
                    console.log(response);
                    
                }

            });

        }
        
    }

    getRowData(e){

        let row = e.target.parentElement;
        let len = row.cells.length;

        let rowUser = [];

        for(let i=0;i<len;i++){

            rowUser.push(row.cells[i].innerHTML);

        }

        this.setState({
            clickedRowData: {
                id: rowUser[0],
                name: rowUser[1],
                email: rowUser[2],
                email_verified_at: rowUser[3],
                created_at: rowUser[4],
                updated_at: rowUser[5],
                avatar: rowUser[6],
                role_id: rowUser[7],
            },
        
        });
        
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
                //console.log(response);
                this.setState({
                    user: response.user,
                    users: response.users,
                    permission: response.permission,
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

        let users = this.state.users ? this.state.users.map((item,i) => {

            return (<tr  className={item.id===this.state.user.id ? "user-danger" : ""} key={i} onClick={this.getRowData} data-toggle="modal" data-target="#myModal" title={item.id===this.state.user.id ? "It is you!" : item.name}>
                <td id="id">{item.id}</td>
                <td id="name">{item.name}</td>
                <td id="email">{item.email}</td>
                <td id="email_verified_at">{item.email_verified_at}</td>
                <td id="created_at">{item.created_at}</td>
                <td id="updated_at">{item.updated_at}</td>
                <td id="avatar">{item.avatar}</td>
                <td id="role_id">{item.role_id}</td>
                </tr>);
        }) : null;

        let table = this.state.permission ? <div className="container" id="userTable">
                <table className="table table-bordered table-dark table-striped table-hover table-responsive-xl">
                    <caption className="tableCap">Change user's role</caption>
                    <thead>
                        <tr></tr>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>email</th>
                            <th>email_verified_at</th>
                            <th>created_at</th>
                            <th>updated_at</th>
                            <th>avatar</th>
                            <th>role_id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users}
                    </tbody>
                </table>
            </div> : "";

        let role_id = null;

        if(this.state.changedUserIndex){

            if(this.state.users[this.state.changedUserIndex].role_id===this.state.clickedRowData.role_id){
                role_id = this.state.clickedRowData.role_id;
            }
            else if(this.state.users[this.state.changedUserIndex].role_id!==this.state.clickedRowData.role_id){
                role_id = this.state.users[this.state.changedUserIndex].role_id;
            }
            
        }
        else if(!this.state.changedUserIndex){

            role_id = this.state.clickedRowData.role_id;

        }
        
        let modal = this.state.permission ? <div className="container">

            <div className="modal fade alert alert-danger" id="myModal">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                    
                        <div className="modal-header alert-success">
                            <h4 className="modal-title">Change user's role</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        
                        <div className="modal-body alert alert-light">
                            
                            <table className="table table-bordered table-dark table-striped table-hover table-responsive">
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>name</th>
                                        <th>email</th>
                                        <th>email_verified_at</th>
                                        <th>created_at</th>
                                        <th>updated_at</th>
                                        <th>avatar</th>
                                        <th>role_id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.state.clickedRowData.id}</td>
                                        <td>{this.state.clickedRowData.name}</td>
                                        <td>{this.state.clickedRowData.email}</td>
                                        <td>{this.state.clickedRowData.email_verified_at}</td>
                                        <td>{this.state.clickedRowData.created_at}</td>
                                        <td>{this.state.clickedRowData.updated_at}</td>
                                        <td>{this.state.clickedRowData.avatar}</td>
                                        <td>{role_id}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <form onSubmit={this.updateUserRole}>
        
                                <input type="hidden" name="user_id" id="user_id" value={this.state.clickedRowData.id ? this.state.clickedRowData.id : ""}/>
                                
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" name="role_id" value="1" onChange={this.checkRadio} checked={(!this.state.checkedRadioVal ? (this.state.clickedRowData.role_id==="1") : this.state.checkedRadioVal==="1") ? "checked" : ""}/>Administrator
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" name="role_id" value="2" onChange={this.checkRadio} checked={(!this.state.checkedRadioVal ? (this.state.clickedRowData.role_id==="2") : this.state.checkedRadioVal==="2") ? "checked" : ""}/>Moderator
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" name="role_id" value="3" onChange={this.checkRadio} checked={(!this.state.checkedRadioVal ? (this.state.clickedRowData.role_id==="3") : this.state.checkedRadioVal==="3")  ? "checked" : ""}/>User
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-outline-primary">Submit</button>
                            </form>

                        </div>
                        
                        <div className="modal-footer alert-warning">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        
        </div> : "";
        return (
            <div className="container">

                <div className="card">
                    <div className="card-header">Hello {this.state.user.name}! {tempText} {temp}°C</div>
                    <div className="card-body">

                        <button className="btn btn-outline-success">
                            <a className="nav-link" href="/create">Upload an Video</a>
                        </button>
                        
                        {table}
                    
                    </div> 
                    <div className="card-footer">Go at it. Upload an video!</div>
                </div>

                {modal}

            </div>
        );
    
    }

}

if(document.getElementById('dashboard')){

    ReactDOM.render(<Dashboard/>, document.getElementById('dashboard'));

}
