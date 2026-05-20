import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google Fonts injected once ─── */
const injectFonts = () => {
  if (document.getElementById("nexus-fonts")) return;
  const link = document.createElement("link");
  link.id = "nexus-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600&family=Share+Tech+Mono&display=swap";
  document.head.appendChild(link);
};

/* ─── Constants ─── */
const QUESTIONS = [
  "Tell me about yourself and your background in software development.",
  "Describe a challenging technical problem you solved recently.",
  "How do you approach learning new technologies?",
  "Explain your experience with system design and architecture.",
  "How do you handle tight deadlines and pressure situations?",
  "What is your approach to code review and quality assurance?",
  "Describe your experience working in agile/scrum environments.",
  "Where do you see yourself in five years professionally?",
];

const KEYWORDS = [
  "React", "Python", "AI", "System Design",
  "Agile", "Leadership", "Problem Solving", "Architecture",
];

const LANGUAGES = [
  { value: "en", label: "🌐 ENGLISH" },
  { value: "hi", label: "🇮🇳 HINDI" },
  { value: "es", label: "🇪🇸 ESPAÑOL" },
  { value: "fr", label: "🇫🇷 FRANÇAIS" },
  { value: "de", label: "🇩🇪 DEUTSCH" },
  { value: "ja", label: "🇯🇵 JAPANESE" },
  { value: "zh", label: "🇨🇳 CHINESE" },
];

const VOICES = [
  { value: "neural-f", label: "NEURAL FEMALE — ARIA" },
  { value: "neural-m", label: "NEURAL MALE — ORION" },
  { value: "deep",     label: "DEEP RESONANT — VEGA" },
  { value: "crisp",    label: "CRISP CLARITY — NOVA" },
  { value: "warm",     label: "WARM NATURAL — LUNA" },
];

/* ─── Styles ─── */
const css = `
  .nexus-root *{box-sizing:border-box;margin:0;padding:0;}
  .nexus-root{
    --neon:#00f5ff;--neon2:#7b2ff7;--neon3:#ff2d78;
    --bg:#020510;--bg2:#060d1a;--bg3:#0a1428;
    --panel:#0d1b33;--panel2:#111f3a;
    --text:#e0f4ff;--muted:#4a7a9b;
    --border:rgba(0,245,255,0.18);
    --glow:0 0 20px rgba(0,245,255,0.3),0 0 40px rgba(0,245,255,0.1);
    --font-head:'Orbitron',monospace;
    --font-body:'Rajdhani',sans-serif;
    --font-mono:'Share Tech Mono',monospace;
    font-family:var(--font-body);
    background:var(--bg);
    color:var(--text);
    height:100vh;width:100vw;
    overflow:hidden;
    position:relative;
  }

  /* BG GRID */
  .nx-bg-grid{
    position:fixed;inset:0;
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px);
    background-size:60px 60px;
    animation:gridPulse 8s ease-in-out infinite;
    pointer-events:none;z-index:0;
  }
  @keyframes gridPulse{0%,100%{opacity:.5}50%{opacity:1}}
  .nx-scanlines{
    position:fixed;inset:0;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px);
    pointer-events:none;z-index:1;
  }
  .nx-corner{display:none;}

  /* LAYOUT */
  .nx-app{position:relative;z-index:2;height:100vh;display:flex;flex-direction:column;}

  /* HEADER */
  .nx-header{
    display:flex;align-items:center;justify-content:space-between;
    padding:14px 30px;
    border-bottom:1px solid var(--border);
    background:rgba(6,13,26,.95);
    backdrop-filter:blur(20px);
    position:relative;overflow:hidden;
  }
  .nx-header::after{
    content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,var(--neon),transparent);
    animation:scanH 3s linear infinite;
  }
  @keyframes scanH{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

  .nx-logo{display:flex;align-items:center;gap:12px;}
  .nx-logo-text{font-family:var(--font-head);font-size:18px;font-weight:700;letter-spacing:3px;background:linear-gradient(135deg,var(--neon),var(--neon2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .nx-logo-sub{font-size:10px;color:var(--muted);letter-spacing:4px;font-family:var(--font-mono);}

  .nx-hdr-center{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:11px;color:var(--muted);}
  .nx-status-dot{width:7px;height:7px;border-radius:50%;background:var(--neon);box-shadow:0 0 8px var(--neon);animation:statusBlink 1.5s ease-in-out infinite;}
  @keyframes statusBlink{0%,100%{opacity:1}50%{opacity:.3}}

  .nx-hdr-right{display:flex;align-items:center;gap:10px;}

  /* BUTTONS — login and signup look identical, hover adds glow */
  .nx-btn-ghost{
    background:transparent;border:1px solid var(--border);color:var(--muted);
    font-family:var(--font-body);font-size:13px;font-weight:500;
    padding:7px 18px;cursor:pointer;letter-spacing:1px;transition:all .2s;
    clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  }
  .nx-btn-ghost:hover{border-color:var(--neon);color:var(--neon);box-shadow:var(--glow);background:rgba(0,245,255,.05);}
  .nx-btn-neon{
    background:transparent;border:1px solid var(--border);color:var(--muted);
    font-family:var(--font-body);font-size:13px;font-weight:500;
    padding:7px 18px;cursor:pointer;letter-spacing:1px;transition:all .2s;
    clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  }
  .nx-btn-neon:hover{border-color:var(--neon);color:var(--neon);box-shadow:var(--glow);background:rgba(0,245,255,.05);}

  /* HAMBURGER */
  .nx-hamburger{
    width:36px;height:36px;border:1px solid var(--border);background:transparent;
    cursor:pointer;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:5px;padding:0;transition:all .2s;
  }
  .nx-hamburger:hover{border-color:var(--neon);box-shadow:var(--glow);}
  .nx-hamburger span{width:18px;height:1.5px;background:var(--text);transition:all .3s;display:block;}
  .nx-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px);}
  .nx-hamburger.open span:nth-child(2){opacity:0;}
  .nx-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px);}

  /* SIDE MENU */
  .nx-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:150;opacity:0;pointer-events:none;transition:opacity .3s;}
  .nx-overlay.open{opacity:1;pointer-events:all;}
  .nx-sidemenu{
    position:fixed;top:0;right:0;bottom:0;width:300px;
    background:rgba(6,13,26,.98);backdrop-filter:blur(30px);
    border-left:1px solid var(--border);z-index:200;
    transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);
    padding:80px 0 30px;overflow-y:auto;
  }
  .nx-sidemenu::before{content:'';position:absolute;top:0;left:-1px;bottom:0;width:1px;background:linear-gradient(180deg,transparent,var(--neon),var(--neon2),transparent);}
  .nx-sidemenu.open{transform:translateX(0);}

  .nx-menu-section{padding:0 24px 24px;}
  .nx-menu-label{font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:3px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);}
  .nx-menu-item{
    display:flex;align-items:center;gap:12px;padding:11px 14px;
    cursor:pointer;border:1px solid transparent;transition:all .2s;margin-bottom:4px;
    font-size:14px;font-weight:500;letter-spacing:1px;
    clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
  }
  .nx-menu-item:hover{border-color:var(--border);background:rgba(0,245,255,.05);color:var(--neon);}
  .nx-menu-item.active{border-color:var(--neon);color:var(--neon);background:rgba(0,245,255,.08);}

  .nx-menu-toggle{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;font-size:14px;font-weight:500;letter-spacing:1px;transition:all .2s;margin-bottom:4px;}
  .nx-menu-toggle:hover{color:var(--neon);}
  .nx-toggle-track{width:36px;height:18px;border:1px solid var(--muted);border-radius:9px;position:relative;transition:all .2s;flex-shrink:0;}
  .nx-toggle-track.on{border-color:var(--neon);background:rgba(0,245,255,.15);}
  .nx-toggle-thumb{width:12px;height:12px;border-radius:50%;background:var(--muted);position:absolute;top:2px;left:2px;transition:all .2s;}
  .nx-toggle-track.on .nx-toggle-thumb{left:20px;background:var(--neon);box-shadow:0 0 6px var(--neon);}

  .nx-select{
    width:100%;background:var(--panel);border:1px solid var(--border);
    color:var(--text);font-family:var(--font-body);font-size:13px;
    padding:9px 12px;cursor:pointer;margin-bottom:8px;letter-spacing:1px;outline:none;
  }
  .nx-select:focus{border-color:var(--neon);}

  /* MAIN */
  .nx-main{flex:1;display:grid;grid-template-columns:1fr 340px;overflow:hidden;}

  /* CENTER */
  .nx-center{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;gap:22px;position:relative;}

  /* AVATAR */
  .nx-avatar-wrap{position:relative;display:flex;align-items:center;justify-content:center;}
  .nx-orbit{position:absolute;border-radius:50%;border:1px solid;animation:orbit 4s linear infinite;}
  .nx-orbit.r1{width:220px;height:220px;border-color:rgba(0,245,255,.15);animation-duration:4s;}
  .nx-orbit.r2{width:270px;height:270px;border-color:rgba(123,47,247,.1);animation-duration:7s;animation-direction:reverse;}
  .nx-orbit.r3{width:320px;height:320px;border-color:rgba(0,245,255,.07);animation-duration:11s;}
  @keyframes orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .nx-orbit-dot{position:absolute;width:6px;height:6px;border-radius:50%;top:-3px;left:50%;transform:translateX(-50%);}
  .nx-orbit.r1 .nx-orbit-dot{background:var(--neon);box-shadow:0 0 8px var(--neon);}
  .nx-orbit.r2 .nx-orbit-dot{background:var(--neon2);box-shadow:0 0 8px var(--neon2);}

  .nx-avatar-circle{
    width:180px;height:180px;border-radius:50%;
    background:radial-gradient(ellipse at center,rgba(0,245,255,.08) 0%,rgba(6,13,26,.9) 70%);
    border:1px solid rgba(0,245,255,.25);
    position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;
    transition:border-color .3s, box-shadow .3s;
  }
  .nx-avatar-circle.talking{
    border-color:rgba(0,245,255,.7);
    box-shadow:0 0 30px rgba(0,245,255,.25),0 0 60px rgba(0,245,255,.1);
  }
  .nx-avatar-inner{width:160px;height:160px;border-radius:50%;background:var(--bg2);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
  .nx-avatar-corner{display:none;}

  /* PULSE — reacts to voice amplitude */
  .nx-pulse{position:absolute;border-radius:50%;border:1px solid var(--neon);opacity:0;pointer-events:none;}
  .nx-pulse.active{animation:pulseOut 1.6s ease-out infinite;}
  .nx-pulse.active:nth-child(2){animation-delay:.4s;}
  .nx-pulse.active:nth-child(3){animation-delay:.8s;}
  @keyframes pulseOut{0%{width:160px;height:160px;opacity:.7}100%{width:260px;height:260px;opacity:0}}

  /* TALKING RING — glows around avatar while AI speaks */
  .nx-talk-ring{
    position:absolute;border-radius:50%;pointer-events:none;
    width:186px;height:186px;
    border:2px solid transparent;
    transition:all .15s;
  }
  .nx-talk-ring.active{
    border-color:rgba(0,245,255,.6);
    box-shadow:0 0 0 2px rgba(0,245,255,.15), 0 0 20px rgba(0,245,255,.3);
    animation:ringPulse .6s ease-in-out infinite alternate;
  }
  @keyframes ringPulse{
    0%{border-color:rgba(0,245,255,.4);box-shadow:0 0 10px rgba(0,245,255,.2);}
    100%{border-color:rgba(0,245,255,.9);box-shadow:0 0 30px rgba(0,245,255,.5),0 0 60px rgba(123,47,247,.2);}
  }

  /* VOICE BARS — inside avatar, driven by amplitude */
  .nx-voice-vis{position:absolute;bottom:0;left:0;right:0;height:46%;display:flex;align-items:flex-end;justify-content:center;gap:2px;padding:0 18px;}
  .nx-v-bar{width:3px;border-radius:2px 2px 0 0;background:linear-gradient(to top,var(--neon),var(--neon2));transition:height .08s ease;}

  .nx-ai-name{font-family:var(--font-head);font-size:13px;letter-spacing:4px;color:var(--neon);text-align:center;}
  .nx-ai-status{font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:2px;text-align:center;transition:color .3s;}

  /* START BTN */
  .nx-start-btn{background:none;border:none;cursor:pointer;padding:0;}
  .nx-start-inner{
    display:flex;align-items:center;gap:14px;
    background:linear-gradient(135deg,rgba(0,245,255,.08),rgba(123,47,247,.08));
    border:1px solid rgba(0,245,255,.35);padding:16px 40px;
    clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);
    transition:all .3s;letter-spacing:3px;
  }
  .nx-start-btn:hover .nx-start-inner{
    background:linear-gradient(135deg,rgba(0,245,255,.18),rgba(123,47,247,.18));
    box-shadow:var(--glow),0 0 60px rgba(123,47,247,.15);
    border-color:var(--neon);
    transform:scale(1.02);
  }
  .nx-start-btn.active .nx-start-inner{border-color:var(--neon3);background:rgba(255,45,120,.08);}
  .nx-start-btn.active:hover .nx-start-inner{background:rgba(255,45,120,.18);box-shadow:0 0 20px rgba(255,45,120,.4);}
  .nx-start-text{font-family:var(--font-head);font-size:14px;font-weight:700;color:var(--neon);}
  .nx-start-btn.active .nx-start-text{color:var(--neon3);}

  /* CONTROLS — 3 buttons only */
  .nx-controls{display:flex;align-items:center;gap:20px;}
  .nx-ctrl-item{display:flex;flex-direction:column;align-items:center;gap:6px;}
  .nx-ctrl-btn{
    width:52px;height:52px;border-radius:50%;
    border:1px solid var(--border);background:var(--panel);
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:all .2s;color:var(--muted);
  }
  .nx-ctrl-btn:hover{border-color:var(--neon);color:var(--neon);box-shadow:var(--glow);}
  .nx-ctrl-btn.muted{border-color:rgba(255,45,120,.5);background:rgba(255,45,120,.08);color:#ff2d78;}
  .nx-ctrl-btn.muted:hover{border-color:var(--neon3);box-shadow:0 0 20px rgba(255,45,120,.35);}
  .nx-ctrl-btn.off{border-color:rgba(255,45,120,.5);background:rgba(255,45,120,.08);color:#ff2d78;}
  .nx-ctrl-btn.off:hover{border-color:var(--neon3);box-shadow:0 0 20px rgba(255,45,120,.35);}
  .nx-ctrl-label{font-family:var(--font-mono);font-size:9px;color:var(--muted);text-align:center;letter-spacing:1px;}
  .nx-ctrl-label.muted,.nx-ctrl-label.off{color:rgba(255,45,120,.7);}

  /* RIGHT PANEL */
  .nx-right{border-left:1px solid var(--border);background:rgba(9,18,36,.6);display:flex;flex-direction:column;overflow:hidden;}
  .nx-tabs{display:flex;border-bottom:1px solid var(--border);}
  .nx-tab{flex:1;padding:12px;text-align:center;font-family:var(--font-mono);font-size:11px;letter-spacing:2px;cursor:pointer;color:var(--muted);transition:all .2s;border-bottom:2px solid transparent;}
  .nx-tab.active{color:var(--neon);border-bottom-color:var(--neon);}
  .nx-panel-body{flex:1;overflow-y:auto;padding:18px;scrollbar-width:thin;scrollbar-color:var(--border) transparent;}

  /* TRANSCRIPT */
  .nx-msg{margin-bottom:16px;animation:fadeIn .3s ease;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .nx-msg-who{font-family:var(--font-mono);font-size:10px;letter-spacing:2px;margin-bottom:4px;}
  .nx-msg-who.ai{color:var(--neon);}
  .nx-msg-who.user{color:var(--neon2);}
  .nx-msg-text{font-size:13px;line-height:1.6;color:rgba(224,244,255,.85);background:rgba(255,255,255,.03);border-left:2px solid;padding:8px 12px;}
  .nx-msg-text.ai{border-color:rgba(0,245,255,.3);}
  .nx-msg-text.user{border-color:rgba(123,47,247,.3);}
  .nx-divider{font-family:var(--font-mono);font-size:10px;color:var(--muted);text-align:center;padding:10px 0;letter-spacing:1px;}

  /* STATS */
  .nx-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .nx-stat-card{background:var(--panel);border:1px solid var(--border);padding:12px;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);}
  .nx-stat-val{font-family:var(--font-head);font-size:20px;font-weight:700;color:var(--neon);}
  .nx-stat-lab{font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:1px;margin-top:3px;}
  .nx-progress-bar{height:4px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden;margin:16px 0 6px;}
  .nx-progress-fill{height:100%;background:linear-gradient(90deg,var(--neon),var(--neon2));border-radius:2px;transition:width .5s;}
  .nx-progress-labels{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:10px;color:var(--muted);}
  .nx-kw-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
  .nx-kw{background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);padding:4px 10px;font-family:var(--font-mono);font-size:10px;color:var(--neon);letter-spacing:1px;}

  /* SESSION INFO */
  .nx-info-row{display:flex;justify-content:space-between;font-size:13px;padding:8px 0;border-bottom:1px solid var(--border);}
  .nx-info-key{color:var(--muted);}
  .nx-info-val{font-family:var(--font-mono);color:var(--neon);}

  /* FOOTER */
  .nx-footer{border-top:1px solid var(--border);padding:10px 30px;display:flex;align-items:center;justify-content:space-between;background:rgba(6,13,26,.9);}
  .nx-footer-info{font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:1px;}
  .nx-timer{font-family:var(--font-head);font-size:13px;color:var(--neon);letter-spacing:2px;}
`;

/* ─── Sub-components ─── */
function LogoIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <polygon points="19,1.5 34.5,10.25 34.5,27.75 19,36.5 3.5,27.75 3.5,10.25"
        fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="0.8"/>
      <polygon points="19,4 32,11.5 32,26.5 19,34 6,26.5 6,11.5"
        fill="rgba(0,245,255,0.04)" stroke="#00f5ff" strokeWidth="1.5"/>
      <polygon points="19,9 27,13.5 27,24.5 19,29 11,24.5 11,13.5"
        fill="none" stroke="rgba(123,47,247,0.5)" strokeWidth="0.8"/>
      <circle cx="19" cy="19" r="4" fill="rgba(0,245,255,0.12)" stroke="#00f5ff" strokeWidth="1.5"/>
      <circle cx="19" cy="19" r="1.5" fill="#00f5ff"/>
      <line x1="19" y1="4" x2="19" y2="9" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="29" x2="19" y2="34" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* AI face — eyes close when cam off, mouth mutes when speaker off, ears hidden when mic off */
function AIFaceSVG({ blink, camOn, speakerOn, micOn, amplitude }) {
  const eyesClosed = !camOn;
  const mouthMuted = !speakerOn;
  const earsHidden = !micOn;

  // Mouth openness driven by amplitude (0–1)
  const mouthOpen = Math.min(amplitude * 6, 5);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Head */}
      <ellipse cx="60" cy="56" rx="32" ry="35" fill="none" stroke="#00f5ff" strokeWidth="1"/>

      {/* Left eye socket */}
      <ellipse cx="48" cy="50" rx="6" ry="5" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" strokeWidth="1"/>
      {/* Right eye socket */}
      <ellipse cx="72" cy="50" rx="6" ry="5" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" strokeWidth="1"/>

      {eyesClosed ? (
        <>
          <line x1="43" y1="50" x2="53" y2="50" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="67" y1="50" x2="77" y2="50" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <ellipse cx="48" cy="50" rx="2.5" ry={blink ? 0.3 : 2.5} fill="#00f5ff"/>
          <ellipse cx="72" cy="50" rx="2.5" ry={blink ? 0.3 : 2.5} fill="#00f5ff"/>
          <circle cx="49" cy="49" r="1" fill="white" opacity="0.5"/>
          <circle cx="73" cy="49" r="1" fill="white" opacity="0.5"/>
        </>
      )}

      {/* Nose */}
      <path d="M58 54 L60 60 L62 54" fill="none" stroke="rgba(0,245,255,0.4)" strokeWidth="0.8"/>

      {/* Mouth */}
      {mouthMuted ? (
        <>
          <line x1="50" y1="68" x2="70" y2="68" stroke="rgba(255,45,120,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="55" y1="63" x2="60" y2="68" stroke="rgba(255,45,120,0.45)" strokeWidth="1" strokeLinecap="round"/>
          <line x1="65" y1="63" x2="60" y2="68" stroke="rgba(255,45,120,0.45)" strokeWidth="1" strokeLinecap="round"/>
        </>
      ) : mouthOpen > 0.5 ? (
        /* Animated talking mouth — opens with amplitude */
        <>
          <path d={`M50 68 Q60 ${68 + mouthOpen} 70 68`} fill={`rgba(0,245,255,${0.08 + amplitude * 0.15})`} stroke="#00f5ff" strokeWidth="1"/>
          <path d={`M52 68 Q60 ${68 - mouthOpen * 0.3} 68 68`} fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="0.5"/>
        </>
      ) : (
        <path d="M50 68 Q60 74 70 68" fill="none" stroke="#00f5ff" strokeWidth="1"/>
      )}

      {/* Ears / side connectors — hidden when mic muted */}
      {!earsHidden && (
        <>
          <line x1="28" y1="56" x2="20" y2="56" stroke="rgba(0,245,255,0.3)" strokeWidth="0.8"/>
          <line x1="20" y1="56" x2="20" y2="70" stroke="rgba(0,245,255,0.3)" strokeWidth="0.8"/>
          <line x1="92" y1="56" x2="100" y2="56" stroke="rgba(0,245,255,0.3)" strokeWidth="0.8"/>
          <line x1="100" y1="56" x2="100" y2="70" stroke="rgba(0,245,255,0.3)" strokeWidth="0.8"/>
        </>
      )}

      {/* Neck */}
      <line x1="54" y1="91" x2="54" y2="105" stroke="rgba(0,245,255,0.4)" strokeWidth="1"/>
      <line x1="66" y1="91" x2="66" y2="105" stroke="rgba(0,245,255,0.4)" strokeWidth="1"/>
      <path d="M45 105 Q60 100 75 105" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="0.8"/>
    </svg>
  );
}

function Toggle({ on, onClick }) {
  return (
    <div className={`nx-toggle-track${on ? " on" : ""}`} onClick={onClick} style={{cursor:"pointer"}}>
      <div className="nx-toggle-thumb"/>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function AIInterviewer() {
  useEffect(() => { injectFonts(); }, []);

  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [activeTab, setActiveTab] = useState("transcript");
  const [interviewActive, setInterviewActive] = useState(false);
  const [micOn, setMicOn]         = useState(true);
  const [camOn, setCamOn]         = useState(true);
  const [aiVoiceOn, setAiVoiceOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [language, setLanguage]   = useState("en");
  const [voice, setVoice]         = useState("neural-f");
  const [currentQ, setCurrentQ]   = useState(0);
  const [transcript, setTranscript] = useState([
    { who: "ai", text: "Welcome to NexusAI Interview System. I am your AI interviewer. When ready, press INITIATE INTERVIEW to begin." }
  ]);
  const [seconds, setSeconds]     = useState(0);
  const [blink, setBlink]         = useState(false);
  const [voiceBars, setVoiceBars] = useState(Array(16).fill(4));
  const [amplitude, setAmplitude] = useState(0); // 0–1, drives face animation
  const [isTalking, setIsTalking] = useState(false);
  const [stats, setStats]         = useState({ conf:"—", clar:"—", pace:"—", perf:0 });
  const [aiStatus, setAiStatus]   = useState("● READY TO BEGIN");

  const timerRef  = useRef(null);
  const voiceRef  = useRef(null);
  const blinkRef  = useRef(null);
  const ampRef    = useRef(null);
  const panelRef  = useRef(null);
  const queuedRef = useRef(null);

  /* timer */
  useEffect(() => {
    if (interviewActive) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [interviewActive]);

  /* voice bars + amplitude simulation — AI "talking" phase */
  useEffect(() => {
    if (isTalking) {
      voiceRef.current = setInterval(() => {
        const a = Math.random() * 0.7 + 0.3; // amplitude 0.3–1.0
        setAmplitude(a);
        setVoiceBars(Array(16).fill(0).map(() => Math.random() * 42 + 4));
      }, 90);
    } else {
      clearInterval(voiceRef.current);
      setVoiceBars(Array(16).fill(4));
      // Smooth amplitude back to 0
      ampRef.current = setInterval(() => {
        setAmplitude(prev => {
          if (prev <= 0.02) { clearInterval(ampRef.current); return 0; }
          return prev * 0.75;
        });
      }, 60);
    }
    return () => { clearInterval(voiceRef.current); clearInterval(ampRef.current); };
  }, [isTalking]);

  /* eye blink */
  useEffect(() => {
    blinkRef.current = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 4000);
    return () => clearInterval(blinkRef.current);
  }, []);

  /* auto-scroll transcript */
  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 99999;
  }, [transcript]);

  const addMsg = useCallback((who, text) => {
    setTranscript(prev => [...prev, { who, text }]);
  }, []);

  const askQuestion = useCallback((idx) => {
    if (idx >= QUESTIONS.length) return;
    setCurrentQ(idx + 1);
    // AI starts talking
    setIsTalking(true);
    setAiStatus("● SPEAKING...");
    addMsg("ai", QUESTIONS[idx]);
    // Simulate AI finishing speaking after ~3s
    const talkDur = 2800 + Math.random() * 1200;
    queuedRef.current = setTimeout(() => {
      setIsTalking(false);
      setAiStatus("● LISTENING...");
      setTimeout(() => {
        addMsg("user", "[User response being recorded...]");
      }, 1200);
    }, talkDur);
  }, [addMsg]);

  const startInterview = useCallback(() => {
    setInterviewActive(true);
    setCurrentQ(0);
    setSeconds(0);
    setAiStatus("● INITIALIZING...");
    setTimeout(() => askQuestion(0), 800);
  }, [askQuestion]);

  const stopInterview = useCallback(() => {
    clearTimeout(queuedRef.current);
    setInterviewActive(false);
    setIsTalking(false);
    setAiStatus("● SESSION ENDED");
    addMsg("ai", "Thank you for completing the interview. Your results will be analyzed and sent shortly.");
    setStats({
      conf: Math.floor(Math.random() * 30 + 60) + "%",
      clar: Math.floor(Math.random() * 25 + 65) + "%",
      pace: Math.floor(Math.random() * 20 + 70) + "%",
      perf: Math.floor(Math.random() * 30 + 60),
    });
  }, [addMsg]);

  const handleStartToggle = () => interviewActive ? stopInterview() : startInterview();

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const sessionMinSec = `${String(Math.floor((seconds % 3600) / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`;
  const langLabel  = LANGUAGES.find(l => l.value === language)?.label.replace(/^\S+\s/, "") || "English";
  const voiceLabel = VOICES.find(v => v.value === voice)?.label || "Neural Female — Aria";

  /* ─── RENDER ─── */
  return (
    <div className="nexus-root">
      <style>{css}</style>

      {/* Background */}
      <div className="nx-bg-grid"/>
      <div className="nx-scanlines"/>

      {/* Overlay */}
      <div className={`nx-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}/>

      {/* ── SIDE MENU ── */}
      <div className={`nx-sidemenu${menuOpen ? " open" : ""}`}>
        <div className="nx-menu-section">
          <div className="nx-menu-label">NAVIGATION</div>
          {[
            { id:"home",      icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>, label:"HOME" },
            { id:"interview", icon: <><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0112 0v1"/></>,                                    label:"INTERVIEW" },
            { id:"results",   icon: <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>,                                                        label:"RESULTS" },
            { id:"profile",   icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,                    label:"PROFILE" },
          ].map(n => (
            <div key={n.id} className={`nx-menu-item${activeNav===n.id?" active":""}`} onClick={() => { setActiveNav(n.id); setMenuOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{n.icon}</svg>
              {n.label}
            </div>
          ))}
        </div>

        <div className="nx-menu-section">
          <div className="nx-menu-label">CONTROLS</div>
          <div className="nx-menu-toggle"><span>MICROPHONE</span><Toggle on={micOn} onClick={() => setMicOn(v => !v)}/></div>
          <div className="nx-menu-toggle"><span>CAMERA</span><Toggle on={camOn} onClick={() => setCamOn(v => !v)}/></div>
          <div className="nx-menu-toggle"><span>AI VOICE</span><Toggle on={aiVoiceOn} onClick={() => setAiVoiceOn(v => !v)}/></div>
        </div>

        <div className="nx-menu-section">
          <div className="nx-menu-label">LANGUAGE</div>
          <select className="nx-select" value={language} onChange={e => setLanguage(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div className="nx-menu-section">
          <div className="nx-menu-label">AI VOICE TYPE</div>
          <select className="nx-select" value={voice} onChange={e => setVoice(e.target.value)}>
            {VOICES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>

        <div className="nx-menu-section">
          <div className="nx-menu-label">ACCOUNT</div>
          <div className="nx-menu-item" onClick={() => { alert("Connect to your Python auth backend!"); setMenuOpen(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
              <polyline points="10,17 15,12 10,7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            LOGIN / SIGNUP
          </div>
          <div className="nx-menu-item" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
            </svg>
            SETTINGS
          </div>
        </div>
      </div>

      {/* ── APP ── */}
      <div className="nx-app">

        {/* HEADER */}
        <header className="nx-header">
          <div className="nx-logo">
            <LogoIcon/>
            <div>
              <div className="nx-logo-text">NEXUS AI</div>
              <div className="nx-logo-sub">INTERVIEW SYSTEM v2.4</div>
            </div>
          </div>

          <div className="nx-hdr-center">
            <div className="nx-status-dot"/>
            <span>SYSTEM ONLINE</span>
          </div>

          <div className="nx-hdr-right">
            <button className="nx-btn-ghost" onClick={() => alert("Login modal — connect to Python backend!")}>LOG IN</button>
            <button className="nx-btn-neon"  onClick={() => alert("Signup modal — connect to Python backend!")}>SIGN UP</button>
            <button className={`nx-hamburger${menuOpen?" open":""}`} onClick={() => setMenuOpen(v => !v)}>
              <span/><span/><span/>
            </button>
          </div>
        </header>

        {/* MAIN */}
        <div className="nx-main">

          {/* ── CENTER PANEL ── */}
          <div className="nx-center">

            {/* Avatar */}
            <div className="nx-avatar-wrap">
              <div className="nx-orbit r3"><div className="nx-orbit-dot"/></div>
              <div className="nx-orbit r2"><div className="nx-orbit-dot"/></div>
              <div className="nx-orbit r1"><div className="nx-orbit-dot"/></div>

              {/* Pulse rings — only when talking */}
              <div className={`nx-pulse${isTalking?" active":""}`} style={{position:"absolute"}}/>
              <div className={`nx-pulse${isTalking?" active":""}`} style={{position:"absolute"}}/>
              <div className={`nx-pulse${isTalking?" active":""}`} style={{position:"absolute"}}/>

              {/* Talking ring border */}
              <div className={`nx-talk-ring${isTalking?" active":""}`} style={{position:"absolute"}}/>

              <div className={`nx-avatar-circle${isTalking?" talking":""}`} style={{position:"relative"}}>
                <div className="nx-avatar-inner">
                  <AIFaceSVG
                    blink={blink}
                    camOn={camOn}
                    speakerOn={speakerOn}
                    micOn={micOn}
                    amplitude={isTalking ? amplitude : 0}
                  />
                  {/* Voice bars inside face — only when active */}
                  {interviewActive && (
                    <div className="nx-voice-vis">
                      {voiceBars.map((h, i) => (
                        <div key={i} className="nx-v-bar" style={{height: isTalking ? h : 4}}/>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="nx-ai-name">NEXUS — AI INTERVIEWER</div>
              <div className="nx-ai-status" style={{color: isTalking ? "var(--neon)" : interviewActive ? "rgba(0,245,255,.6)" : "var(--muted)"}}>{aiStatus}</div>
            </div>

            {/* Start Button */}
            <button className={`nx-start-btn${interviewActive?" active":""}`} onClick={handleStartToggle}>
              <div className="nx-start-inner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {interviewActive
                    ? <rect x="3" y="3" width="18" height="18" rx="2" fill="rgba(255,45,120,0.2)" stroke="#ff2d78" strokeWidth="2"/>
                    : <polygon points="5,3 19,12 5,21" fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth="2"/>
                  }
                </svg>
                <span className="nx-start-text">{interviewActive ? "END SESSION" : "INITIATE INTERVIEW"}</span>
              </div>
            </button>

            {/* Controls — Mic, Cam, Speaker only */}
            <div className="nx-controls">
              {/* Mic */}
              <div className="nx-ctrl-item">
                <div className={`nx-ctrl-btn${!micOn?" muted":""}`} onClick={() => setMicOn(v => !v)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {micOn ? (
                      <>
                        <rect x="9" y="2" width="6" height="11" rx="3"/>
                        <path d="M19 10a7 7 0 01-14 0"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                      </>
                    ) : (
                      <>
                        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                        <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/>
                      </>
                    )}
                  </svg>
                </div>
                <div className={`nx-ctrl-label${!micOn?" muted":""}`}>{micOn ? "MIC" : "MUTED"}</div>
              </div>

              {/* Cam */}
              <div className="nx-ctrl-item">
                <div className={`nx-ctrl-btn${!camOn?" off":""}`} onClick={() => setCamOn(v => !v)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {camOn ? (
                      <>
                        <path d="M23 7l-7 5 7 5V7z"/>
                        <rect x="1" y="5" width="15" height="14" rx="2"/>
                      </>
                    ) : (
                      <>
                        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                        <path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34m-7.72-2.06A4 4 0 1111.17 8"/>
                      </>
                    )}
                  </svg>
                </div>
                <div className={`nx-ctrl-label${!camOn?" off":""}`}>{camOn ? "CAM" : "OFF"}</div>
              </div>

              {/* Speaker */}
              <div className="nx-ctrl-item">
                <div className={`nx-ctrl-btn${!speakerOn?" muted":""}`} onClick={() => setSpeakerOn(v => !v)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                    {speakerOn ? (
                      <>
                        <path d="M15.54 8.46a5 5 0 010 7.07"/>
                        <path d="M19.07 4.93a10 10 0 010 14.14"/>
                      </>
                    ) : (
                      <>
                        <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round"/>
                        <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round"/>
                      </>
                    )}
                  </svg>
                </div>
                <div className={`nx-ctrl-label${!speakerOn?" muted":""}`}>{speakerOn ? "SPEAKER" : "MUTED"}</div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="nx-right">
            <div className="nx-tabs">
              {["transcript","stats","info"].map(t => (
                <div key={t} className={`nx-tab${activeTab===t?" active":""}`} onClick={() => setActiveTab(t)}>
                  {t === "transcript" ? "TRANSCRIPT" : t === "stats" ? "ANALYTICS" : "SESSION"}
                </div>
              ))}
            </div>

            <div className="nx-panel-body" ref={panelRef}>

              {activeTab === "transcript" && <>
                {transcript.map((m, i) => (
                  <div key={i} className="nx-msg">
                    <div className={`nx-msg-who ${m.who}`}>{m.who === "ai" ? "NEXUS AI ●" : "YOU ●"}</div>
                    <div className={`nx-msg-text ${m.who}`}>{m.text}</div>
                  </div>
                ))}
                {!interviewActive && <div className="nx-divider">— {currentQ === 0 ? "WAITING FOR SESSION START" : "SESSION ENDED"} —</div>}
              </>}

              {activeTab === "stats" && <>
                <div className="nx-stat-grid">
                  <div className="nx-stat-card"><div className="nx-stat-val">{stats.conf}</div><div className="nx-stat-lab">CONFIDENCE</div></div>
                  <div className="nx-stat-card"><div className="nx-stat-val">{stats.clar}</div><div className="nx-stat-lab">CLARITY</div></div>
                  <div className="nx-stat-card"><div className="nx-stat-val">{stats.pace}</div><div className="nx-stat-lab">PACE</div></div>
                  <div className="nx-stat-card"><div className="nx-stat-val">{currentQ}/{QUESTIONS.length}</div><div className="nx-stat-lab">QUESTIONS</div></div>
                </div>
                <div style={{marginTop:20}}>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:2,marginBottom:10}}>PERFORMANCE SCORE</div>
                  <div className="nx-progress-bar"><div className="nx-progress-fill" style={{width: stats.perf + "%"}}/></div>
                  <div className="nx-progress-labels"><span>0%</span><span>{stats.perf}%</span></div>
                </div>
                <div style={{marginTop:20,fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:2,marginBottom:10}}>KEYWORDS DETECTED</div>
                <div className="nx-kw-wrap">
                  {KEYWORDS.slice(0, Math.max(2, currentQ + 1)).map(k => (
                    <div key={k} className="nx-kw">{k}</div>
                  ))}
                </div>
              </>}

              {activeTab === "info" && <>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:2,marginBottom:12}}>SESSION DETAILS</div>
                {[
                  ["Session ID", "#NX-2024-0047"],
                  ["Interview Type", "Technical"],
                  ["Difficulty", "Advanced"],
                  ["Language", langLabel],
                  ["AI Voice", voiceLabel],
                  ["Duration", sessionMinSec],
                  ["Status", interviewActive ? "ACTIVE" : currentQ > 0 ? "ENDED" : "IDLE"],
                ].map(([k, v]) => (
                  <div key={k} className="nx-info-row">
                    <span className="nx-info-key">{k}</span>
                    <span className="nx-info-val" style={k==="Difficulty"?{color:"#fac775"}:{}}>{v}</span>
                  </div>
                ))}
              </>}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="nx-footer">
          <div className="nx-footer-info">NEXUS AI — SECURE ENCRYPTED SESSION</div>
          <div className="nx-timer">{formatTime(seconds)}</div>
          <div className="nx-footer-info">LANG: {language.toUpperCase()} | VOICE: {voiceLabel.split("—")[0].trim()}</div>
        </footer>
      </div>
    </div>
  );
}
