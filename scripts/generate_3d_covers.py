#!/usr/bin/env python3
"""
Generate bespoke 1536x1024 3D-styled cover graphics for Ayrix guides.
Outputs both PNG and optimized WebP into public/images/covers/.
"""

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COVERS_DIR = ROOT / "public/images/covers"
COVERS_DIR.mkdir(parents=True, exist_ok=True)

COVERS = {
    "cursor-ai-cover": {
        "badge": "AI CODING AGENTS",
        "title": "Cursor AI Developer Guide",
        "subtitle": "Agent Mode, Keyboard Shortcuts &amp; Linux Workflows",
        "accent": "#38bdf8",
        "accent_glow": "#0284c7",
        "theme_color": "#818cf8",
        "svg_graphics": """
        <!-- 3D Isometric Code Editor Window -->
        <g transform="translate(900, 320) rotate(-12) skewX(-15)">
            <!-- Shadow layer -->
            <rect x="25" y="25" width="460" height="340" rx="20" fill="#000000" opacity="0.5" filter="blur(15px)"/>
            <!-- Main Window Body -->
            <rect x="0" y="0" width="460" height="340" rx="18" fill="#0a1628" stroke="#38bdf8" stroke-width="2.5"/>
            <!-- Window Titlebar -->
            <rect x="0" y="0" width="460" height="42" rx="18" fill="#0f2139"/>
            <circle cx="28" cy="21" r="6" fill="#f87171"/>
            <circle cx="50" cy="21" r="6" fill="#fbbf24"/>
            <circle cx="72" cy="21" r="6" fill="#34d399"/>
            <text x="100" y="27" fill="#94a3b8" font-family="monospace" font-size="14">cursor ~ main.py (AI Agent)</text>
            
            <!-- Code Lines with Syntax Coloring -->
            <rect x="30" y="70" width="120" height="12" rx="4" fill="#818cf8"/>
            <rect x="160" y="70" width="80" height="12" rx="4" fill="#38bdf8"/>
            <rect x="50" y="100" width="180" height="10" rx="3" fill="#64748b"/>
            <rect x="50" y="125" width="240" height="10" rx="3" fill="#64748b"/>
            
            <!-- AI Prompt Floating Banner -->
            <rect x="40" y="160" width="380" height="130" rx="12" fill="#0c233c" stroke="#34d399" stroke-width="1.8"/>
            <text x="60" y="195" fill="#34d399" font-family="monospace" font-size="15" font-weight="bold">✦ Cursor Composer (Agent)</text>
            <text x="60" y="225" fill="#e2e8f0" font-family="monospace" font-size="14">Generating full-stack 3D scene...</text>
            <rect x="60" y="245" width="200" height="8" rx="4" fill="#34d399" opacity="0.6"/>
            <rect x="60" y="260" width="140" height="8" rx="4" fill="#38bdf8" opacity="0.6"/>
        </g>

        <!-- 3D Floating Neural Spheres & Connecting Nodes -->
        <g stroke="#38bdf8" stroke-width="1.5" opacity="0.7">
            <line x1="820" y1="260" x2="900" y2="340"/>
            <line x1="900" y1="340" x2="1380" y2="300"/>
            <line x1="900" y1="340" x2="1050" y2="720"/>
            <line x1="1380" y1="300" x2="1320" y2="680"/>
        </g>
        <circle cx="820" cy="260" r="14" fill="#38bdf8" filter="drop-shadow(0 0 12px #38bdf8)"/>
        <circle cx="1380" cy="300" r="18" fill="#818cf8" filter="drop-shadow(0 0 16px #818cf8)"/>
        <circle cx="1050" cy="720" r="16" fill="#34d399" filter="drop-shadow(0 0 14px #34d399)"/>
        <circle cx="1320" cy="680" r="22" fill="#38bdf8" filter="drop-shadow(0 0 20px #38bdf8)"/>
        """
    },
    "my-first-post-cover": {
        "badge": "AYRIX GENESIS",
        "title": "Welcome to Ayrix",
        "subtitle": "Field Notes, System Guides &amp; Reproducible Architecture",
        "accent": "#10b981",
        "accent_glow": "#059669",
        "theme_color": "#34d399",
        "svg_graphics": """
        <!-- 3D Monogram & Isometric Cyber Pillar -->
        <g transform="translate(1080, 480)">
            <!-- 3D Isometric Cube / Platform -->
            <polygon points="0,-160 180,-60 0,40 -180,-60" fill="#0f263e" stroke="#10b981" stroke-width="2"/>
            <polygon points="-180,-60 0,40 0,220 -180,120" fill="#091829" stroke="#10b981" stroke-width="2"/>
            <polygon points="0,40 180,-60 180,120 0,220" fill="#14324f" stroke="#10b981" stroke-width="2"/>
            
            <!-- Glowing Inner Ayrix Monogram "A" in 3D Space -->
            <path d="M-50, -40 L0, -130 L50, -40 M-30, -70 L30, -70" fill="none" stroke="#34d399" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 18px #34d399)"/>
            
            <!-- Floating Orbital Rings -->
            <ellipse cx="0" cy="30" rx="260" ry="90" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="16 12" transform="rotate(-20)"/>
            <ellipse cx="0" cy="30" rx="230" ry="75" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="10 8" transform="rotate(35)"/>
        </g>
        
        <!-- Terminal Boot Badges -->
        <g transform="translate(860, 240)">
            <rect x="0" y="0" width="240" height="48" rx="10" fill="#0b1e33" stroke="#34d399" stroke-width="1.5"/>
            <text x="20" y="30" fill="#34d399" font-family="monospace" font-size="16">$ ayrix init --pure</text>
        </g>
        <g transform="translate(1220, 340)">
            <rect x="0" y="0" width="200" height="44" rx="10" fill="#0b1e33" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="20" y="28" fill="#38bdf8" font-family="monospace" font-size="15">✓ 3D site active</text>
        </g>
        """
    },
    "codex-cover": {
        "badge": "UBUNTU &amp; OPENAI",
        "title": "Codex CLI on Ubuntu",
        "subtitle": "Install, Connect OpenAI Account &amp; Master Terminal Workflows",
        "accent": "#10b981",
        "accent_glow": "#047857",
        "theme_color": "#f97316",
        "svg_graphics": """
        <!-- 3D Floating Terminal with Codex AI Assistant -->
        <g transform="translate(880, 310) rotate(-6) skewX(-10)">
            <rect x="20" y="20" width="500" height="350" rx="20" fill="#000000" opacity="0.6" filter="blur(20px)"/>
            <rect x="0" y="0" width="500" height="350" rx="18" fill="#081424" stroke="#10b981" stroke-width="2.5"/>
            <!-- Title Bar -->
            <rect x="0" y="0" width="500" height="42" rx="18" fill="#0d2138"/>
            <circle cx="28" cy="21" r="6" fill="#f87171"/>
            <circle cx="50" cy="21" r="6" fill="#fbbf24"/>
            <circle cx="72" cy="21" r="6" fill="#34d399"/>
            <text x="100" y="27" fill="#94a3b8" font-family="monospace" font-size="14">bash - ayrix@ubuntu: ~</text>

            <!-- Terminal Output -->
            <text x="30" y="80" fill="#94a3b8" font-family="monospace" font-size="15">$ npm install -g @openai/codex</text>
            <text x="30" y="115" fill="#34d399" font-family="monospace" font-size="15">✓ Installed Codex CLI v0.8.2</text>
            <text x="30" y="150" fill="#94a3b8" font-family="monospace" font-size="15">$ codex auth login</text>
            <text x="30" y="185" fill="#38bdf8" font-family="monospace" font-size="15">✓ Authentication key confirmed</text>
            
            <!-- AI Execution Card -->
            <rect x="25" y="220" width="450" height="95" rx="10" fill="#0b2438" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="45" y="255" fill="#38bdf8" font-family="monospace" font-size="15" font-weight="bold">AI Agent > Executing pipeline...</text>
            <text x="45" y="285" fill="#e2e8f0" font-family="monospace" font-size="14">Updating Ubuntu kernel packages &amp; configs</text>
        </g>

        <!-- 3D Rotating Gyroscope Nodes -->
        <ellipse cx="1200" cy="620" rx="180" ry="70" fill="none" stroke="#f97316" stroke-width="2" transform="rotate(-30 1200 620)"/>
        <ellipse cx="1200" cy="620" rx="150" ry="55" fill="none" stroke="#10b981" stroke-width="2" transform="rotate(45 1200 620)"/>
        <circle cx="1200" cy="620" r="16" fill="#f97316" filter="drop-shadow(0 0 16px #f97316)"/>
        """
    },
    "github-cli-cover": {
        "badge": "COMMAND LINE TOOLS",
        "title": "GitHub CLI Reference",
        "subtitle": "Complete gh Command Manual for Modern Developers",
        "accent": "#a855f7",
        "accent_glow": "#7e22ce",
        "theme_color": "#38bdf8",
        "svg_graphics": """
        <!-- 3D Git Branch Tree & Isometric PR Visualizer -->
        <g transform="translate(920, 300) rotate(8) skewX(8)">
            <rect x="20" y="20" width="480" height="360" rx="20" fill="#000000" opacity="0.6" filter="blur(20px)"/>
            <rect x="0" y="0" width="480" height="360" rx="18" fill="#0c172a" stroke="#a855f7" stroke-width="2.5"/>
            
            <!-- Window header -->
            <rect x="0" y="0" width="480" height="42" rx="18" fill="#14213d"/>
            <circle cx="28" cy="21" r="6" fill="#f87171"/>
            <circle cx="50" cy="21" r="6" fill="#fbbf24"/>
            <circle cx="72" cy="21" r="6" fill="#34d399"/>
            <text x="100" y="27" fill="#cbd5e1" font-family="monospace" font-size="14">gh repo &amp; pr workflow</text>
            
            <!-- Terminal gh commands -->
            <text x="30" y="85" fill="#a855f7" font-family="monospace" font-size="15" font-weight="bold">$ gh auth status</text>
            <text x="30" y="115" fill="#34d399" font-family="monospace" font-size="14">✓ Logged in to github.com as aayrix</text>
            <text x="30" y="155" fill="#a855f7" font-family="monospace" font-size="15" font-weight="bold">$ gh pr create --fill</text>
            <text x="30" y="185" fill="#38bdf8" font-family="monospace" font-size="14">Creating pull request for branch 3d-site</text>
            
            <!-- PR Status Card -->
            <rect x="25" y="220" width="430" height="105" rx="12" fill="#17223b" stroke="#34d399" stroke-width="1.6"/>
            <text x="45" y="255" fill="#34d399" font-family="monospace" font-size="16" font-weight="bold">#42 PR MERGED: 3D Website Redesign</text>
            <text x="45" y="285" fill="#94a3b8" font-family="monospace" font-size="14">12 commits · 14 files changed · All checks passed</text>
        </g>
        
        <!-- 3D Git Commit Nodes Floating -->
        <g transform="translate(1360, 520)">
            <circle cx="0" cy="-90" r="16" fill="#a855f7" filter="drop-shadow(0 0 14px #a855f7)"/>
            <line x1="0" y1="-74" x2="0" y2="0" stroke="#a855f7" stroke-width="4"/>
            <circle cx="0" cy="0" r="20" fill="#38bdf8" filter="drop-shadow(0 0 18px #38bdf8)"/>
            <line x1="0" y1="20" x2="0" y2="90" stroke="#34d399" stroke-width="4"/>
            <circle cx="0" cy="90" r="16" fill="#34d399" filter="drop-shadow(0 0 14px #34d399)"/>
        </g>
        """
    },
    "claude-code-cover": {
        "badge": "ANTHROPIC CLI",
        "title": "Claude Code on Ubuntu",
        "subtitle": "Terminal Agent Setup, Authentication &amp; Safe Workflows",
        "accent": "#ea580c",
        "accent_glow": "#c2410c",
        "theme_color": "#f59e0b",
        "svg_graphics": """
        <!-- 3D Isometric Terminal with Claude Code Agent -->
        <g transform="translate(880, 310) rotate(-7) skewX(-10)">
            <rect x="20" y="20" width="500" height="360" rx="20" fill="#000000" opacity="0.6" filter="blur(20px)"/>
            <rect x="0" y="0" width="500" height="360" rx="18" fill="#0c1626" stroke="#ea580c" stroke-width="2.5"/>
            <!-- Title Bar -->
            <rect x="0" y="0" width="500" height="42" rx="18" fill="#142236"/>
            <circle cx="28" cy="21" r="6" fill="#f87171"/>
            <circle cx="50" cy="21" r="6" fill="#fbbf24"/>
            <circle cx="72" cy="21" r="6" fill="#34d399"/>
            <text x="100" y="27" fill="#94a3b8" font-family="monospace" font-size="14">claude ~ agentic terminal (Ubuntu)</text>

            <!-- Terminal Output -->
            <text x="30" y="80" fill="#94a3b8" font-family="monospace" font-size="15">$ npm install -g @anthropic-ai/claude-code</text>
            <text x="30" y="115" fill="#34d399" font-family="monospace" font-size="15">✓ Claude Code CLI installed</text>
            <text x="30" y="150" fill="#94a3b8" font-family="monospace" font-size="15">$ claude doctor</text>
            <text x="30" y="185" fill="#f59e0b" font-family="monospace" font-size="15">✓ Authenticated via Anthropic Console</text>

            <!-- AI Agent Interactive Card -->
            <rect x="25" y="220" width="450" height="105" rx="12" fill="#182338" stroke="#f59e0b" stroke-width="1.6"/>
            <text x="45" y="255" fill="#ea580c" font-family="monospace" font-size="15" font-weight="bold">✻ Claude Code > Agent session active</text>
            <text x="45" y="285" fill="#e2e8f0" font-family="monospace" font-size="14">Explaining architecture &amp; proposing safe git checkpoint</text>
        </g>

        <!-- 3D Anthropic Spark Geometry & Orbiting Beacons -->
        <g transform="translate(1200, 600)">
            <ellipse cx="0" cy="0" rx="170" ry="65" fill="none" stroke="#ea580c" stroke-width="2" transform="rotate(-25)"/>
            <ellipse cx="0" cy="0" rx="140" ry="50" fill="none" stroke="#f59e0b" stroke-width="1.8" transform="rotate(35)"/>
            <!-- Center 3D Glowing Spark -->
            <circle cx="0" cy="0" r="22" fill="#ea580c" filter="drop-shadow(0 0 20px #ea580c)"/>
            <circle cx="0" cy="0" r="12" fill="#fed7aa"/>
            <!-- Radiating Orbit Beacons -->
            <circle cx="-130" cy="-45" r="10" fill="#f59e0b" filter="drop-shadow(0 0 12px #f59e0b)"/>
            <circle cx="130" cy="45" r="12" fill="#38bdf8" filter="drop-shadow(0 0 14px #38bdf8)"/>
        </g>
        """
    }
}

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050b14"/>
      <stop offset="50%" stop-color="#07111f"/>
      <stop offset="100%" stop-color="#0b1728"/>
    </linearGradient>
    <radialGradient id="ambient-glow" cx="75%" cy="35%" r="60%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="{accent_glow}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#050b14" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="corner-glow" cx="15%" cy="85%" r="45%">
      <stop offset="0%" stop-color="{theme_color}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#050b14" stop-opacity="0"/>
    </radialGradient>
    
    <!-- 3D Perspective Grid Pattern -->
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1e293b" stroke-width="0.8" stroke-opacity="0.6"/>
    </pattern>
  </defs>

  <!-- Deep Cyberspace Background -->
  <rect width="1536" height="1024" fill="url(#bg)"/>
  <rect width="1536" height="1024" fill="url(#ambient-glow)"/>
  <rect width="1536" height="1024" fill="url(#corner-glow)"/>
  
  <!-- 3D Perspective Grid Floor -->
  <g opacity="0.35">
    <rect width="1536" height="1024" fill="url(#grid)"/>
  </g>

  <!-- Outer Glass Frame -->
  <rect x="48" y="48" width="1440" height="928" rx="24" fill="none" stroke="#1e3a5f" stroke-width="1.8" stroke-opacity="0.6"/>
  <rect x="52" y="52" width="1432" height="920" rx="20" fill="none" stroke="{accent}" stroke-width="1" stroke-opacity="0.2"/>

  <!-- Left Content Column -->
  <g transform="translate(100, 140)">
    <!-- Brand Tag & Badge -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="220" height="38" rx="19" fill="{accent}" fill-opacity="0.15" stroke="{accent}" stroke-width="1.5"/>
      <circle cx="20" cy="19" r="5" fill="{accent}"/>
      <text x="36" y="25" fill="{accent}" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="2">{badge}</text>
    </g>

    <!-- Publication Header -->
    <text x="0" y="90" fill="#64748b" font-family="monospace" font-size="16" letter-spacing="4">AYRIX / ENGINEERING GUIDES</text>

    <!-- Guide Main Title -->
    <text x="0" y="190" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5">
      {title}
    </text>

    <!-- Subtitle -->
    <text x="0" y="260" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="400">
      {subtitle}
    </text>

    <!-- 3D Feature Tags -->
    <g transform="translate(0, 360)">
      <rect x="0" y="0" width="170" height="44" rx="8" fill="#0d1f33" stroke="#1e3a5f" stroke-width="1.2"/>
      <text x="18" y="28" fill="#38bdf8" font-family="monospace" font-size="14">3D Interactive</text>

      <rect x="190" y="0" width="180" height="44" rx="8" fill="#0d1f33" stroke="#1e3a5f" stroke-width="1.2"/>
      <text x="208" y="28" fill="#34d399" font-family="monospace" font-size="14">Verified Commands</text>

      <rect x="390" y="0" width="150" height="44" rx="8" fill="#0d1f33" stroke="#1e3a5f" stroke-width="1.2"/>
      <text x="408" y="28" fill="#f97316" font-family="monospace" font-size="14">Step-by-Step</text>
    </g>

    <!-- Terminal Command Snippet at Bottom Left -->
    <g transform="translate(0, 560)">
      <rect x="0" y="0" width="560" height="80" rx="14" fill="#0a1524" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="24" cy="24" r="5" fill="#f87171"/>
      <circle cx="42" cy="24" r="5" fill="#fbbf24"/>
      <circle cx="60" cy="24" r="5" fill="#34d399"/>
      <text x="24" y="58" fill="#34d399" font-family="monospace" font-size="16">$ ayrix.online/posts/{slug}/</text>
    </g>
  </g>

  <!-- 3D Hero Graphics Section -->
  {svg_graphics}
</svg>"""

def main():
    for slug, data in COVERS.items():
        svg_content = TEMPLATE.format(
            slug=slug,
            badge=data["badge"],
            title=data["title"],
            subtitle=data["subtitle"],
            accent=data["accent"],
            accent_glow=data["accent_glow"],
            theme_color=data["theme_color"],
            svg_graphics=data["svg_graphics"]
        )
        
        svg_path = COVERS_DIR / f"{slug}.svg"
        png_path = COVERS_DIR / f"{slug}.png"
        webp_path = COVERS_DIR / f"{slug}.webp"
        
        svg_path.write_text(svg_content)
        print(f"Wrote SVG: {svg_path}")
        
        # Convert SVG to PNG (1536x1024)
        subprocess.run(["convert", str(svg_path), str(png_path)], check=True)
        print(f"Generated PNG: {png_path}")
        
        # Convert PNG to high quality WebP
        subprocess.run(["convert", str(png_path), "-quality", "92", str(webp_path)], check=True)
        print(f"Generated WebP: {webp_path}")

    print("All bespoke 3D covers generated successfully!")

if __name__ == "__main__":
    main()
