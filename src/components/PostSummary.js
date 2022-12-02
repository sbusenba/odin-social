function PostSummary(props){



    return(
        <div key={props.post.id} className="post-summary">
            <img src={props.post.imgUrl} alt="a post"></img>
            <p>{props.post.message}</p>
            <img src ={props.post.profilePicUrl} alt="user profile pic"></img>
            <p>{props.post.name}</p>
        </div>
    )
}
export default PostSummary;