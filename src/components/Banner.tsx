
import "./banner.css";

function Banner(props: {text: string}) {

    return (
        <div className="banner">
            <div className="left-side">&nbsp;</div>
            <div className="banner-text">
                {props.text}
            </div>
            <div className="right-side">&nbsp;</div>
        </div>
    )
}

export default Banner;