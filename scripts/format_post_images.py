#!/usr/bin/env python3
"""
Format and standardize covers and photos across all 11 guide templates.
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "public/posts"

POST_COVERS = {
    "cursor-ai-complete-developer-guide": {
        "cover_name": "cursor-ai-cover",
        "alt": "Cursor AI Developer Guide for Linux",
        "caption": "Agent Mode, Keyboard Shortcuts &amp; Linux Workflows",
        "dimensions": (1536, 1024)
    },
    "my-first-post": {
        "cover_name": "my-first-post-cover",
        "alt": "Welcome to Ayrix developer guides",
        "caption": "Field Notes, System Guides &amp; Reproducible Architecture",
        "dimensions": (1536, 1024)
    },
    "codex-cli-ubuntu-guide": {
        "cover_name": "codex-cover",
        "alt": "Install &amp; Configure Codex CLI on Ubuntu",
        "caption": "AI Agent In Your Terminal — Installation &amp; Configuration",
        "dimensions": (1536, 1024)
    },
    "codex-cli-ubuntu-openai-agent-guide": {
        "cover_name": "codex-ubuntu-cli-banner",
        "alt": "OpenAI Codex CLI on Ubuntu",
        "caption": "OpenAI Codex CLI Agent Setup on Ubuntu",
        "dimensions": (613, 653)
    },
    "github-cli-complete-guide": {
        "cover_name": "github-cli-cover",
        "alt": "GitHub CLI Complete Guide",
        "caption": "GitHub CLI Command &amp; Workflow Reference",
        "dimensions": (1536, 1024)
    },
    "github-install-and-usage-guide": {
        "cover_name": "github-cover",
        "alt": "GitHub and Git guide",
        "caption": "Git Setup, SSH Keys &amp; Repository Workflows",
        "dimensions": (1536, 1024)
    },
    "hugo-pages-complete-guide": {
        "cover_name": "hugo-cover",
        "alt": "Hugo static site generator guide",
        "caption": "Hugo Static Site Architecture &amp; GitHub Pages CI/CD",
        "dimensions": (1536, 1024)
    },
    "install-arch-linux-complete-guide": {
        "cover_name": "arch-cover",
        "alt": "Arch Linux installation guide",
        "caption": "Step-by-Step Arch Linux Base &amp; Desktop Installation",
        "dimensions": (1536, 1024)
    },
    "install-ubuntu-complete-guide": {
        "cover_name": "ubuntu-cover",
        "alt": "Ubuntu Linux installation guide",
        "caption": "Ubuntu 24.04 LTS Complete Desktop &amp; Server Setup",
        "dimensions": (1536, 1024)
    },
    "claude-code-ubuntu-cli-guide": {
        "cover_name": "claude-ubuntu-cli-banner",
        "alt": "Claude Code running in an Ubuntu terminal",
        "caption": "Claude Code CLI Setup on Ubuntu",
        "dimensions": (686, 608)
    },
    "welcome-to-aayrix-blog": {
        "cover_name": "welcome-cover",
        "alt": "Welcome to Ayrix developer blog",
        "caption": "Developer Guides &amp; Tutorials",
        "dimensions": (1536, 1024)
    }
}

def format_posts():
    for slug, meta in POST_COVERS.items():
        index_file = POSTS_DIR / slug / "index.html"
        if not index_file.exists():
            continue
        
        content = index_file.read_text(encoding="utf-8")
        cover_base = meta["cover_name"]
        w, h = meta["dimensions"]
        alt = meta["alt"]
        caption = meta["caption"]

        cover_markup = (
            f'<figure class="entry-cover entry-cover-3d">'
            f'<img decoding="async" width="{w}" height="{h}" loading="eager" '
            f'src="/images/covers/{cover_base}.webp" alt="{alt}">'
            f'<figcaption>{caption}</figcaption>'
            f'</figure>'
        )

        # Replace existing entry-cover or hero-image
        if re.search(r'<figure class=["\']?entry-cover\b[^>]*>[\s\S]*?<\/figure>', content):
            content = re.sub(r'<figure class=["\']?entry-cover\b[^>]*>[\s\S]*?<\/figure>', cover_markup, content, count=1)
        elif '<img src=/images/codex-cli-banner.png' in content:
            content = content.replace('<img src=/images/codex-cli-banner.png alt="Install & Configure Codex CLI on Ubuntu" class=post-hero-image>', cover_markup)
        else:
            # Insert cover right after </header> inside article
            content = re.sub(r'(<\/header>)', r'\1' + cover_markup, content, count=1)

        # Update og:image and twitter:image to point to high-res PNG cover
        png_url = f"https://ayrix.online/images/covers/{cover_base}.png"
        content = re.sub(r'<meta\s+property=["\']og:image["\']\s+content=["\'][^"\']+["\']>', f'<meta property="og:image" content="{png_url}">', content)
        content = re.sub(r'<meta\s+name=["\']twitter:image["\']\s+content=["\'][^"\']+["\']>', f'<meta name="twitter:image" content="{png_url}">', content)

        # For my-first-post, ensure body text exists
        if slug == "my-first-post" and 'class="post-content' not in content:
            body_html = """<div class="post-content md-content"><p>Welcome to <strong>Ayrix</strong> — a technical publication focused on reproducible guides, developer environments, terminal workflows, and AI coding tools.</p><p>Every article in this catalogue is tested directly on real workstations, providing verified copy-paste commands and deep system configuration.</p><h2>Publication Topics</h2><ul><li><strong>Linux Environments</strong> — Full installations and optimizations for Ubuntu LTS and Arch Linux.</li><li><strong>Developer Workflows</strong> — Git version control, SSH authentication, and GitHub CLI workflows.</li><li><strong>AI Coding Agents</strong> — Autonomous and interactive CLI agents including Claude Code, Codex, and Cursor AI.</li></ul><p>Browse the complete library under <a href="/posts/">Publications</a>.</p></div>"""
            content = content.replace('</figure>', '</figure>' + body_html)

        index_file.write_text(content, encoding="utf-8")
        print(f"Updated post: {slug}")

if __name__ == "__main__":
    format_posts()
