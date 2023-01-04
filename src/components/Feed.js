import { useOutletContext } from "react-router-dom"
import PostSummary from "./PostSummary"
function Feed(){
    let [,posts]= useOutletContext()
    return(
        <div className = "feed-div">
            {posts.length>=1?posts.map((post)=><PostSummary key={post.id} post={post}/>):"No posts, post the first!"}
        </div>
    )
}
export default Feed; 