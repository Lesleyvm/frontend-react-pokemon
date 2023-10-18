import './Button.css'
function Button({buttonType = "button", text, disabled, clickHandler}) {
    return(
        <>
            <button type={buttonType}
                    disabled={disabled}
                    onClick={clickHandler}
            >
                {text}
            </button>
        </>
    )
}

export default Button;