import type { ComponentChildren } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

interface PlaygroundProps {
    title?: string;
    controls?: ComponentChildren;
    children: ComponentChildren;
    minWidth?: number;
}

/**
 * A small, article-scoped "mini CodePen" frame. It renders an example on a
 * resizable stage so readers can drag the viewport width to see how the demo
 * responds, alongside an optional rail of controls. Concrete examples compose
 * this frame with their own JSX and the control primitives below.
 */
export function Playground({
    title,
    controls,
    children,
    minWidth = 240,
}: PlaygroundProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    // null = follow the available width (full); a number pins an explicit width.
    const [width, setWidth] = useState<number | null>(null);
    const [maxWidth, setMaxWidth] = useState(0);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const measure = () => setMaxWidth(viewport.clientWidth);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(viewport);
        return () => observer.disconnect();
    }, []);

    const clamp = useCallback(
        (value: number) => {
            const upper = maxWidth || value;
            return Math.max(minWidth, Math.min(value, upper));
        },
        [maxWidth, minWidth],
    );

    const onPointerMove = useCallback(
        (event: PointerEvent) => {
            if (!draggingRef.current) return;
            const stage = stageRef.current;
            if (!stage) return;
            const left = stage.getBoundingClientRect().left;
            setWidth(clamp(event.clientX - left));
        },
        [clamp],
    );

    const stopDragging = useCallback(() => {
        draggingRef.current = false;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopDragging);
    }, [onPointerMove]);

    const startDragging = useCallback(
        (event: PointerEvent) => {
            event.preventDefault();
            draggingRef.current = true;
            if (width === null && stageRef.current) {
                setWidth(stageRef.current.clientWidth);
            }
            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", stopDragging);
        },
        [onPointerMove, stopDragging, width],
    );

    useEffect(() => stopDragging, [stopDragging]);

    const onHandleKeyDown = (event: KeyboardEvent) => {
        const current = width ?? stageRef.current?.clientWidth ?? minWidth;
        const step = event.shiftKey ? 50 : 10;
        switch (event.key) {
            case "ArrowLeft":
                event.preventDefault();
                setWidth(clamp(current - step));
                break;
            case "ArrowRight":
                event.preventDefault();
                setWidth(clamp(current + step));
                break;
            case "Home":
                event.preventDefault();
                setWidth(minWidth);
                break;
            case "End":
                event.preventDefault();
                setWidth(null);
                break;
        }
    };

    const displayWidth = width ?? maxWidth;

    return (
        <div className="playground">
            <div className="playground__bar">
                {title && <span className="playground__title label">{title}</span>}
                <span className="playground__readout mono" aria-live="polite">
                    {displayWidth ? `${Math.round(displayWidth)}px` : "full width"}
                </span>
                <button
                    type="button"
                    className="playground__reset label"
                    onClick={() => setWidth(null)}
                    disabled={width === null}
                >
                    Reset width
                </button>
            </div>
            <div className="playground__viewport" ref={viewportRef}>
                <div
                    className="playground__stage"
                    ref={stageRef}
                    style={
                        width === null
                            ? { flexGrow: 1 }
                            : { flexGrow: 0, flexShrink: 0, width: `${width}px` }
                    }
                >
                    {children}
                </div>
                <button
                    type="button"
                    className="playground__handle"
                    role="slider"
                    aria-label="Drag to resize the example viewport"
                    aria-valuemin={minWidth}
                    aria-valuemax={maxWidth || undefined}
                    aria-valuenow={displayWidth ? Math.round(displayWidth) : undefined}
                    onPointerDown={startDragging}
                    onKeyDown={onHandleKeyDown}
                >
                    <span className="playground__grip" aria-hidden="true" />
                </button>
            </div>
            {controls && <div className="playground__controls">{controls}</div>}
        </div>
    );
}

interface RangeControlProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    unit?: string;
    onInput: (value: number) => void;
}

export function RangeControl({
    label,
    min,
    max,
    step = 1,
    value,
    unit = "",
    onInput,
}: RangeControlProps) {
    return (
        <label className="control">
            <span className="control__label label">{label}</span>
            <input
                className="control__range"
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onInput={(event) =>
                    onInput(Number((event.target as HTMLInputElement).value))
                }
            />
            <output className="control__value mono">
                {value}
                {unit}
            </output>
        </label>
    );
}

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
    return (
        <label className="control control--toggle">
            <span className="control__label label">{label}</span>
            <input
                className="control__checkbox"
                type="checkbox"
                checked={checked}
                onChange={(event) =>
                    onChange((event.target as HTMLInputElement).checked)
                }
            />
            <span className="control__switch" aria-hidden="true" />
        </label>
    );
}
