import React from 'react';

class Categories extends React.Component {
    
    constructor(props) {

        super(props);
        this.state = {
            categories: [],
        };
        //this.getCkEditor = this.getCkEditor.bind(this);
        
    }

    render(){

        let categories = (this.props.categories && this.props.categories.length>0) ? this.props.categories.map((item,i) => {
            return <a className="dropdown-item dropinp" href="#" key={"a"+i}>
                <input id={"inp"+i} key={"inp"+i} type="checkbox" className="form-check-input" value={item.id} onClick={this.props.myCategorie}/>{item.name}
            </a>
        }) : null;

        return (
            <div className="container drop1">
                <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" onClick={this.props.getCategories}>
                        Categories
                    </button>
                    <div className="dropdown-menu">
                        {categories}
                    </div>
                </div>
            </div>
        );
    
    }

}

export default Categories;