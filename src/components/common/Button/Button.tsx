
import "./button.css";

export default function Button(props: { onClick: () => void, disabled?: boolean, children: React.ReactNode }) {

    const cns: string[] = ["arena-button"];

    return <button className={cns.join(" ")} onClick={props.onClick} disabled={props.disabled || false}>
        {props.children}
    </button>;
}