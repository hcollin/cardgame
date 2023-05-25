
import "./test-view.scss";


export default function TestView() {

    return (
        <div className="test-view">
            <div className="part one">
                <p>Part 1</p>
            </div>
            <div className="part two">
                <p>Part 2</p>
                <div className="inner-one">
                    Inner 1
                </div>
                <div className="inner-two">
                    Inner 2
                </div>
            </div>
        </div>
    )
}