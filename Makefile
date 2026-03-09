# ============================================================
# personal-site — build orchestration
# Usage:
#   make          — build everything
#   make clean    — remove dist/
#   make watch    — start dev server with live reload
# ============================================================

SHELL := /bin/bash
TSX := pnpm exec tsx

CONTENT_PAGES := $(wildcard content/*.md)
WRITING_PAGES := $(wildcard content/writing/*.md)

DIST_PAGES    := $(CONTENT_PAGES:content/%.md=dist/%.html)
DIST_WRITING  := $(WRITING_PAGES:content/writing/%.md=dist/writing/%.html)

.PHONY: build clean watch

# Default target
build: dist/style.css dist/site.js $(DIST_PAGES) $(DIST_WRITING) dist/index.html

# CSS — process src/style.css through lightningcss
dist/style.css: src/styles/style.css src/styles/reset.css src/styles/tokens.css src/styles/base.css src/styles/layout.css src/styles/components.css src/styles/utilities.css src/styles/motion.css src/styles/print.css src/build/css.ts
	@mkdir -p dist
	$(TSX) src/build/css.ts

# Client JS — bundle the browser entry
dist/site.js: src/client/site.ts src/build/client.ts
	@mkdir -p dist
	$(TSX) src/build/client.ts

# Prose pages — content/*.md (not index.md, which is generated separately)
dist/%.html: content/%.md src/build/frontmatter.ts src/build/md2html.ts src/build/template.ts src/runtime/jsx-runtime.ts src/runtime/load-jsx.ts src/runtime/render-html.ts src/runtime/jsx.d.ts src/templates/base.tsx src/templates/article.tsx src/components/site-head.tsx src/components/running-header.tsx src/components/article-header.tsx src/types/content.ts tsconfig.json
	@mkdir -p $(@D)
	cat $< | $(TSX) src/build/frontmatter.ts | $(TSX) src/build/md2html.ts | $(TSX) src/build/template.ts > $@

# Writing articles — content/writing/*.md
dist/writing/%.html: content/writing/%.md src/build/frontmatter.ts src/build/md2html.ts src/build/template.ts src/runtime/jsx-runtime.ts src/runtime/load-jsx.ts src/runtime/render-html.ts src/runtime/jsx.d.ts src/templates/base.tsx src/templates/article.tsx src/components/site-head.tsx src/components/running-header.tsx src/components/article-header.tsx src/types/content.ts tsconfig.json
	@mkdir -p $(@D)
	cat $< | $(TSX) src/build/frontmatter.ts | $(TSX) src/build/md2html.ts | $(TSX) src/build/template.ts > $@

# Index — generated from all writing front matter
dist/index.html: $(WRITING_PAGES) content/index.md src/build/index.ts src/runtime/jsx-runtime.ts src/runtime/load-jsx.ts src/runtime/render-html.ts src/runtime/jsx.d.ts src/templates/base.tsx src/components/site-head.tsx src/components/running-header.tsx src/types/content.ts tsconfig.json
	@mkdir -p dist
	$(TSX) src/build/index.ts > $@

# Dev server
watch:
	$(TSX) src/build/dev.ts

# Remove output
clean:
	rm -rf dist
