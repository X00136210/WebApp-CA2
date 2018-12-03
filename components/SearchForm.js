//import Dependancies
import React, { Component } from "react";

//Define SeachForm Class
export default class SearchForm extends Component {
    //constructor accepts props and initianlises state
    constructor(props) {
        super(props);

        this.state = {};
    }//end constructors

    //an event handler for form submit
    formSubmitted = event => {
      //validate input value
      if(event.target.newsSource.value != "") {
          //setNewsSource - function passed from parent(news page) via props
          //it is used as a way to pass input value back up to the parent
          //this is called state lifting
          //see: https://reactjs.org/docs/lifting-state-up.html
          this.props.setNewsSource(event.target.newsSource.value);
      }  
      //prevent page reload (pervent submit)
      event.preventDefault();
    };//end formSubmitted

    //render the form
    render() {
        return(
            <div>
                {/*Search Input */}
                <div id ="search">
                    <h3>Enter newsapi.org source</h3>
                    {/*Note event handler */}
                    <form onSubmit={this.formSubmitted}>
                    {/*The input form */}
                    <input
                        name="newsSource"
                        placeholder="New Source name"
                        type="text"
                    />
                    {/*Button click will trigger submit */}
                    <button>Update news</button>
                    </form>
                </div>
            </div>
        );
    }
}//end render