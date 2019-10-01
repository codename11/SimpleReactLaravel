import React from 'react';
import ReactDOM from 'react-dom';

class List extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            videos: "",
            offset: 0,
        };
        this.listVideos = this.listVideos.bind(this);
        this.offsetIncrement = this.offsetIncrement.bind(this);
    }

    offsetIncrement(e){

        e.preventDefault();
        this.setState({
            offset: this.state.offset+1,
        }, () => {this.listVideos()});
        
    }

    listVideos(){
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

        $.ajax({
            url: '/listData',
            type: 'POST',
            data: {_token: token , message: "bravo", offset: this.state.offset},
            dataType: 'JSON',
    
            success: (response) => { 

                console.log("success");
                console.log(response);

                if(this.state.offset===0){

                    this.setState({
                        videos: response.videos,
                    });

                }

                if(this.state.offset>0){

                    this.setState({
                        videos: this.state.videos.concat(response.videos),
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
        
        this.listVideos();

    }

    render(){
        //console.log(this.state);
        
        let videos = this.state.videos ? this.state.videos.map((item, index) => {
        
            let thumb1 = "/storage/"+item.user.name+"'s Thumbnails/"+item.thumbnail;
            let thumb2 = "/storage/"+"nothumbnail.jpg";
            let thumbnail = item.thumbnail ? thumb1 : thumb2;

            let desc = item.description && item.description.length>56 ? item.description.substring(0, 56) : item.description;
            let readMore = desc.length===56 ? <a id='readMore' href={"list/"+item.id}>...Find out more</a> : "";
            
            return  <div className="card" key={index}>

                        <div className="card-header videoTitle">{item.title}</div>

                        <div className="card-body">
                            <a href={"list/"+item.id} className="videoName" title={item.name}><img className="thumbImg" src={thumbnail} alt={item.thumbnail} /></a>
                            
                            <div dangerouslySetInnerHTML={{__html:desc}} className="descReadMore"></div>
                            <span className="linkReadMore descReadMore">{readMore}</span>
                            
                        </div>

                        <div className="card-footer">
                            <a href={"list/"+item.id} className="channell" title={item.user.name}>{item.user.name}</a>
                        </div>

                    </div>

                ;
        }) : "";

        videos = videos.length > 0 ? videos : (<div><img className="img-fluid cent novideos" src="/storage/novideos.gif" alt="novideos" /><span className="cent notice">No videos uploaded yet...</span></div>);

        return (
            <div>
                <div className="grid-container1">
                    {videos}
                
                </div>
                <a href="#"  className='showMore btn btn-outline-info' onClick={this.offsetIncrement}>Show more...</a>
            </div>
        );
    
    }

}

if(document.getElementById('list')){

    ReactDOM.render(<List/>, document.getElementById('list'));

}
