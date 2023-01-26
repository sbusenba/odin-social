import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/postsummary.css'
function PostSummary(props){

    console.log(props.post)
    let imgStyle = {
    height: `auto`,
    width: `300px`}
    useEffect(()=>{})
    const userLink = `user/${props.post.userID}`
    const postLink = `post/${props.post.id}`
    const linkStyle = {
        margin: "0rem",
        textDecoration: "none",
        color: "rgb(0,0,0)",
      };
    return(
        <div key={props.post.id} id = {props.post.id} className="post-summary">
            <Link to={postLink} style={linkStyle}>
                <img src = {props.post.imageUrl} 
                    style={imgStyle} alt="a post"/>
                <p>{props.post.message}</p>
            </Link>
            <Link to={userLink} style={linkStyle}>
                <div className='user-block'>
                    <img className = 'poster-profile-pic'
                    src ={props.post.profilePicUrl} 
                    alt="user profile pic"
                    referrerPolicy="no-referrer"></img>
                    <p>{props.post.name}</p>
                </div> 
            </Link>
        </div>
    )
}
export default PostSummary;