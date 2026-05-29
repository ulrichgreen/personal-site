import { Picture } from "../picture.tsx";
import { SITE_DOMAIN } from "../../config.ts";

interface HeroPortrait {
    /** Path to fallback image (JPEG / SVG). */
    src: string;
    srcWebp?: string;
    srcAvif?: string;
    alt?: string;
    width?: number;
    height?: number;
}

interface HeroProps {
    tagline?: string;
    portrait?: HeroPortrait;
}

/**
 * Home-page hero. Renders an editorial cover block:
 *   kicker → name → (optional portrait) → rule → tagline → meta bar
 *
 * To include a portrait from index.mdx:
 *   <Hero portraitSrc="/images/portrait.avif"
 *         portraitFallback="/images/portrait.jpg" />
 *
 * Portrait should be a 4:5 portrait-ratio image.
 * Optimal pipeline: source.jpg → portrait.webp + portrait.avif via sharp.
 */
export function Hero({
    tagline = "Product engineer and designer. I write about the intersection of constraints, craft, and clarity.",
    portrait,
}: HeroProps) {
    const hasPortrait = Boolean(portrait?.src);

    return (
        <section className="hero section" aria-labelledby="hero-name">
            <p className="eyebrow label" aria-hidden="true">
                Product engineer &amp; designer
            </p>

            <div className="hero-body">
                <h1
                    className="hero-name heading-display"
                    id="hero-name"
                >
                    Ulrich <em>Green</em>
                </h1>

                {hasPortrait && portrait && (
                    <div className="hero-portrait" aria-hidden="true">
                        <Picture
                            src={portrait.src}
                            srcWebp={portrait.srcWebp}
                            srcAvif={portrait.srcAvif}
                            alt={portrait.alt ?? ""}
                            width={portrait.width ?? 320}
                            height={portrait.height ?? 400}
                            loading="eager"
                            fetchPriority="high"
                        />
                    </div>
                )}
            </div>

            <p className="hero-tagline lede body-lg">{tagline}</p>

            <p className="hero-meta label" aria-label="About">
                <span>London</span>
                <span>{SITE_DOMAIN}</span>
                <span>
                    <a href="#articles">Articles</a>
                </span>
            </p>
        </section>
    );
}
