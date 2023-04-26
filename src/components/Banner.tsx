
import "./banner.css";

function Banner(props: {text: string, targetColor?: string}) {

    const targetColor = props.targetColor || "red";

    // TODO Change color of the banner
    const cns: string[] = ["banner"];
    cns.push(targetColor.toLowerCase())

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