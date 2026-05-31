import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

/* ─── Google Fonts ─── */
const injectFonts = () => {
  if (document.getElementById("ios-fonts")) return;
  const link = document.createElement("link");
  link.id = "ios-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
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

const KEYWORDS = ["React", "Python", "AI", "System Design", "Agile", "Leadership", "Problem Solving", "Architecture"];

const LANGUAGES = [
  { value: "en", label: "🌐 English" },
  { value: "hi", label: "🇮🇳 Hindi" },
  { value: "es", label: "🇪🇸 Español" },
  { value: "fr", label: "🇫🇷 Français" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "ja", label: "🇯🇵 Japanese" },
  { value: "zh", label: "🇨🇳 Chinese" },
];

const VOICES = [
  { value: "neural-f", label: "Neural Female — Aria" },
  { value: "neural-m", label: "Neural Male — Orion" },
  { value: "deep", label: "Deep Resonant — Vega" },
  { value: "crisp", label: "Crisp Clarity — Nova" },
  { value: "warm", label: "Warm Natural — Luna" },
];

/* ─── Styles ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .ios-root *, .ios-root *::before, .ios-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .ios-root {
    --blue:    #0a84ff;
    --blue2:   #5e5ce6;
    --green:   #30d158;
    --red:     #ff453a;
    --orange:  #ff9f0a;
    --pink:    #ff375f;
    --teal:    #64d2ff;
    --bg-deep: #05080f;
    --bg1:     #0a0f1e;
    --bg2:     #0f1629;
    --surface: rgba(255,255,255,0.055);
    --surface2:rgba(255,255,255,0.085);
    --surfaceH:rgba(255,255,255,0.11);
    --border:  rgba(255,255,255,0.10);
    --border2: rgba(255,255,255,0.16);
    --text:    rgba(255,255,255,0.92);
    --text2:   rgba(255,255,255,0.60);
    --text3:   rgba(255,255,255,0.35);
    --glass:   rgba(14,20,40,0.72);
    --glass2:  rgba(10,15,30,0.85);
    --blur:    blur(28px) saturate(180%);
    --blur-sm: blur(16px) saturate(150%);
    --radius:  20px;
    --radius-sm:14px;
    --radius-xs:10px;
    --shadow:  0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
    --shadow-lg:0 20px 60px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4);
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

    font-family: var(--font);
    background: var(--bg-deep);
    color: var(--text);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
  }

  /* ── BACKGROUND ── */
  .ios-bg {
    position: fixed; inset: 0; z-index: 0; overflow: hidden;
    background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(10,132,255,0.12) 0%, transparent 60%),
                radial-gradient(ellipse 60% 50% at 80% 80%, rgba(94,92,230,0.10) 0%, transparent 55%),
                radial-gradient(ellipse 50% 40% at 50% 40%, rgba(100,210,255,0.06) 0%, transparent 50%),
                linear-gradient(160deg, #05080f 0%, #080d1c 50%, #060a18 100%);
  }
  .ios-blob {
    position: absolute; border-radius: 50%; filter: blur(70px);
    animation: blobFloat 12s ease-in-out infinite;
  }
  .ios-blob.b1 { width:500px;height:400px;top:-100px;left:-80px;background:radial-gradient(circle,rgba(10,132,255,0.18),transparent 70%);animation-duration:14s; }
  .ios-blob.b2 { width:400px;height:350px;bottom:-80px;right:-60px;background:radial-gradient(circle,rgba(94,92,230,0.15),transparent 70%);animation-duration:18s;animation-delay:-6s; }
  .ios-blob.b3 { width:300px;height:300px;top:40%;left:40%;background:radial-gradient(circle,rgba(100,210,255,0.08),transparent 70%);animation-duration:22s;animation-delay:-10s; }
  @keyframes blobFloat {
    0%,100%{transform:translate(0,0) scale(1);}
    33%{transform:translate(30px,-20px) scale(1.05);}
    66%{transform:translate(-20px,30px) scale(0.97);}
  }

  /* ── APP SHELL ── */
  .ios-app { position:relative;z-index:2;height:100vh;display:flex;flex-direction:column; }

  /* ── HEADER ── */
  .ios-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
    background: var(--glass2);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-bottom: 1px solid var(--border);
    position: relative; z-index: 10;
  }
  .ios-logo { display:flex;align-items:center;gap:11px; }
  .ios-logo-name {
    font-size: 17px; font-weight: 700; letter-spacing: -0.3px;
    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ios-logo-sub { font-size: 11px; color: var(--text3); font-weight: 400; letter-spacing: 0.2px; }

  .ios-hdr-pill {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 14px;
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
  }
  .ios-dot { width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:dotPulse 2s ease-in-out infinite; }
  @keyframes dotPulse{0%,100%{opacity:1;box-shadow:0 0 8px var(--green);}50%{opacity:.6;box-shadow:0 0 4px var(--green);}}
  .ios-hdr-pill span { font-size:12px;font-weight:500;color:var(--text2); }

  .ios-hdr-right { display:flex;align-items:center;gap:8px; }

  /* iOS-style glass buttons */
  .ios-btn {
    padding: 8px 18px;
    border-radius: 999px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: -0.1px;
    transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
    border: 1px solid var(--border2);
    background: var(--surface);
    color: var(--text2);
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .ios-btn:hover {
    background: var(--surfaceH);
    color: var(--text);
    border-color: rgba(255,255,255,0.22);
    transform: scale(1.02);
  }
  .ios-btn:active { transform: scale(0.97); opacity:0.85; }
  .ios-btn.primary {
    background: rgba(10,132,255,0.22);
    border-color: rgba(10,132,255,0.4);
    color: #64b5ff;
  }
  .ios-btn.primary:hover {
    background: rgba(10,132,255,0.35);
    border-color: rgba(10,132,255,0.6);
    color: #90cbff;
    box-shadow: 0 0 20px rgba(10,132,255,0.25);
  }

  /* Hamburger */
  .ios-menu-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border2);
    display: flex; flex-direction:column; align-items:center; justify-content:center; gap:4.5px;
    cursor: pointer; transition: all .18s;
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
  }
  .ios-menu-btn:hover { background: var(--surfaceH); border-color:rgba(255,255,255,.22); }
  .ios-menu-btn span { width:16px;height:1.5px;background:var(--text2);border-radius:2px;transition:all .25s; display:block; }
  .ios-menu-btn.open span:nth-child(1){transform:rotate(45deg) translate(4px,4px);}
  .ios-menu-btn.open span:nth-child(2){opacity:0;transform:scaleX(0);}
  .ios-menu-btn.open span:nth-child(3){transform:rotate(-45deg) translate(4px,-4px);}

  /* ── SIDE SHEET ── */
  .ios-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:150;opacity:0;pointer-events:none;transition:opacity .3s;}
  .ios-overlay.open{opacity:1;pointer-events:all;}
  .ios-sheet {
    position:fixed;top:0;right:0;bottom:0;width:310px;
    background: rgba(12,18,36,0.92);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-left: 1px solid var(--border2);
    z-index:200;
    transform:translateX(100%);
    transition:transform .38s cubic-bezier(0.32,0,0.15,1);
    overflow-y:auto;
    padding: 72px 0 40px;
  }
  .ios-sheet.open{transform:translateX(0);}
  .ios-sheet-section { padding: 0 20px 28px; }
  .ios-sheet-label {
    font-size: 11px; font-weight: 600; color: var(--text3);
    letter-spacing: 0.8px; text-transform: uppercase;
    margin-bottom: 10px; padding: 0 4px;
  }
  .ios-sheet-group {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  .ios-sheet-row {
    display:flex;align-items:center;gap:12px;
    padding: 13px 16px;
    cursor: pointer;
    transition: background .15s;
    border-bottom: 1px solid var(--border);
    font-size: 15px; font-weight: 450; color: var(--text);
  }
  .ios-sheet-row:last-child{border-bottom:none;}
  .ios-sheet-row:hover{background:var(--surfaceH);}
  .ios-sheet-row:active{background:rgba(255,255,255,.05);}
  .ios-sheet-row.active { color: var(--blue); }
  .ios-sheet-row svg { flex-shrink:0;opacity:.7; }
  .ios-sheet-row.active svg { opacity:1; }
  .ios-row-chevron { margin-left:auto;opacity:.3; }

  /* iOS toggle */
  .ios-toggle-row { display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid var(--border); }
  .ios-toggle-row:last-child{border-bottom:none;}
  .ios-toggle-label { font-size:15px;font-weight:450;color:var(--text); }
  .ios-toggle-track {
    width:44px;height:26px;border-radius:13px;
    background: rgba(255,255,255,0.12);
    border:1px solid var(--border2);
    position:relative;cursor:pointer;
    transition:background .22s, border-color .22s;
    flex-shrink:0;
  }
  .ios-toggle-track.on{background:var(--green);border-color:var(--green);}
  .ios-toggle-thumb {
    width:20px;height:20px;border-radius:50%;
    background:white;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
    position:absolute;top:2px;left:2px;
    transition:transform .22s cubic-bezier(0.4,0,0.2,1);
  }
  .ios-toggle-track.on .ios-toggle-thumb{transform:translateX(18px);}

  .ios-select {
    width:100%;background:var(--surface);
    border:1px solid var(--border);border-radius:var(--radius-xs);
    color:var(--text);font-family:var(--font);font-size:14px;font-weight:400;
    padding:11px 14px;cursor:pointer;outline:none;
    -webkit-appearance:none;appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat:no-repeat;background-position:right 12px center;
    padding-right:36px;
  }
  .ios-select:focus{border-color:rgba(10,132,255,0.5);}

  /* ── MAIN GRID ── */
  .ios-main { flex:1;display:grid;grid-template-columns:1fr 340px;overflow:hidden; }

  /* ── CENTER ── */
  .ios-center {
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:28px 32px;gap:20px;position:relative;overflow:hidden;
  }

  /* ── AVATAR ── */
  .ios-avatar-wrap { position:relative;display:flex;align-items:center;justify-content:center; }

  /* Orbit rings */
  .ios-orbit {
    position:absolute;border-radius:50%;border:1px solid;
    animation:iosOrbit linear infinite;
  }
  .ios-orbit.r1{width:230px;height:230px;border-color:rgba(10,132,255,0.12);animation-duration:8s;}
  .ios-orbit.r2{width:285px;height:285px;border-color:rgba(94,92,230,0.08);animation-duration:13s;animation-direction:reverse;}
  .ios-orbit.r3{width:340px;height:340px;border-color:rgba(100,210,255,0.05);animation-duration:20s;}
  @keyframes iosOrbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .ios-orbit-dot{position:absolute;border-radius:50%;top:-3px;left:50%;transform:translateX(-50%);}
  .ios-orbit.r1 .ios-orbit-dot{width:6px;height:6px;background:var(--blue);box-shadow:0 0 10px var(--blue);}
  .ios-orbit.r2 .ios-orbit-dot{width:5px;height:5px;background:var(--blue2);box-shadow:0 0 8px var(--blue2);}

  /* Pulse rings */
  .ios-pulse{position:absolute;border-radius:50%;border:1px solid var(--blue);opacity:0;pointer-events:none;}
  .ios-pulse.active{animation:iosPulse 1.8s ease-out infinite;}
  .ios-pulse.active:nth-child(5){animation-delay:.5s;}
  .ios-pulse.active:nth-child(6){animation-delay:1s;}
  @keyframes iosPulse{0%{width:170px;height:170px;opacity:.6}100%{width:280px;height:280px;opacity:0}}

  /* Talk ring */
  .ios-talk-ring {
    position:absolute;border-radius:50%;pointer-events:none;
    width:194px;height:194px;
    border:2px solid transparent;transition:all .2s;
  }
  .ios-talk-ring.active{
    border-color:rgba(10,132,255,0.5);
    box-shadow:0 0 0 3px rgba(10,132,255,0.1),0 0 30px rgba(10,132,255,0.3);
    animation:talkRing .7s ease-in-out infinite alternate;
  }
  @keyframes talkRing{
    0%{border-color:rgba(10,132,255,0.3);box-shadow:0 0 15px rgba(10,132,255,0.15);}
    100%{border-color:rgba(100,210,255,0.8);box-shadow:0 0 35px rgba(10,132,255,0.45),0 0 70px rgba(94,92,230,0.15);}
  }

  /* Avatar glass card */
  .ios-avatar-glass {
    width:188px;height:188px;border-radius:50%;
    background: radial-gradient(ellipse at 35% 30%, rgba(10,132,255,0.12) 0%, rgba(10,15,30,0.85) 65%);
    border:1px solid rgba(255,255,255,0.13);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    box-shadow:
      0 20px 60px rgba(0,0,0,0.5),
      inset 0 1px 1px rgba(255,255,255,0.12),
      inset 0 -1px 1px rgba(0,0,0,0.3);
    position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;
    transition:border-color .3s,box-shadow .3s;
  }
  .ios-avatar-glass.talking{
    border-color:rgba(10,132,255,0.4);
    box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 40px rgba(10,132,255,0.2),inset 0 1px 1px rgba(255,255,255,0.14);
  }
  .ios-avatar-inner{
    width:168px;height:168px;border-radius:50%;
    background:radial-gradient(ellipse at 40% 30%,rgba(20,30,60,0.9),rgba(8,12,24,0.98));
    display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;
  }
  /* Glass sheen */
  .ios-avatar-glass::after{
    content:'';position:absolute;top:0;left:0;right:0;height:50%;
    background:linear-gradient(180deg,rgba(255,255,255,0.07) 0%,transparent 100%);
    border-radius:50% 50% 0 0;pointer-events:none;
  }

  /* Voice bars */
  .ios-voice-vis{position:absolute;bottom:0;left:0;right:0;height:44%;display:flex;align-items:flex-end;justify-content:center;gap:2px;padding:0 20px;}
  .ios-v-bar{width:3px;border-radius:2px 2px 0 0;background:linear-gradient(to top,var(--blue),var(--teal));transition:height .08s ease;}

  /* AI name/status */
  .ios-ai-name {
    font-size:16px;font-weight:600;letter-spacing:-0.3px;
    color:rgba(255,255,255,0.9);text-align:center;
  }
  .ios-ai-status {
    font-size:12px;font-weight:400;color:var(--text3);
    text-align:center;transition:color .3s;letter-spacing:0.1px;
    margin-top:3px;
  }
  .ios-ai-status.active{color:var(--blue);}
  .ios-ai-status.listening{color:var(--green);}

  /* ── START BUTTON — big iOS pill ── */
  .ios-start-btn {
    border:none;cursor:pointer;padding:0;background:none;
    -webkit-tap-highlight-color:transparent;
    user-select:none;
  }
  .ios-start-inner {
    display:flex;align-items:center;gap:12px;
    background: rgba(10,132,255,0.18);
    border: 1px solid rgba(10,132,255,0.35);
    border-radius: 999px;
    padding: 16px 44px;
    box-shadow:
      0 8px 32px rgba(10,132,255,0.18),
      inset 0 1px 1px rgba(255,255,255,0.1),
      inset 0 -1px 1px rgba(0,0,0,0.2);
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
    transition: all .22s cubic-bezier(0.4,0,0.2,1);
  }
  .ios-start-btn:hover .ios-start-inner {
    background: rgba(10,132,255,0.28);
    border-color: rgba(10,132,255,0.55);
    box-shadow: 0 12px 40px rgba(10,132,255,0.3),inset 0 1px 1px rgba(255,255,255,0.12);
    transform:scale(1.03);
  }
  .ios-start-btn:active .ios-start-inner{transform:scale(0.97);opacity:.85;}
  .ios-start-btn.active .ios-start-inner{
    background:rgba(255,69,58,0.18);
    border-color:rgba(255,69,58,0.4);
    box-shadow:0 8px 32px rgba(255,69,58,0.2),inset 0 1px 1px rgba(255,255,255,0.08);
  }
  .ios-start-btn.active:hover .ios-start-inner{
    background:rgba(255,69,58,0.28);
    border-color:rgba(255,69,58,0.6);
    box-shadow:0 12px 40px rgba(255,69,58,0.3);
    transform:scale(1.03);
  }
  .ios-start-text{font-size:15px;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:-0.2px;}
  .ios-start-btn.active .ios-start-text{color:rgba(255,120,110,1);}

  /* ── CONTROL BUTTONS ── */
  .ios-controls { display:flex;align-items:center;gap:18px; }
  .ios-ctrl-item { display:flex;flex-direction:column;align-items:center;gap:7px; }
  .ios-ctrl-btn {
    width:56px;height:56px;border-radius:50%;
    background: var(--surface2);
    border: 1px solid var(--border2);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1);
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:all .18s cubic-bezier(0.4,0,0.2,1);
    color:rgba(255,255,255,0.7);
    -webkit-tap-highlight-color:transparent;
    user-select:none;
  }
  .ios-ctrl-btn:hover {
    background:var(--surfaceH);
    border-color:rgba(255,255,255,0.22);
    color:rgba(255,255,255,0.95);
    transform:scale(1.06);
    box-shadow:0 6px 24px rgba(0,0,0,0.4),inset 0 1px 1px rgba(255,255,255,0.14);
  }
  .ios-ctrl-btn:active{transform:scale(0.93);opacity:.8;}
  .ios-ctrl-btn.off {
    background:rgba(255,69,58,0.14);
    border-color:rgba(255,69,58,0.35);
    color:rgba(255,100,90,0.9);
    box-shadow:0 4px 16px rgba(255,69,58,0.15),inset 0 1px 1px rgba(255,255,255,0.06);
  }
  .ios-ctrl-btn.off:hover{
    background:rgba(255,69,58,0.24);
    border-color:rgba(255,69,58,0.55);
    transform:scale(1.06);
    box-shadow:0 6px 24px rgba(255,69,58,0.25);
  }
  .ios-ctrl-label{font-size:11px;font-weight:500;color:var(--text3);text-align:center;letter-spacing:0.1px;}
  .ios-ctrl-label.off{color:rgba(255,90,80,0.7);}

  /* ── RIGHT PANEL ── */
  .ios-right {
    border-left:1px solid var(--border);
    background:rgba(8,13,26,0.6);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    display:flex;flex-direction:column;overflow:hidden;
  }

  /* Tab bar — iOS segment style */
  .ios-tabs {
    display:flex;
    padding:12px 14px 0;
    gap:2px;
    border-bottom:1px solid var(--border);
  }
  .ios-tab {
    flex:1;padding:8px 6px;text-align:center;
    font-size:12px;font-weight:500;color:var(--text3);
    cursor:pointer;transition:all .18s;
    border-radius:var(--radius-xs) var(--radius-xs) 0 0;
    letter-spacing:0.1px;
    border-bottom:2px solid transparent;
    margin-bottom:-1px;
  }
  .ios-tab:hover{color:var(--text2);background:rgba(255,255,255,.03);}
  .ios-tab.active{color:var(--blue);border-bottom-color:var(--blue);font-weight:600;}

  .ios-panel-body{flex:1;overflow-y:auto;padding:16px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent;}

  /* Messages */
  .ios-msg{margin-bottom:14px;animation:msgIn .28s cubic-bezier(0.4,0,0.2,1);}
  @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .ios-msg-who{font-size:11px;font-weight:600;letter-spacing:0.3px;margin-bottom:5px;}
  .ios-msg-who.ai{color:var(--blue);}
  .ios-msg-who.user{color:var(--blue2);}
  .ios-msg-bubble{
    font-size:13px;line-height:1.55;color:rgba(255,255,255,0.82);
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius-xs);
    padding:9px 13px;
    backdrop-filter:blur(10px);
  }
  .ios-msg-bubble.ai{border-color:rgba(10,132,255,0.2);background:rgba(10,132,255,0.07);}
  .ios-msg-bubble.user{border-color:rgba(94,92,230,0.2);background:rgba(94,92,230,0.07);}
  .ios-divider{font-size:11px;color:var(--text3);text-align:center;padding:8px 0;letter-spacing:0.3px;}

  /* Stats */
  .ios-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .ios-stat-card{
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius-sm);padding:14px 12px;
    backdrop-filter:blur(10px);
    box-shadow:inset 0 1px 1px rgba(255,255,255,0.06);
  }
  .ios-stat-val{font-size:22px;font-weight:700;color:var(--text);letter-spacing:-0.5px;}
  .ios-stat-lab{font-size:11px;font-weight:500;color:var(--text3);margin-top:2px;letter-spacing:0.2px;}
  .ios-progress-wrap{margin-top:18px;}
  .ios-progress-label{font-size:11px;font-weight:500;color:var(--text3);letter-spacing:0.3px;margin-bottom:8px;}
  .ios-progress-bar{height:5px;background:rgba(255,255,255,.07);border-radius:999px;overflow:hidden;}
  .ios-progress-fill{height:100%;background:linear-gradient(90deg,var(--blue),var(--teal));border-radius:999px;transition:width .5s ease;}
  .ios-progress-pct{font-size:11px;color:var(--text3);text-align:right;margin-top:5px;}
  .ios-kw-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
  .ios-kw{
    background:rgba(10,132,255,0.1);border:1px solid rgba(10,132,255,0.22);
    border-radius:999px;padding:4px 11px;
    font-size:11px;font-weight:500;color:rgba(100,180,255,0.9);letter-spacing:0.1px;
  }

  /* Session info */
  .ios-info-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .ios-info-row:last-child{border-bottom:none;}
  .ios-info-key{color:var(--text3);font-weight:400;}
  .ios-info-val{color:var(--text);font-weight:500;font-size:13px;}

  /* ── FOOTER ── */
  .ios-footer {
    border-top:1px solid var(--border);
    padding:10px 24px;
    display:flex;align-items:center;justify-content:space-between;
    background:rgba(8,12,24,0.8);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
  }
  .ios-footer-info{font-size:11px;font-weight:400;color:var(--text3);letter-spacing:0.1px;}
  .ios-timer{font-size:14px;font-weight:600;color:var(--text);letter-spacing:-0.3px;}
`;

/* ── Logo ── */
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="rgba(10,132,255,0.15)" stroke="rgba(10,132,255,0.3)" strokeWidth="1" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="rgba(100,210,255,0.7)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3.5" fill="rgba(10,132,255,0.6)" />
      <circle cx="16" cy="16" r="1.5" fill="white" />
      <line x1="16" y1="6" x2="16" y2="9" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="23" x2="16" y2="26" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="16" x2="9" y2="16" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23" y1="16" x2="26" y2="16" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── AI Face ── */
function AIFace({ blink, camOn, speakerOn, micOn, amplitude }) {
  const eyesClosed = !camOn;
  const mouthMuted = !speakerOn;
  const earsHidden = !micOn;
  const mouthOpen = Math.min(amplitude * 6, 5);

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Head */}
      <ellipse cx="60" cy="56" rx="31" ry="34"
        fill="rgba(10,132,255,0.04)" stroke="rgba(100,210,255,0.55)" strokeWidth="1.2" />
      {/* Eye sockets */}
      <ellipse cx="47" cy="50" rx="6.5" ry="5.5" fill="rgba(10,132,255,0.1)" stroke="rgba(100,210,255,0.4)" strokeWidth="0.8" />
      <ellipse cx="73" cy="50" rx="6.5" ry="5.5" fill="rgba(10,132,255,0.1)" stroke="rgba(100,210,255,0.4)" strokeWidth="0.8" />

      {eyesClosed ? (
        <>
          <line x1="42" y1="50" x2="52" y2="50" stroke="rgba(100,210,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="68" y1="50" x2="78" y2="50" stroke="rgba(100,210,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="47" cy="50" rx="2.8" ry={blink ? 0.3 : 2.8} fill="rgba(100,210,255,0.9)" />
          <ellipse cx="73" cy="50" rx="2.8" ry={blink ? 0.3 : 2.8} fill="rgba(100,210,255,0.9)" />
          <circle cx="48.2" cy="48.8" r="1" fill="white" opacity="0.6" />
          <circle cx="74.2" cy="48.8" r="1" fill="white" opacity="0.6" />
          {/* Iris glow */}
          <ellipse cx="47" cy="50" rx="4" ry="3.8" fill="none" stroke="rgba(10,132,255,0.25)" strokeWidth="0.8" />
          <ellipse cx="73" cy="50" rx="4" ry="3.8" fill="none" stroke="rgba(10,132,255,0.25)" strokeWidth="0.8" />
        </>
      )}

      {/* Nose */}
      <path d="M58 54 L60 60 L62 54" fill="none" stroke="rgba(100,210,255,0.3)" strokeWidth="0.8" />

      {/* Mouth */}
      {mouthMuted ? (
        <>
          <line x1="50" y1="68" x2="70" y2="68" stroke="rgba(255,69,58,0.75)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="55" y1="63" x2="60" y2="68" stroke="rgba(255,69,58,0.5)" strokeWidth="1" strokeLinecap="round" />
          <line x1="65" y1="63" x2="60" y2="68" stroke="rgba(255,69,58,0.5)" strokeWidth="1" strokeLinecap="round" />
        </>
      ) : mouthOpen > 0.5 ? (
        <>
          <path d={`M50 68 Q60 ${68 + mouthOpen} 70 68`}
            fill={`rgba(10,132,255,${0.06 + amplitude * 0.12})`}
            stroke="rgba(100,210,255,0.7)" strokeWidth="1.2" />
          <path d={`M52 68 Q60 ${68 - mouthOpen * 0.3} 68 68`}
            fill="none" stroke="rgba(100,210,255,0.2)" strokeWidth="0.5" />
        </>
      ) : (
        <path d="M50 68 Q60 74 70 68" fill="none" stroke="rgba(100,210,255,0.6)" strokeWidth="1.2" />
      )}

      {/* Ears — hidden when mic muted */}
      {!earsHidden && (
        <>
          <line x1="29" y1="56" x2="21" y2="56" stroke="rgba(100,210,255,0.25)" strokeWidth="0.8" />
          <line x1="21" y1="56" x2="21" y2="70" stroke="rgba(100,210,255,0.25)" strokeWidth="0.8" />
          <line x1="91" y1="56" x2="99" y2="56" stroke="rgba(100,210,255,0.25)" strokeWidth="0.8" />
          <line x1="99" y1="56" x2="99" y2="70" stroke="rgba(100,210,255,0.25)" strokeWidth="0.8" />
        </>
      )}

      {/* Neck */}
      <line x1="54" y1="90" x2="54" y2="104" stroke="rgba(100,210,255,0.3)" strokeWidth="1" />
      <line x1="66" y1="90" x2="66" y2="104" stroke="rgba(100,210,255,0.3)" strokeWidth="1" />
      <path d="M45 104 Q60 99 75 104" fill="none" stroke="rgba(100,210,255,0.2)" strokeWidth="0.8" />
    </svg>
  );
}

/* iOS-style Toggle */
function IOSToggle({ on, onClick }) {
  return (
    <div className={`ios-toggle-track${on ? " on" : ""}`} onClick={onClick}>
      <div className="ios-toggle-thumb" />
    </div>
  );
}

/* ─── MAIN ─── */
export default function AIInterviewer() {
  useEffect(() => { injectFonts(); }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [activeTab, setActiveTab] = useState("transcript");
  const [interviewActive, setInterviewActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [aiVoiceOn, setAiVoiceOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [language, setLanguage] = useState("en");
  const [voice, setVoice] = useState("neural-f");
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState([
    {
      who: "ai",
      text: "Welcome to Nexus AI Interview System."
    }
  ]);

  const [userAnswer, setUserAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [blink, setBlink] = useState(false);
  const [voiceBars, setVoiceBars] = useState(Array(16).fill(4));
  const [amplitude, setAmplitude] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [stats, setStats] = useState({ conf: "—", clar: "—", pace: "—", perf: 0 });
  const [aiStatus, setAiStatus] = useState("Ready to begin");

  const timerRef = useRef(null);
  const voiceRef = useRef(null);
  const blinkRef = useRef(null);
  const ampRef = useRef(null);
  const panelRef = useRef(null);
  const queuedRef = useRef(null);

  useEffect(() => {
    if (interviewActive) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [interviewActive]);

  useEffect(() => {
    if (isTalking) {
      voiceRef.current = setInterval(() => {
        const a = Math.random() * 0.7 + 0.3;
        setAmplitude(a);
        setVoiceBars(Array(16).fill(0).map(() => Math.random() * 42 + 4));
      }, 90);
    } else {
      clearInterval(voiceRef.current);
      setVoiceBars(Array(16).fill(4));
      ampRef.current = setInterval(() => {
        setAmplitude(prev => { if (prev <= 0.02) { clearInterval(ampRef.current); return 0; } return prev * 0.75; });
      }, 60);
    }
    return () => { clearInterval(voiceRef.current); clearInterval(ampRef.current); };
  }, [isTalking]);

  useEffect(() => {
    blinkRef.current = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 4000);
    return () => clearInterval(blinkRef.current);
  }, []);

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 99999;
  }, [transcript]);

  const addMsg = useCallback((who, text) => setTranscript(p => [...p, { who, text }]), []);

  const askQuestion = useCallback(async () => {

    try {

      setAiStatus("Generating AI Question...");
      setIsTalking(true);

      // Backend API
      const response = await axios.get(
        "http://127.0.0.1:8000/interview/ai-question"
      );

      const aiQuestion = response.data.question;

      // Add AI Question
      addMsg("ai", aiQuestion);

      setCurrentQ(prev => prev + 1);

      // =========================
      // AI Voice
      // =========================

      const speech = new SpeechSynthesisUtterance(aiQuestion);

      speech.lang =
        language === "hi"
          ? "hi-IN"
          : "en-US";

      speech.rate = 1;
      speech.pitch = 1;

      // =========================
      // AFTER AI FINISHES TALKING
      // =========================

      speech.onend = () => {

        setIsTalking(false);
        setAiStatus("Listening...");

        // Mic Off
        if (!micOn) {

          setAiStatus("Microphone muted");

          return;
        }

        // Browser Support
        const SpeechRecognition =
          window.SpeechRecognition ||
          window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

          addMsg(
            "ai",
            "Speech Recognition not supported in this browser."
          );

          return;
        }

        // Create Recognition
        const recognition = new SpeechRecognition();

        recognition.lang =
          language === "hi"
            ? "hi-IN"
            : "en-US";

        recognition.continuous = true;
        recognition.interimResults = true;

        // Start Mic
        recognition.start();

        // =========================
        // USER ANSWER
        // =========================

        recognition.onresult = (event) => {

          let finalTranscript = "";

          for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
          ) {

            finalTranscript +=
              event.results[i][0].transcript;
          }

          // Save Answer
          setUserAnswer(finalTranscript);

          // Update Transcript
          setTranscript(prev => {

            const updated = [...prev];

            // Replace last user message if exists
            if (
              updated.length > 0 &&
              updated[updated.length - 1].who === "user"
            ) {

              updated[updated.length - 1].text =
                finalTranscript;

            } else {

              updated.push({
                who: "user",
                text: finalTranscript
              });
            }

            return updated;
          });

          setAiStatus("Listening...");
        };

        // =========================
        // ERROR
        // =========================

        recognition.onerror = (event) => {

          console.error(event.error);

          setAiStatus("Mic error");

          addMsg(
            "ai",
            `Mic Error: ${event.error}`
          );
        };
      };

      // Start AI Voice
      window.speechSynthesis.speak(speech);

    } catch (error) {

      console.error("API Error:", error);

      setAiStatus("Failed to load AI question");

      setIsTalking(false);

      addMsg(
        "ai",
        "Backend connection failed."
      );
    }

  }, [
    addMsg,
    micOn,
    language,
    interviewActive
  ]);

  const startInterview = useCallback(() => {
    setInterviewActive(true);
    setCurrentQ(0);
    setSeconds(0);
    setAiStatus("Initializing...");
    setTimeout(() => askQuestion(), 800);
  }, [askQuestion]);

  const stopInterview = useCallback(() => {
    clearTimeout(queuedRef.current);
    setInterviewActive(false);
    setIsTalking(false);
    setAiStatus("Session ended");
    addMsg("ai", "Thank you for completing the interview. Your results will be analyzed and sent shortly.");
    setStats({
      conf: Math.floor(Math.random() * 30 + 60) + "%",
      clar: Math.floor(Math.random() * 25 + 65) + "%",
      pace: Math.floor(Math.random() * 20 + 70) + "%",
      perf: Math.floor(Math.random() * 30 + 60),
    });
  }, [addMsg]);

  const handleStartToggle = () => interviewActive ? stopInterview() : startInterview();
  const formatTime = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const sessionMinSec = `${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const langLabel = LANGUAGES.find(l => l.value === language)?.label.replace(/^\S+\s/, "") || "English";
  const voiceLabel = VOICES.find(v => v.value === voice)?.label || "Neural Female — Aria";

  const statusClass = isTalking ? "active" : interviewActive ? "listening" : "";

  return (
    <div className="ios-root">
      <style>{css}</style>

      {/* Background */}
      <div className="ios-bg">
        <div className="ios-blob b1" /><div className="ios-blob b2" /><div className="ios-blob b3" />
      </div>

      {/* Overlay */}
      <div className={`ios-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* ── SIDE SHEET ── */}
      <div className={`ios-sheet${menuOpen ? " open" : ""}`}>

        {/* Navigation */}
        <div className="ios-sheet-section">
          <div className="ios-sheet-label">Navigation</div>
          <div className="ios-sheet-group">
            {[
              { id: "home", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></>, label: "Home" },
              { id: "interview", icon: <><circle cx="12" cy="8" r="4" /><path d="M6 20v-1a6 6 0 0112 0v1" /></>, label: "Interview" },
              { id: "results", icon: <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />, label: "Results" },
              { id: "profile", icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>, label: "Profile" },
            ].map(n => (
              <div key={n.id} className={`ios-sheet-row${activeNav === n.id ? " active" : ""}`} onClick={() => { setActiveNav(n.id); setMenuOpen(false); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{n.icon}</svg>
                {n.label}
                <svg className="ios-row-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="ios-sheet-section">
          <div className="ios-sheet-label">Controls</div>
          <div className="ios-sheet-group">
            {[
              { label: "Microphone", on: micOn, toggle: () => setMicOn(v => !v) },
              { label: "Camera", on: camOn, toggle: () => setCamOn(v => !v) },
              { label: "AI Voice", on: aiVoiceOn, toggle: () => setAiVoiceOn(v => !v) },
            ].map(r => (
              <div key={r.label} className="ios-toggle-row">
                <span className="ios-toggle-label">{r.label}</span>
                <IOSToggle on={r.on} onClick={r.toggle} />
              </div>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="ios-sheet-section">
          <div className="ios-sheet-label">Language</div>
          <select className="ios-select" value={language} onChange={e => setLanguage(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        {/* Voice */}
        <div className="ios-sheet-section">
          <div className="ios-sheet-label">AI Voice Type</div>
          <select className="ios-select" value={voice} onChange={e => setVoice(e.target.value)}>
            {VOICES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>

        {/* Account */}
        <div className="ios-sheet-section">
          <div className="ios-sheet-label">Account</div>
          <div className="ios-sheet-group">
            <div className="ios-sheet-row" onClick={() => { alert("Connect to your backend!"); setMenuOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10,17 15,12 10,7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Log In / Sign Up
              <svg className="ios-row-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
            <div className="ios-sheet-row" onClick={() => setMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
              </svg>
              Settings
              <svg className="ios-row-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── APP ── */}
      <div className="ios-app">

        {/* HEADER */}
        <header className="ios-header">
          <div className="ios-logo">
            <LogoMark />
            <div>
              <div className="ios-logo-name">Nexus AI</div>
              <div className="ios-logo-sub">Interview System</div>
            </div>
          </div>

          <div className="ios-hdr-pill">
            <div className="ios-dot" />
            <span>System Online</span>
          </div>

          <div className="ios-hdr-right">
            <button className="ios-btn" onClick={() => alert("Login — connect to backend!")}>Log In</button>
            <button className="ios-btn primary" onClick={() => alert("Sign Up — connect to backend!")}>Sign Up</button>
            <button className={`ios-menu-btn${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(v => !v)}>
              <span /><span /><span />
            </button>
          </div>
        </header>

        {/* MAIN */}
        <div className="ios-main">

          {/* CENTER */}
          <div className="ios-center">

            {/* Avatar */}
            <div className="ios-avatar-wrap">
              <div className="ios-orbit r3"><div className="ios-orbit-dot" /></div>
              <div className="ios-orbit r2"><div className="ios-orbit-dot" /></div>
              <div className="ios-orbit r1"><div className="ios-orbit-dot" /></div>

              <div className={`ios-pulse${isTalking ? " active" : ""}`} style={{ position: "absolute" }} />
              <div className={`ios-pulse${isTalking ? " active" : ""}`} style={{ position: "absolute" }} />
              <div className={`ios-pulse${isTalking ? " active" : ""}`} style={{ position: "absolute" }} />

              <div className={`ios-talk-ring${isTalking ? " active" : ""}`} style={{ position: "absolute" }} />

              <div className={`ios-avatar-glass${isTalking ? " talking" : ""}`} style={{ position: "relative" }}>
                <div className="ios-avatar-inner">
                  <AIFace
                    blink={blink} camOn={camOn}
                    speakerOn={speakerOn} micOn={micOn}
                    amplitude={isTalking ? amplitude : 0}
                  />
                  {interviewActive && (
                    <div className="ios-voice-vis">
                      {voiceBars.map((h, i) => (
                        <div key={i} className="ios-v-bar" style={{ height: isTalking ? h : 4 }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name + Status */}
            <div style={{ textAlign: "center" }}>
              <div className="ios-ai-name">Nexus — AI Interviewer</div>
              <div className={`ios-ai-status ${statusClass}`}>{aiStatus}</div>
            </div>

            {/* Start Button */}
            <button className={`ios-start-btn${interviewActive ? " active" : ""}`} onClick={handleStartToggle}>
              <div className="ios-start-inner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  {interviewActive
                    ? <rect x="4" y="4" width="16" height="16" rx="3" fill="rgba(255,69,58,0.3)" stroke="rgba(255,120,110,0.9)" strokeWidth="1.8" />
                    : <polygon points="5,3 19,12 5,21" fill="rgba(10,132,255,0.35)" stroke="rgba(100,180,255,0.9)" strokeWidth="1.8" />
                  }
                </svg>
                <span className="ios-start-text">{interviewActive ? "End Session" : "Start Interview"}</span>
              </div>
            </button>

            {/* Controls */}
            <div className="ios-controls">
              {/* Mic */}
              <div className="ios-ctrl-item">
                <div className={`ios-ctrl-btn${!micOn ? " off" : ""}`} onClick={() => setMicOn(v => !v)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {micOn ? <>
                      <rect x="9" y="2" width="6" height="11" rx="3" />
                      <path d="M19 10a7 7 0 01-14 0" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                    </> : <>
                      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                    </>}
                  </svg>
                </div>
                <div className={`ios-ctrl-label${!micOn ? " off" : ""}`}>{micOn ? "Mic" : "Muted"}</div>
              </div>

              {/* Cam */}
              <div className="ios-ctrl-item">
                <div className={`ios-ctrl-btn${!camOn ? " off" : ""}`} onClick={() => setCamOn(v => !v)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {camOn ? <>
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" />
                    </> : <>
                      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                      <path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34m-7.72-2.06A4 4 0 1111.17 8" />
                    </>}
                  </svg>
                </div>
                <div className={`ios-ctrl-label${!camOn ? " off" : ""}`}>{camOn ? "Camera" : "Off"}</div>
              </div>

              {/* Speaker */}
              <div className="ios-ctrl-item">
                <div className={`ios-ctrl-btn${!speakerOn ? " off" : ""}`} onClick={() => setSpeakerOn(v => !v)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                    {speakerOn ? <>
                      <path d="M15.54 8.46a5 5 0 010 7.07" />
                      <path d="M19.07 4.93a10 10 0 010 14.14" />
                    </> : <>
                      <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
                      <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
                    </>}
                  </svg>
                </div>
                <div className={`ios-ctrl-label${!speakerOn ? " off" : ""}`}>{speakerOn ? "Speaker" : "Muted"}</div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="ios-right">
            <div className="ios-tabs">
              {["transcript", "stats", "info"].map(t => (
                <div key={t} className={`ios-tab${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)}>
                  {t === "transcript" ? "Transcript" : t === "stats" ? "Analytics" : "Session"}
                </div>
              ))}
            </div>

            <div className="ios-panel-body" ref={panelRef}>

              {activeTab === "transcript" && <>
                {transcript.map((m, i) => (
                  <div key={i} className="ios-msg">
                    <div className={`ios-msg-who ${m.who}`}>{m.who === "ai" ? "Nexus AI" : "You"}</div>
                    <div className={`ios-msg-bubble ${m.who}`}>{m.text}</div>
                  </div>
                ))}
                {!interviewActive && (
                  <div className="ios-divider">
                    {currentQ === 0 ? "Waiting for session to start" : "Session ended"}
                  </div>
                )}
              </>}

              {activeTab === "stats" && <>
                <div className="ios-stat-grid">
                  {[
                    { val: stats.conf, lab: "Confidence" },
                    { val: stats.clar, lab: "Clarity" },
                    { val: stats.pace, lab: "Pace" },
                    { val: `${currentQ}/${QUESTIONS.length}`, lab: "Questions" },
                  ].map(s => (
                    <div key={s.lab} className="ios-stat-card">
                      <div className="ios-stat-val">{s.val}</div>
                      <div className="ios-stat-lab">{s.lab}</div>
                    </div>
                  ))}
                </div>
                <div className="ios-progress-wrap">
                  <div className="ios-progress-label">Performance Score</div>
                  <div className="ios-progress-bar"><div className="ios-progress-fill" style={{ width: stats.perf + "%" }} /></div>
                  <div className="ios-progress-pct">{stats.perf}%</div>
                </div>
                <div className="ios-progress-label" style={{ marginTop: 18, marginBottom: 10 }}>Keywords Detected</div>
                <div className="ios-kw-wrap">
                  {KEYWORDS.slice(0, Math.max(2, currentQ + 1)).map(k => (
                    <div key={k} className="ios-kw">{k}</div>
                  ))}
                </div>
              </>}

              {activeTab === "info" && <>
                {[
                  ["Session ID", "#NX-2024-0047"],
                  ["Interview Type", "Technical"],
                  ["Difficulty", "Advanced"],
                  ["Language", langLabel],
                  ["AI Voice", voiceLabel],
                  ["Duration", sessionMinSec],
                  ["Status", interviewActive ? "Active" : currentQ > 0 ? "Ended" : "Idle"],
                ].map(([k, v]) => (
                  <div key={k} className="ios-info-row">
                    <span className="ios-info-key">{k}</span>
                    <span className="ios-info-val" style={k === "Difficulty" ? { color: "#ff9f0a" } : {}}>{v}</span>
                  </div>
                ))}
              </>}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="ios-footer">
          <div className="ios-footer-info">Nexus AI · Encrypted Session</div>
          <div className="ios-timer">{formatTime(seconds)}</div>
          <div className="ios-footer-info">{langLabel} · {voiceLabel.split("—")[0].trim()}</div>
        </footer>
      </div>
    </div>
  );
}