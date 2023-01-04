import  {useOutletContext} from 'react-router-dom'
import "../styles/post.css"

function Post (){
    const [post,] = useOutletContext()
    return (
    <div id="post-form">
        
            <input type="file" accept="image/*" id="img-input"></input>
            <input type="text"id="text-input"></input>
            <button onClick={post}>submit</button>
        
    
    
    
    </div>
    )

}

export default Post;