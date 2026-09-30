import { useRenderContext } from "../../context/render-context.tsx";

export function SiteFooter() {
    const { frontPageOnly } = useRenderContext();
    return (
        <footer>
            <span>ulrich.green</span>
            <small>Text files, carefully considered</small>
            <nav aria-label="Footer">
                {!frontPageOnly && (
                    <>
                        <a href="/colophon.html">Colophon</a>
                        <a href="/cv.html">CV</a>
                        <a href="/feed.xml">Feed</a>
                    </>
                )}
                <a href="mailto:hey@ulrich.green">Say hello</a>
            </nav>
        </footer>
    );
}
