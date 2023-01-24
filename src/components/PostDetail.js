import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
function PostDetail(){
    let params = useParams()
    console.log(params)
    let [,posts]= useOutletContext()
    let myPost = posts.filter((post)=>post.id===params.postID)
    console.log(myPost)
    let imgStyle = {
        height: `auto`,
        width: `900px`}
return (
    
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
            
        </div>
)
}
export default PostDetail;