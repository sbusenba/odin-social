import "../styles/CommentBox.css"
function CommentBox(props){
let imgStyle = {
    height: `96px`,
    width: `96px`}
return(
        <div className ='comment-box'> Comments:
            {(props.comments)?props.comments.map((comment,index)=><div className="comment" key={index}>
                <div className="comment-text">
                <p >{comment.comment}</p>
                </div>
                <div className="user-block">
                    <img style ={imgStyle} src={comment.profilePicUrl}></img>
                    <p>{comment.name}</p>                
                </div>
                </div>): <p>No Comments, add the first!</p>}   
            <div className="comment-input">
                <input type='text' className="comment-input-box"></input>
                <button onClick={()=>props.commentFn(props.post)}>Add Comment</button>
            </div>
        </div>

)
}
export default CommentBox;
