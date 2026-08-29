#!/usr/bin/env python3
"""Generate the Cursor AI blog post HTML."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POST = ROOT / "public/posts/cursor-ai-complete-developer-guide/index.html"

TITLE = "Cursor AI — Complete Developer Guide for Linux"
SLUG = "cursor-ai-complete-developer-guide"
DESC = (
    "Install Cursor on Linux, configure AI-assisted coding, use Agent mode, "
    "and boost productivity with keyboard shortcuts and rules."
)
DATE_ISO = "2026-08-29T10:00:00+05:00"
DATE_DISPLAY = "August 29, 2026"
DATE_TITLE = "2026-08-29 10:00:00 +0500 PKT"
READ_TIME = "4 min"
WORDS = "680"
URL = f"https://ayrix.online/posts/{SLUG}/"
TAGS = ["Cursor", "Ai", "Devtools", "Guide", "Tutorials"]

THEME_ICON = (
    '<svg class="moon" width="17" height="17" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
    '<svg class="sun" width="17" height="17" viewBox="0 0 24 24" fill="none" '
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>'
    '<line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>'
    '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>'
    '<line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>'
    '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
)

HEADER = f"""<header class=header><nav class=header-nav><div class=logo><a href=https://ayrix.online/ accesskey=h title="Aayrix (Alt + H)">Aayrix</a><div class=logo-switches><button id=theme-toggle class=theme-toggle accesskey=t title="(Alt + T)" aria-label="Toggle theme">
{THEME_ICON}</button></div></div><ul id=menu class=menu><li><a href=https://ayrix.online/ title=Home><span>Home</span></a></li><li><a href=https://ayrix.online/posts/ title=Publications><span>Publications</span></a></li><li><a href=https://ayrix.online/tags/ title=Tags><span>Tags</span></a></li><li><a href=https://ayrix.online/categories/ title=Categories><span>Categories</span></a></li><li><a href=https://ayrix.online/about/ title="About Me"><span>About Me</span></a></li><li><a href=https://ayrix.online/contact/ title=Contact><span>Contact</span></a></li></ul></nav></header>"""

FOOTER = """<footer class=footer><span>© {year} Aayrix. All rights reserved.</span> ·
<span>Built with HTML &amp; CSS</span></footer><a href=#top id=top-link class="top-link hidden" aria-label="go to top" title="Go to Top (Alt + G)" accesskey=g><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-up"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>
</a><span>· </span><a href=mailto:aliyanniazi370@gmail.com>aliyanniazi370@gmail.com</a>"""

CONTENT = """
<p><strong>Cursor</strong> is an AI-powered code editor built on VS Code. It combines familiar editing with an AI agent that can read your codebase, run commands, edit files, and help you ship faster. This guide covers installation on Linux, first-time setup, and the features I use daily as a developer.</p>
<blockquote><p><strong>Prerequisites:</strong> A Linux desktop (Ubuntu, Arch, or Fedora) and a <a href=https://cursor.com>Cursor account</a>.</p></blockquote>
<h2 id=table-of-contents>Table of Contents<a hidden class=anchor aria-hidden=true href=#table-of-contents>#</a></h2>
<ol><li><a href=#1-install-cursor-on-linux>Install Cursor on Linux</a></li><li><a href=#2-first-time-setup>First-Time Setup</a></li><li><a href=#3-core-features>Core Features</a></li><li><a href=#4-keyboard-shortcuts>Keyboard Shortcuts</a></li><li><a href=#5-rules-and-customization>Rules &amp; Customization</a></li><li><a href=#6-productivity-tips>Productivity Tips</a></li></ol>
<hr>
<h2 id=1-install-cursor-on-linux>1. Install Cursor on Linux<a hidden class=anchor aria-hidden=true href=#1-install-cursor-on-linux>#</a></h2>
<p>Download the latest build from <a href=https://cursor.com/downloads>cursor.com/downloads</a>. Choose the <code>.AppImage</code> or <code>.deb</code> package for your distro.</p>
<h3 id=appimage-method>AppImage (works on any distro)<a hidden class=anchor aria-hidden=true href=#appimage-method>#</a></h3>
<div class=highlight><pre tabindex=0 class=chroma><code class=language-bash data-lang=bash><span class=line><span class=cl>chmod +x cursor-*.AppImage
</span></span><span class=line><span class=cl>./cursor-*.AppImage
</span></span></code></pre></div>
<p>Move it to a permanent location and optionally add a desktop entry:</p>
<div class=highlight><pre tabindex=0 class=chroma><code class=language-bash data-lang=bash><span class=line><span class=cl>mkdir -p ~/.local/bin
</span></span><span class=line><span class=cl>mv cursor-*.AppImage ~/.local/bin/cursor
</span></span><span class=line><span class=cl>~/.local/bin/cursor
</span></span></code></pre></div>
<h3 id=deb-method>Debian / Ubuntu (.deb)<a hidden class=anchor aria-hidden=true href=#deb-method>#</a></h3>
<div class=highlight><pre tabindex=0 class=chroma><code class=language-bash data-lang=bash><span class=line><span class=cl>sudo dpkg -i cursor_*.deb
</span></span><span class=line><span class=cl>sudo apt-get install -f -y   <span class=c1># fix missing dependencies</span>
</span></span><span class=line><span class=cl>cursor
</span></span></code></pre></div>
<h3 id=arch-method>Arch Linux (AUR)<a hidden class=anchor aria-hidden=true href=#arch-method>#</a></h3>
<div class=highlight><pre tabindex=0 class=chroma><code class=language-bash data-lang=bash><span class=line><span class=cl>yay -S cursor-bin
</span></span><span class=line><span class=cl><span class=c1># or</span>
</span></span><span class=line><span class=cl>paru -S cursor-bin
</span></span></code></pre></div>
<hr>
<h2 id=2-first-time-setup>2. First-Time Setup<a hidden class=anchor aria-hidden=true href=#2-first-time-setup>#</a></h2>
<ol><li>Launch Cursor and sign in with GitHub or email.</li><li>Open a project folder: <strong>File → Open Folder</strong> or <code>Ctrl+K Ctrl+O</code>.</li><li>Choose your default AI model in <strong>Settings → Models</strong>.</li><li>Enable <strong>Privacy Mode</strong> in settings if you work on sensitive codebases.</li></ol>
<p>Cursor imports most VS Code extensions and keybindings automatically, so your existing setup usually carries over.</p>
<hr>
<h2 id=3-core-features>3. Core Features<a hidden class=anchor aria-hidden=true href=#3-core-features>#</a></h2>
<h3 id=chat-mode>Chat (Ask)<a hidden class=anchor aria-hidden=true href=#chat-mode>#</a></h3>
<p>Open the chat panel with <code>Ctrl+L</code>. Ask questions about your code, request refactors, or debug errors. Use <code>@</code> to reference files, folders, docs, or the web.</p>
<h3 id=agent-mode>Agent Mode<a hidden class=anchor aria-hidden=true href=#agent-mode>#</a></h3>
<p>Agent mode (<code>Ctrl+I</code>) lets the AI make multi-file edits, run terminal commands, and iterate on tasks autonomously. Great for feature work, bug fixes, and scaffolding new projects.</p>
<h3 id=tab-completion>Tab Completion<a hidden class=anchor aria-hidden=true href=#tab-completion>#</a></h3>
<p>Cursor predicts your next edit inline — not just the next line. Press <code>Tab</code> to accept suggestions as you type. This alone can save hours per week.</p>
<h3 id=inline-edit>Inline Edit<a hidden class=anchor aria-hidden=true href=#inline-edit>#</a></h3>
<p>Select code and press <code>Ctrl+K</code> to describe a change in plain English. Cursor rewrites the selection in place.</p>
<hr>
<h2 id=4-keyboard-shortcuts>4. Keyboard Shortcuts<a hidden class=anchor aria-hidden=true href=#4-keyboard-shortcuts>#</a></h2>
<table><thead><tr><th>Shortcut</th><th>Action</th></tr></thead><tbody>
<tr><td><code>Ctrl+L</code></td><td>Open AI chat</td></tr>
<tr><td><code>Ctrl+I</code></td><td>Open Agent mode</td></tr>
<tr><td><code>Ctrl+K</code></td><td>Inline edit selection</td></tr>
<tr><td><code>Tab</code></td><td>Accept AI suggestion</td></tr>
<tr><td><code>Ctrl+Shift+P</code></td><td>Command palette</td></tr>
<tr><td><code>Ctrl+`</code></td><td>Toggle terminal</td></tr>
</tbody></table>
<hr>
<h2 id=5-rules-and-customization>5. Rules &amp; Customization<a hidden class=anchor aria-hidden=true href=#5-rules-and-customization>#</a></h2>
<p>Cursor supports <strong>Rules</strong> — persistent instructions that shape how the AI behaves in your project. Add them via <strong>Settings → Rules</strong> or create <code>.cursor/rules/</code> files in your repo.</p>
<p>Example project rule:</p>
<div class=highlight><pre tabindex=0 class=chroma><code class=language-markdown data-lang=markdown><span class=line><span class=cl>- Use TypeScript strict mode
</span></span><span class=line><span class=cl>- Follow existing naming conventions in the codebase
</span></span><span class=line><span class=cl>- Write minimal, focused diffs — no unrelated changes
</span></span></code></pre></div>
<p>You can also set user-level rules that apply across all projects, like preferred language, commit style, or testing requirements.</p>
<hr>
<h2 id=6-productivity-tips>6. Productivity Tips<a hidden class=anchor aria-hidden=true href=#6-productivity-tips>#</a></h2>
<ul>
<li><strong>Be specific</strong> — include file paths, error messages, and expected behavior in prompts.</li>
<li><strong>Use @ references</strong> — point the agent at relevant files instead of pasting large blocks.</li>
<li><strong>Review diffs</strong> — always check Agent changes before accepting; treat AI output like a PR review.</li>
<li><strong>Combine with Git</strong> — commit before big agent tasks so you can revert easily. See the <a href=/posts/github-install-and-usage-guide/>GitHub Guide</a>.</li>
<li><strong>Terminal access</strong> — let the agent run build/test commands to verify its own changes.</li>
</ul>
<hr>
<h2 id=related-guides>Related Guides<a hidden class=anchor aria-hidden=true href=#related-guides>#</a></h2>
<p>Pair Cursor with solid tooling workflows:</p>
<ul>
<li><a href=/posts/github-cli-complete-guide/>GitHub CLI Guide</a> — manage repos from the terminal</li>
<li><a href=/posts/install-ubuntu-complete-guide/>Ubuntu Installation Guide</a> — set up your Linux dev environment</li>
<li><a href=/posts/hugo-pages-complete-guide/>Hugo Static Sites</a> — deploy projects like this blog</li>
</ul>
<p>Check out my projects on <strong><a href=https://github.com/aayrix>github.com/aayrix</a></strong>.</p>
"""

tag_links = "".join(
    f'<li><a href=https://ayrix.online/tags/{t.lower()}/>{t}</a></li>' for t in TAGS
)
article_tags_meta = "".join(
    f'<meta property="article:tag" content="{t}">' for t in TAGS
)
keywords = ",".join(t.lower() for t in TAGS)

html = f"""<!doctype html><html lang=en dir=auto data-theme=dark><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1,shrink-to-fit=no"><meta name=robots content="index, follow"><title>{TITLE} | Aayrix</title><meta name=keywords content="{keywords}"><meta name=description content="{DESC}"><meta name=author content="Aliyan"><link rel=canonical href={URL}><link crossorigin=anonymous href=/assets/css/stylesheet.4ea0df3983f223cad367032f4b80a5ef62ddcd0a18dcab9c723feaeb274b6e7c.css integrity="sha256-TqDfOYPyI8rTZwMvS4Cl72LdzQoY3Kuccj/q6ydLbnw=" rel="preload stylesheet" as=style><link rel=icon href=https://ayrix.online/favicon.ico><link rel=icon type=image/png sizes=16x16 href=https://ayrix.online/favicon-16x16.png><link rel=icon type=image/png sizes=32x32 href=https://ayrix.online/favicon-32x32.png><link rel=apple-touch-icon href=https://ayrix.online/apple-touch-icon.png><link rel=mask-icon href=https://ayrix.online/safari-pinned-tab.svg><meta name=theme-color content="#07111f"><meta name=msapplication-TileColor content="#07111f"><link rel=alternate hreflang=en href={URL}><noscript><style>#theme-toggle,.top-link{{display:none}}</style></noscript><link rel=preconnect href=https://fonts.googleapis.com><link rel=preconnect href=https://fonts.gstatic.com crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel=stylesheet><meta property="og:url" content="{URL}"><meta property="og:site_name" content="Aayrix"><meta property="og:title" content="{TITLE}"><meta property="og:description" content="{DESC}"><meta property="og:locale" content="en_us"><meta property="og:type" content="article"><meta property="article:section" content="posts"><meta property="article:published_time" content="{DATE_ISO}"><meta property="article:modified_time" content="{DATE_ISO}">{article_tags_meta}<meta property="og:image" content="https://ayrix.online/images/covers/welcome-cover.png"><meta name=twitter:card content="summary_large_image"><meta name=twitter:image content="https://ayrix.online/images/covers/welcome-cover.png"><meta name=twitter:title content="{TITLE}"><meta name=twitter:description content="{DESC}"><link rel="stylesheet" href="/assets/css/ayrix-motion.css"><link rel="stylesheet" href="/assets/css/ayrix-redesign.css"></head><body id=top>
{HEADER}<main class=main><article class=post-single><header class=post-header><nav class=breadcrumbs role=navigation aria-label=Breadcrumb><a href=/>Home</a>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"/></svg>
<a href=/posts/>Publications</a>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"/></svg></nav><h1 class="post-title entry-hint-parent">{TITLE}</h1><div class=post-description>{DESC}</div><div class=post-meta><span title='{DATE_TITLE}'>{DATE_DISPLAY}</span>&nbsp;·&nbsp;<span>{READ_TIME}</span>&nbsp;·&nbsp;<span>{WORDS} words</span>&nbsp;·&nbsp;<span>Aliyan</span></div></header><figure class=entry-cover><img loading=eager src=https://ayrix.online/images/covers/welcome-cover.png alt="Cursor AI developer guide"><figcaption>AI-Assisted Development with Cursor</figcaption></figure><details class=toc><summary accesskey=c title="(Alt + C)"><span class=title>Table of Contents</span></summary><div class=inner><ul><li><a href=#table-of-contents aria-label="Table of Contents">Table of Contents</a></li><li><a href=#1-install-cursor-on-linux aria-label="1. Install Cursor on Linux">1. Install Cursor on Linux</a></li><li><a href=#2-first-time-setup aria-label="2. First-Time Setup">2. First-Time Setup</a></li><li><a href=#3-core-features aria-label="3. Core Features">3. Core Features</a></li><li><a href=#4-keyboard-shortcuts aria-label="4. Keyboard Shortcuts">4. Keyboard Shortcuts</a></li><li><a href=#5-rules-and-customization aria-label="5. Rules &amp; Customization">5. Rules &amp; Customization</a></li><li><a href=#6-productivity-tips aria-label="6. Productivity Tips">6. Productivity Tips</a></li></ul></div></details><div class="post-content md-content">{CONTENT}</div><footer class=post-footer><ul class=post-tags>{tag_links}</ul><nav class=paginav><a class=next href=https://ayrix.online/posts/install-ubuntu-complete-guide/><span class=title>Next »</span>
<span>How to Install Ubuntu — Complete Step-by-Step Guide</span></a></nav></footer></article></main>
{FOOTER}
</body></html>
"""

POST.parent.mkdir(parents=True, exist_ok=True)
POST.write_text(html, encoding="utf-8")
print(f"Wrote {POST}")
