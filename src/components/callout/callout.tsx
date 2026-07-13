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
        <aside data-type={type} aria-label={`${calloutLabels[type]} callout`}>
            <p>{calloutLabels[type]}</p>
            <div>{children}</div>
        </aside>
    );
}
