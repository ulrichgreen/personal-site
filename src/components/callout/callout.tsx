import type { ReactNode } from "preact/compat";

type CalloutType = "note" | "warning" | "tip";

const calloutLabels: Record<CalloutType, string> = {
    note: "Note",
    warning: "Warning",
    tip: "Tip",
};

const variantClasses: Record<CalloutType, string> = {
    note: "",
    warning: "callout--warning",
    tip: "callout--tip",
};

interface CalloutProps {
    type?: CalloutType;
    children?: ReactNode;
}

export function Callout({ type = "note", children }: CalloutProps) {
    const variant = variantClasses[type];
    return (
        <aside
            className={`callout${variant ? ` ${variant}` : ""} card semi-bleed`}
            aria-label={`${calloutLabels[type]} callout`}
        >
            <p className="callout__label label">{calloutLabels[type]}</p>
            <div className="body-md">{children}</div>
        </aside>
    );
}
