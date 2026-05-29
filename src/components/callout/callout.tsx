import type { ReactNode } from "preact/compat";

type CalloutType = "note" | "warning" | "tip";

const calloutLabels: Record<CalloutType, string> = {
    note: "Note",
    warning: "Warning",
    tip: "Tip",
};

interface CalloutProps {
    type?: CalloutType;
    children?: ReactNode;
}

export function Callout({ type = "note", children }: CalloutProps) {
    return (
        <aside
            className="callout card semi-bleed"
            data-type={type}
            aria-label={`${calloutLabels[type]} callout`}
        >
            <p className="callout-label label">{calloutLabels[type]}</p>
            <div className="body-md">{children}</div>
        </aside>
    );
}
