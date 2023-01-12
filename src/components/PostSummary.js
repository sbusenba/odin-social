import '../styles/postsummary.css'
function PostSummary(props){

    console.log(props.post)
    let imgStyle = {
    height: `auto`,
    width: `300px`}


    return(
        <div key={props.post.id} className="post-summary">
            <img src = {props.post.imageUrl} 
            style={imgStyle} alt="a post"/>
            <p>{props.post.message}</p>
            <div className='user-block'>
                <img className = 'poster-profile-pic'
                src ={props.post.profilePicUrl} 
                alt="user profile pic"
                referrerPolicy="no-referrer"></img>
                <p>{props.post.name}</p>
            </div>
        </div>
    )
}
export default PostSummary;