function PostSummary(props){

    console.log(props.post)
    let style = {backgroundImage: `url(${props.post.imageUrl})`,
    backgroundSize: 'auto 200px',
    height: `100px`,
    width: `200px`
    
}
    return(
        <div key={props.post.id} className="post-summary">
            <div style={style} alt="a post"/>
            <p>{props.post.message}</p>
            <div className='user-block'>
                <img className = 'poster-profile-pic'
                src ={props.post.profilePicUrl} 
                alt="user profile pic"></img>
                <p>{props.post.name}</p>
            </div>
        </div>
    )
}
export default PostSummary;