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
        
        let checkBox = e.target;
        let index = this.state.checkedValues.indexOf(Number(checkBox.value));
        let selectedCategories = null;

        if(index === -1){

            this.setState({
                checkedValues: [...this.state.checkedValues,Number(checkBox.value)],
            });

            selectedCategories = [...this.state.checkedValues,Number(checkBox.value)];

        }
        
        if(index > -1){

            this.setState({
                checkedValues: [...this.state.checkedValues.filter((item, i) => i!==index)],
            });
            selectedCategories = [...this.state.checkedValues.filter((item, i) => i!==index)];
        }

        this.listVideos(selectedCategories);
          
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
            
            this.listVideos(this.state.selectedCategories);
        });
    
    }

    listVideos(selectedCategories){
        
        let token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        
        $.ajax({
            url: '/listData',
            type: 'POST',
            data: {_token: token , message: "bravo", offset: this.state.offset, selectedCategories: selectedCategories},
            dataType: 'JSON',
    
            success: (response) => { 

                console.log("success");
                
                let arr = [...this.state.videos, ...response.videos];//Pomesa sve video-e.

                let arr1 = arr.map((item, i) =>{ //Stringifikuje sve objekte u nizu.
                    return JSON.stringify(item);
                });

                arr1 = [...new Set(arr1)].map((item, i) => {
                //Uporedjuje sve stringifikovane objekte u nizu, i ako nema duplikata, vraca.
                    return JSON.parse(item);
                });

                if(this.state.offset===0){
                    
                    this.setState({
                        videos: [...arr1],
                        videoCount: response.videoCount,
                        selectedCategories: response.selectedCategories,
                    });

                }

                if(this.state.offset>0){
                    
                    this.setState({
                        videos: [...arr1],
                        videoCount: response.videoCount,
                        selectedCategories: response.selectedCategories,
                    });
                   
                }

                this.scrollToBottom();
                //console.log(response);
                //console.log(this.state.videos);
    
            },
            error: (response) => {

                console.log("error");
                console.log(response);
                
            }

        });

    }

    componentDidMount(){
        
        this.listVideos(this.state.selectedCategories);

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
                {(videos && videos.length > 0 && this.state.videoCount-videos.length>0) ? <a href="#"  className='showMore btn btn-outline-info' onClick={this.offsetIncrement}>Show more...</a> : <div className="showMore"></div>}

            </div>
        );
    
    }

}

if(document.getElementById('list')){

    ReactDOM.render(<List/>, document.getElementById('list'));

}
