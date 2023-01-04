function Image(props){
    let src = props.imgsrc
    console.log(props)

    return (
        <img src = {props.src} alt ="an image"></img>
    )
}
export default Image;