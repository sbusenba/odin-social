import { useOutletContext } from "react-router-dom"
import PostSummary from "./PostSummary"
function Feed(){
    let [,posts]= useOutletContext()
    console.log(posts)
    return(
        <div className = "feed-div">
            {posts.length>=1?posts.map((post)=><PostSummary key={post.imgURL} post={post}/>):"No posts, post the first!"}
        </div>
    )
}
export default Feed; 