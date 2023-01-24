import { useParams } from "react-router-dom";
function PostDetail(){
    let params = useParams()
    console.log(params)
return (
    <div>
    <p>here is post {params.postID}</p>
    
    
    </div>
)
}
export default PostDetail;