import { useRef,useState,useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import PostSummary from "./PostSummary"
import '../styles/feed.css'
function Feed(){
    let [,posts,,,,,sortDate,sortDateRev,sortLikes]= useOutletContext()
    console.log("<feed>")
    console.log(posts)
    let feedRef = useRef()
    console.log(feedRef)
    const [width, setWidth] = 
      useState(0);
    useEffect(() => {
      if (feedRef.current) {
        setWidth(feedRef.current.offsetWidth);
        console.log(width)
      }
    }, []);
    let feed1=[]
    let feed2=[]
    let feed3=[]
    posts.forEach((post,index) => {     
          let myIndex = index%3 
          switch (myIndex) {
            case 0:
              feed1.push(post)
              break;
            case 1:
              feed2.push(post)
              break;
            case 2:
              feed3.push(post)
              break;    
            default:
              break;
          } 
    });
    return(
        <div>
            <div>sort by:
          <button onClick={()=>sortDate()}>New</button>
          <button onClick={()=>sortDateRev()}>Oldest</button>
          <button onClick={()=>sortLikes()}>Likes</button>
        </div>
        
        <div className="feed-container">
         

            <div className = "feed-div feed1">
            {feed1.length>=1 ? 
                feed1.map((post)=> <PostSummary key={post.id} post={post}/>)
                :"No posts, post the first!"}
            </div>
            <div className = "feed-div feed2">
            {feed2.length>=1 ? 
                feed2.map((post)=> <PostSummary key={post.id} post={post}/>)
                :"No posts, post the first!"}
            </div>
            <div className = "feed-div feed3">
            {feed3.length>=1 ? 
                feed3.map((post)=> <PostSummary key={post.id} post={post}/>)
                :"No posts, post the first!"}
            </div>
        </div>
        </div>
    )
}
export default Feed; 