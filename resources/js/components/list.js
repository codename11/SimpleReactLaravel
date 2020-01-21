import React from 'react';
import ReactDOM from 'react-dom';
import Categories from './categories.js';

class List extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            videos: "",
            offset: 0,
            videoCount: 0,
            categories: null,
            checkedValues: [],
            selectedCategories: null,
        };
        this.listVideos = this.listVideos.bind(this);
        this.offsetIncrement = this.offsetIncrement.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.myCategorie = this.myCategorie.bind(this);
    }

    myCategorie(e){
        
        let checkBox = e.target.id;
        //console.log(e.target.value);
        let index = this.state.checkedValues.indexOf(e.target.value);

        if(index === -1){

            this.setState({
                checkedValues: [...this.state.checkedValues,e.target.value],
            });

            let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

            $.ajax({
                url: '/filterCategories',
                type: 'GET',
                data: {_token: token , message: "bravo", selectedCategories: [...this.state.checkedValues,e.target.value]},
                dataType: 'JSON',
        
                success: (response) => { 

                    console.log("success");
                    //console.log(response);  
                    this.setState({
                        selectedCategories: response.selectedCategories,
                    });
        
                },
                error: (response) => {

                    console.log("error");
                    console.log(response);
                    
                }

            });

        }
        
        if(index > -1){

            this.setState({
                checkedValues: [...this.state.checkedValues.filter((item, i) => i!==index)],
            });

        }
          
    }

    getCategories(e){
        //console.log(e.target);
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

        $.ajax({
            url: '/getCategories',
            type: 'GET',
            data: {_token: token , message: "bravo", },
            dataType: 'JSON',
    
            success: (response) => { 

                console.log("success");
                //console.log(response);
                this.setState({
                    categories: response.categories,
                });
    
            },
            error: (response) => {

                console.log("error");
                console.log(response);
                
            }

        });
    }

    scrollToBottom(){
        
        setTimeout(() => {//Needed to add this, because Chrome is so fast that it doesn't execute scrolling fast enough on click.
            window.scrollTo({left: 0, top: 999999, behavior: "smooth"});
        },10);

    }

    offsetIncrement(e){

        e.preventDefault();
        this.setState({
            offset: this.state.offset+1,
        }, () => {
            this.listVideos();
        });
    
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
                        videoCount: response.videoCount,
                    });

                }

                if(this.state.offset>0){

                    this.setState({
                        videos: this.state.videos.concat(response.videos),
                        videoCount: response.videoCount,
                    });
                   
                }

                this.scrollToBottom();
    
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
        console.log(this.state);
        let filteredVideos = (this.state.videos && this.state.checkedValues && this.state.checkedValues.length>0) ? this.state.videos.filter((item, i) => {

            if(this.state.checkedValues.indexOf(item.categorie_id) > -1){

                return item;

            }

        }) : this.state.videos;

        let videos = filteredVideos ? filteredVideos.map((item, index) => {
        
            let thumb1 = "/storage/"+item.user.name+"'s Thumbnails/"+item.thumbnail;
            let thumb2 = "/storage/"+"nothumbnail.jpg";
            let thumbnail = item.thumbnail ? thumb1 : thumb2;

            let desc = item.description && item.description.length>56 ? item.description.substring(0, 56) : item.description;
            let readMore = desc.length===56 ? <a id='readMore' href={"list/"+item.id}>...Find out more</a> : "";
            
            return  <div className="card grid-container1-div" key={index}>

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
                <Categories myCategorie={this.myCategorie} getCategories={this.getCategories} categories={this.state.categories ? this.state.categories : null}/>
                <div className="grid-container1">
                    {videos} 
                </div>
                {(videos && videos.length > 0 && this.state.videoCount-videos.length>0) ? <a href="#"  className='showMore btn btn-outline-info' onClick={this.offsetIncrement}>Show more...</a> : ""}

            </div>
        );
    
    }

}

if(document.getElementById('list')){

    ReactDOM.render(<List/>, document.getElementById('list'));

}
