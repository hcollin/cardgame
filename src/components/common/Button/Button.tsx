
import "./button.css";

export default function Button(props: { onClick: () => void, disabled?: boolean, className?: string, children: React.ReactNode }) {

    const cns: string[] = ["arena-button"];
    if (props.className) {
        cns.push(props.className);
    }

    return <button className={cns.join(" ")} onClick={props.onClick} disabled={props.disabled || false}>
        {props.children}
    </button>;
}