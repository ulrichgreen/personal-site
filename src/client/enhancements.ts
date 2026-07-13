function isInsideIsland(node: Element | null): boolean {
    return Boolean(node?.closest("[data-island]"));
}

function bootCodeBlocks() {
    const figures = Array.from(
        document.querySelectorAll<HTMLElement>(
            "[data-rehype-pretty-code-figure]",
        ),
    ).filter((figure) => !isInsideIsland(figure));

    for (const figure of figures) {
        if (figure.dataset.codeBlockEnhanced === "true") continue;

        const pre = figure.querySelector<HTMLPreElement>("pre");
        const code = figure.querySelector<HTMLElement>("code");

        if (!pre || !code) continue;

        figure.dataset.codeBlockEnhanced = "true";

        const language =
            pre.dataset.language || figure.dataset.language || "text";
        figure.dataset.language = language;

        const copyButton =
            figure.querySelector<HTMLButtonElement>("figcaption button");
        if (!copyButton) continue;

        const idleLabel = `Copy ${language} code to clipboard`;
        copyButton.setAttribute("aria-label", idleLabel);
        copyButton.dataset.state = "idle";

        if (!navigator.clipboard?.writeText) {
            copyButton.disabled = true;
            continue;
        }

        copyButton.disabled = false;

        let resetTimer = 0;
        const setState = (state: string, text: string, label: string) => {
            copyButton.dataset.state = state;
            copyButton.textContent = text;
            copyButton.setAttribute("aria-label", label);
            window.clearTimeout(resetTimer);
            if (state !== "idle") {
                resetTimer = window.setTimeout(() => {
                    setState("idle", "Copy", idleLabel);
                }, 2200);
            }
        };

        copyButton.addEventListener("click", async () => {
            const source = code.textContent?.replace(/\n$/, "") || "";
            if (!source) return;

            try {
                await navigator.clipboard.writeText(source);
                setState("copied", "Copied", "Code copied to clipboard");
            } catch {
                setState("error", "Failed", "Copying code failed");
            }
        });
    }
}

function bootReadingProgress() {
    const progress = document.getElementById("progress");
    if (!(progress instanceof HTMLElement)) return;
    let rafId = 0;

    const syncProgress = () => {
        const { documentElement, body } = document;
        const scrollTop = documentElement.scrollTop || body.scrollTop;
        const scrollHeight =
            documentElement.scrollHeight || body.scrollHeight || 0;
        const clientHeight = documentElement.clientHeight || window.innerHeight;
        const maxScroll = Math.max(scrollHeight - clientHeight, 0);
        const ratio = maxScroll === 0 ? 0 : scrollTop / maxScroll;
        progress.style.width = `${Math.min(Math.max(ratio, 0), 1) * 100}%`;
        rafId = 0;
    };

    const requestSync = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(syncProgress);
    };

    syncProgress();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
}

function bootHeadingReveal() {
    const headings = Array.from(
        document.querySelectorAll<HTMLElement>(
            "#main-content h2, #main-content h3",
        ),
    ).filter((heading) => !isInsideIsland(heading));

    if (headings.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) return;

    for (const heading of headings) {
        heading.classList.add("scroll-reveal-heading");
    }

    if (!("IntersectionObserver" in window)) {
        for (const heading of headings) {
            heading.classList.add("is-visible");
        }
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                const heading = entry.target;
                if (!(heading instanceof HTMLElement)) continue;

                heading.classList.add("is-visible");
                observer.unobserve(heading);
            }
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
        },
    );

    for (const heading of headings) {
        observer.observe(heading);
    }
}

/* Footnotes: on wide screens a click floats the note into the margin
   beside its reference (and a second click dismisses it); on narrow
   screens it toggles an inline note after the paragraph instead. */
function footnoteText(footnote: HTMLElement): string {
    const clone = footnote.cloneNode(true) as HTMLElement;
    for (const backref of clone.querySelectorAll("[data-footnote-backref]")) {
        backref.remove();
    }
    return clone.textContent?.trim() || "";
}

function bootFootnotes() {
    const hasWideMargin = window.matchMedia("(min-width: 900px)");

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element) || isInsideIsland(target)) return;

        const ref = target.closest<HTMLAnchorElement>("[data-footnote-ref]");
        if (!ref) return;

        const targetId = ref.getAttribute("href")?.replace(/^#/, "");
        if (!targetId) return;

        const footnote = document.getElementById(targetId);
        if (!footnote) return;

        event.preventDefault();

        if (hasWideMargin.matches) {
            let note = document.querySelector<HTMLElement>(
                `.margin-note[data-for="${targetId}"]`,
            );
            if (note) {
                note.remove();
                return;
            }

            const article = ref.closest("article");
            if (!article) return;

            note = document.createElement("aside");
            note.className = "margin-note";
            note.dataset.for = targetId;
            note.dataset.ref = ref.textContent?.trim() || "";
            note.textContent = footnoteText(footnote);

            article.style.position = "relative";
            article.appendChild(note);

            const refRect = ref.getBoundingClientRect();
            const articleRect = article.getBoundingClientRect();
            note.style.top = `${refRect.top - articleRect.top}px`;
            return;
        }

        let inline = document.getElementById(`inline-${targetId}`);
        if (!inline) {
            // Insert after the reference's block ancestor: a block note
            // inside the paragraph would be invalid markup.
            const block = ref.closest("p, li, blockquote") ?? ref;
            inline = document.createElement("aside");
            inline.className = "fn-inline";
            inline.id = `inline-${targetId}`;
            inline.textContent = footnoteText(footnote);
            block.insertAdjacentElement("afterend", inline);
        }

        inline.classList.toggle("is-open");
    });
}

export function bootEnhancements() {
    if (!document.body) return;
    if (document.body.dataset.enhancementsBooted === "true") return;
    document.body.dataset.enhancementsBooted = "true";

    bootCodeBlocks();
    bootReadingProgress();
    bootHeadingReveal();
    bootFootnotes();
}
