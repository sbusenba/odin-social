import { useParams } from "react-router-dom";
function UserDetail(){
    let params = useParams()
    console.log(params)
return (
    <div>
    
    <p>Here is the detail for user {params.userID}</p>
    
    </div>
)
}
export default UserDetail;