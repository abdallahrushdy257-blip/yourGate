function Title(props) {
    return (
        <h2 className={`${props.className ? props.className : "mainTitle"}`}  >
            {props.title}
            {" "}
            {props.icon}
            
        </h2>
    )
}


export default Title