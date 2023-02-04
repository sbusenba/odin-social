import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import CommentBox from "./CommentBox";
function PostDetail(){
    let params = useParams()
    console.log(params)
    let [,posts,userID,deleteFn,,likeFn,,,,commentFn]= useOutletContext()
    console.log(posts)
    let myPost = posts.filter((post)=>post.id===params.postID)
    console.log(myPost)
    let imgStyle = {
        height: `auto`,
        width: `900px`}
    function likeThisPost(){
        myPost[0].likes++
        likeFn(myPost[0].id)
    }
    
return (
    (myPost !== null)?
    <div key={myPost[0].id} id = {params.postID} className="post-summary">
            <img src = {myPost[0].imageUrl} 
            style={imgStyle} alt="a post"/>
            <p>{myPost[0].message}</p>
    

            <div className='user-block'>
                <img className = 'poster-profile-pic'
                src ={myPost[0].profilePicUrl} 
                alt="user profile pic"
                referrerPolicy="no-referrer"></img>
                <p>{myPost[0].name}</p>
            </div>
            <p>likes:{myPost[0].likes}</p>
            {(myPost[0].currentUserLiked)?null:<button onClick={()=>likeThisPost()}>like</button>}
            {(userID === myPost[0].userID)?<button onClick={()=>deleteFn(myPost[0].id)}>delete</button>:null}
            <CommentBox comments ={myPost[0].comments} post={myPost[0].id} commentFn = {()=>commentFn(myPost[0].id)}/>
        </div>: <p>Post Deleted</p>
        
)
}
export default PostDetail;