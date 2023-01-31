import {useState} from 'react'
import  {useOutletContext} from 'react-router-dom'
import "../styles/post.css"

function Post (){
    const [post,] = useOutletContext()
    const [entryStatus,setEntryStatus] = useState('')
    function fileSelected(){
        if (entryStatus === '' ) setEntryStatus('selected');
    }
    function description(){
        if (entryStatus === 'selected' ) setEntryStatus('complete');
    }
    function submit(){
        post()
        setEntryStatus('')
        document.querySelector('#img-input').files = new FileList()
        //document.querySelector('#text-input').value = '' 
    }
    return (
    <div id="post-form">
            <p>Choose a picture to post</p>
            <input type="file" accept="image/*" id="img-input" onChange={fileSelected}></input>
            <p>Description:</p>       
            <input type="text"id="text-input" onChange = {description}></input>
            <button onClick={submit} disabled ={(entryStatus !=='complete')}>submit</button>
        
    
    
    
    </div>
    )

}

export default Post;