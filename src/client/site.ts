// The build renders each code block's Copy button disabled, with its label.
// This turns the buttons on where the clipboard is available. The script is
// deferred, so the page is parsed by the time it runs.
if (navigator.clipboard?.writeText) {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
        "[data-rehype-pretty-code-figure] > figcaption > button",
    );

    for (const button of buttons) {
        const code = button.closest("figure")?.querySelector("code");
        if (!code || button.closest("[data-island]")) continue;

        const label = button.getAttribute("aria-label") ?? "";
        const show = (text: string, ariaLabel: string) => {
            button.textContent = text;
            button.setAttribute("aria-label", ariaLabel);
        };
        let resetTimer = 0;

        button.disabled = false;
        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(code.textContent?.replace(/\n$/, "") ?? "");
                show("Copied", "Code copied to clipboard");
            } catch {
                show("Failed", "Copying code failed");
            }
            clearTimeout(resetTimer);
            resetTimer = window.setTimeout(() => show("Copy", label), 2200);
        });
    }
}
