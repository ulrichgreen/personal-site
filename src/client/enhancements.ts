function isInsideIsland(node: Element | null): boolean {
    return Boolean(node?.closest("[data-island]"));
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

export function bootEnhancements() {
    if (!document.body) return;
    if (document.body.dataset.enhancementsBooted === "true") return;
    document.body.dataset.enhancementsBooted = "true";

    bootReadingProgress();
    bootHeadingReveal();

    const hasWideMargin = window.matchMedia("(min-width: 900px)");

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element) || isInsideIsland(target)) return;

        const ref = target.closest<HTMLAnchorElement>(".fn-ref");
        if (!ref) return;

        event.preventDefault();

        const targetId = ref.getAttribute("href") || ref.dataset.fn;
        if (!targetId) return;

        const footnote = document.getElementById(targetId.replace(/^#/, ""));
        if (!footnote) return;

        if (hasWideMargin.matches) {
            let note = document.querySelector<HTMLElement>(
                `.margin-note[data-for="${targetId.replace(/^#/, "")}"]`,
            );
            if (!note) {
                note = document.createElement("aside");
                note.className = "margin-note";
                note.dataset.for = targetId.replace(/^#/, "");
                note.dataset.ref = ref.textContent?.trim() || "";
                note.textContent = footnote.textContent || "";

                const article = ref.closest("article");
                if (article) {
                    article.style.position = "relative";
                    article.appendChild(note);
                }
            }

            const article = ref.closest("article");
            if (!article || !note) return;

            const refRect = ref.getBoundingClientRect();
            const articleRect = article.getBoundingClientRect();
            note.style.top = `${refRect.top - articleRect.top}px`;
            return;
        }

        let inline = document.getElementById(
            `inline-${targetId.replace(/^#/, "")}`,
        );
        if (!inline) {
            inline = document.createElement("div");
            inline.className = "fn-inline";
            inline.id = `inline-${targetId.replace(/^#/, "")}`;
            inline.textContent = footnote.textContent || "";
            ref.insertAdjacentElement("afterend", inline);
        }

        inline.classList.toggle("is-open");
    });
}
