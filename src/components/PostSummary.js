import '../styles/postsummary.css'
function PostSummary(props){

    console.log(props.post)
    let imgStyle = {backgroundImage: `url(${props.post.imageUrl})`,
    backgroundSize: '300px auto',
    backgroundRepeat: 'no-repeat',
    height: `300px`,
    width: `auto`}


    return(
        <div key={props.post.id} className="post-summary">
            <div style={imgStyle} alt="a post"/>
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