//Imports
// This is the Link API - API Key: c02c7cb15f4146a6a63ef3ed28317f58
import Link from 'next/link';
//import fetch library
import fetch from 'isomorphic-unfetch';
//import SearchForm Component
import SearchForm from '../components/SearchForm';

//news source
const source = 'the-irish-times';

//custom api key - https://newsapi.org/
const apiKey = 'c02c7cb15f4146a6a63ef3ed28317f58';

//Q2 - Date and time 
function formatDate(Business) {
  var d = new Date(Business);
  
  //date object - in page only
      let date = new Date();

      date.setDate();
      return(date);
  }

//Build the ulr which will be used to get the data
//See: https://newsapi.org/s/the-irish-times-api
const url = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`;


//News Class defined as an ES6 Class - Search function code
export default class News extends React.Component {
  //constructor - recieve props and initialise sate properties
  constructor(props) {
    super(props)
    this.state = {
      newsSource: "",
      url: "",
      articles: []
    }
  }//end constructor

  //this function is passed to the SearchForm and used to get the value entered
          //this value will be used to generate the api url
          setNewsSource = (input) => {
            this.setState({
              newsSource: input,
              url: `https://newsapi.org/v2/top-headlines?sources=${input}&apikey=${apikey}`
            })
          }

  //get all articles by searching for keywords
  //https://newsapi.org/docs/endpoints
  searchNewsAPI = (event) => {
    //set state values - this will trigger an update and componentDidUpdate
    this.setState({
      //gvet link text
      newsSource: `https://newsapi.org/v2/${event.target.name}&apiLey=${apiKey}`
    })
    console.log(this.state.url);
  }

  //render() method generates the page
  render() {
    //if state.articles is empty copy props to it
    if(this.state.articles.length == 0) {
      this.state.articles = this.props.articles;
    }
    return (
      <div>
        {/*Add the SearchForm component */}
        {/*Pass the setNewsSource function as a prop with the same name*/}
        <SearchForm setNewsSource={this.setNewsSource}/>
        {/*Search Links - note Using name attribute for parameters*/}
        <ul className="newsMenu">
          <li><a href="/news" onClick={this.searchNewsAPI} name="top-headlines?source=the-irish-times&apiKey=c02c7cb15f4146a6a63ef3ed28317f58">Top Headlines from The Irish Times Ireland</a></li>
          <li><a href="/technology" onClick={this.searchNewsAPI} name="top-headlines?source=ars-technica&apiKey=c02c7cb15f4146a6a63ef3ed28317f58">Headlines from Ars-Technica</a></li>
          <li><a href="/sport" onClick={this.searchNewsAPI} name="top-headlines?source=nfl-news&apiKey=c02c7cb15f4146a6a63ef3ed28317f58">Top Headlines from NFL League Reports</a></li>
          <li><a href="/business" onClick={this.searchNewsAPI} name="top-headlines?source=the-wall-street-journal&apiKey=c02c7cb15f4146a6a63ef3ed28317f58">Top Headlines from The Wall Street Journal</a></li>
        </ul>
        {/*Display a title based on source*/}
        <h3>{this.state.newsSource.split("-").join(" ")}</h3> //error
        <div>
          {/*Iterate through articles using Array Map)*/}
          {/*Display author, publishedAt, image, description, and content*/}
          {/*for each story. Also a link for more...*/}
          {this.state.articles.map((article, index) => (
            <section key ={index}>
            <h3>{article.title}</h3>
            <p className="author">{article.author} {article.publishedAt}</p>
            <img src={article.urlToImage} alt = "article image" className="img-article"></img>
            <p>{article.description}</p>
            <p>{article.content}</p>
            {/*adding the index value as a paramenter to be passed with a req for the single article page */} 
            <p><Link as={`/article/${index}`} href={`/article?id=${index}`}><a>Read More</a></Link></p>
            </section>
          
          ))}
        </div>

        <style jsx>{`

          section {
              width: 50%;
              border: 1px solid gray;
              background-color: rgb(240, 248, 255);
              padding: 1em;
              margin: 1em;
          }

          .author {
              font-style: italic;
              font-size: 0.8em;
          }

          .img-article{
              max-width: 50%;
          }

          .newsMenu {
            display: files;
            flex-direction: row;
            margin: 0;
            padding: 0;
            margin-top: 20px;
          }

          .newsMenu li {
            display: inline-table;
            padding-left: 20px;
          }

          .newsMenu li a {
            font-size: 1em;
            color: blue;
            display: block;
            text-decoration: none;
          }

          .newsMenu li a:hover {
            color: rgb(255, 187, 0);
            text-decoration: underline;
          }

          `}</style>
      </div>
     );//end return()
    }//end render()

  //get initial data on server side using an AJAX call
  //this will initialise the 'props' for the News Page
  static async getInitialProps(response) {
    //build the url which will be used to get the data
    //see https://newsapi.org/s/the-irish-times-api
    const initUrl = `https:/newsapi.org/v2/top-headlines?sources=${defaultNewsSource}$apiKey=${apiKey}`;

    //get news from the api url
    const data = await getNews(initUrl);

    //if the result contains and article array then it is good th return articles
    if(Array.isArray(data.articles)) {
      return{
        articles: data.articles
      }
    }
    //otherwise it contians an error, log and redirect to error page(status code 400)
    else{
      console.error(data)
      if(response) {
        response.statusCode = 400
        response.end(data.message);
      }
    }
  }//end getInitialProps

  //componentDidUpdate is called when the page or props re-upload
  //it can be over-ridden to perform other functions when an update occurs
  //here it fetches new data using this.state.newsSource as the source
  async componentDidUpdate(prevProps, prevState) {

    //check if the newsSource url has changed to avoid unecessary updates
    if(this.state,url !== prevState) {

      //use api url (from state) to fetch data and call getNews()
      const data = await getNews(this.state,url);

      //if the result contains and articles array then it is good so update articles
      if(Array.isArray(data.articles)) {
        //store articles in state
        this.state.articles = data.articles;
        //force page update by charging state
        this.setState(this.state);
      }
      //otherwise it contains an error, login and redirect to error page (status code 400)
      else {
        console.error(data)
        if(response) {
          response.statusCode = 400
          response.end(data.message);
        }
      }
    }
  }//end componentDidUpdate
}//end React.component extended News export

//get initial data on server side using an AJAX call
//This will initialise the 'props' for the News page
News.getInitialProps = async function() {
  //Make async call
  const res = await fetch(url);
  //get json data when it arrives
  const data = await res.json();
  //log on server side (Node.js + Express)
  console.log(`Show data feteched. Count: ${data.articles.length}`);

  //return an array of the articles contained in the data
  //see https://newsapi.org/s/the-irish-times-api for json structure
  return {
    articles: data.articles
  }
}

//getNews(url) - async method that fetches and returns data/error from a WWW API
async function getNews(url) {
  //try fetch and catch errors
  try{
    //make async call
    const res = await fetch(url);
    //get json data when it arrives
    const data = await res.json();
    //return json data
    return(data);
  } catch(error) {
    //return error if exists
    return(error);
  }
}

