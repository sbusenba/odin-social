import { useOutletContext } from "react-router-dom"
import PostSummary from "./PostSummary"
function Feed(){
    let [,posts]= useOutletContext()
    return(
        <div className = "feed-div">
            {posts?posts.map((post)=><PostSummary key={post.data.id}post={post.data()}/>):null}
        </div>
    )
}
export default Feed; 