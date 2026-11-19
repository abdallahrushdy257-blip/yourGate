function CustomButton(props) {
  const classN = `custome-button ${props.className}`
    return (
        <>
             <button
              variant="primary"
              type={ props.type ? props.type :`submit`}
              className={classN}
              onClick={props.onClick}
            >
              {props.text}
            </button>
        </>
    )
}

export default CustomButton