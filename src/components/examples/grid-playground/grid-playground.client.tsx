import { useState } from "preact/hooks";
import {
    Playground,
    RangeControl,
    Toggle,
} from "../../playground/playground.client.tsx";

export interface GridPlaygroundProps {
    initialColumns?: number;
    initialGap?: number;
    boxCount?: number;
}

/**
 * An article-scoped interactive example. It illustrates how `grid-template-columns`,
 * `gap`, and dense auto-flow behave, and pairs with the resizable Playground stage
 * so readers can drag the viewport to watch the grid reflow at different widths.
 */
export function GridPlayground({
    initialColumns = 3,
    initialGap = 16,
    boxCount = 9,
}: GridPlaygroundProps) {
    const [columns, setColumns] = useState(initialColumns);
    const [gap, setGap] = useState(initialGap);
    const [dense, setDense] = useState(false);

    const boxes = Array.from({ length: boxCount }, (_, index) => index + 1);

    return (
        <Playground
            title="CSS Grid"
            controls={
                <>
                    <RangeControl
                        label="Columns"
                        min={1}
                        max={6}
                        value={columns}
                        onInput={setColumns}
                    />
                    <RangeControl
                        label="Gap"
                        min={0}
                        max={40}
                        step={2}
                        value={gap}
                        unit="px"
                        onInput={setGap}
                    />
                    <Toggle label="Dense flow" checked={dense} onChange={setDense} />
                </>
            }
        >
            <div
                className="grid-demo"
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gap: `${gap}px`,
                    gridAutoFlow: dense ? "row dense" : "row",
                }}
            >
                {boxes.map((n) => (
                    <div
                        key={n}
                        className="grid-demo__box"
                        style={n % 4 === 0 ? { gridColumn: "span 2" } : undefined}
                    >
                        {n}
                    </div>
                ))}
            </div>
        </Playground>
    );
}
