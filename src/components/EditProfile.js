import { useState } from "react";
import { useOutletContext } from "react-router-dom";
function EditProfile(){
    const [post,,,,updateProfilePic] = useOutletContext()
    const [entryStatus,setEntryStatus] = useState('')
    function fileSelected(){
        if (entryStatus === '' ) setEntryStatus('selected');
    }
    function submit(){
        updateProfilePic()
        setEntryStatus('')
        
    }
return (
    <div>
    <p>Update your profile pic here!</p>
            <input type="file" accept="image/*" id="img-input" onChange={fileSelected}></input>
            <button onClick={submit} disabled ={(entryStatus !=='selected')}>submit</button>
    </div>
)
}
export default EditProfile;