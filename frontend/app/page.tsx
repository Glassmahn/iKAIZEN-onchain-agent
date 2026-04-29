'use client';
import { useEffect, useRef, useState } from 'react';
import { isExternal } from 'util/types';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', onMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;
    let t = 0, raf: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(), y: Math.random() * 0.58,
      r: 0.2 + Math.random() * 1.2,
      a: 0.12 + Math.random() * 0.6,
      p: Math.random() * Math.PI * 2,
    }));

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width, H = canvas.height;
      t += 0.003;

      // Smooth tilt toward mouse
      tiltRef.current.x += (mouseRef.current.x - 0.5 - tiltRef.current.x) * 0.04;
      tiltRef.current.y += (mouseRef.current.y - 0.5 - tiltRef.current.y) * 0.04;
      const tx = tiltRef.current.x * 18;
      const ty = tiltRef.current.y * 10;

      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.75);
      sky.addColorStop(0, '#050810');
      sky.addColorStop(0.35, '#080c1a');
      sky.addColorStop(0.7, '#0c1022');
      sky.addColorStop(1, '#111528');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars with parallax
      stars.forEach(s => {
        const a = s.a * (0.45 + Math.sin(t * 1.6 + s.p) * 0.32);
        const px = s.x * W + tx * 0.4;
        const py = s.y * H + ty * 0.4;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      // Moon with parallax
      const mx = W * 0.5 + tx * 0.6, my = H * 0.24 + ty * 0.5;
      const mr = Math.min(W, H) * 0.115;
      const atmG = ctx.createRadialGradient(mx, my, mr * 0.6, mx, my, mr * 2.8);
      atmG.addColorStop(0, 'rgba(210,218,248,0.11)');
      atmG.addColorStop(0.5, 'rgba(180,190,228,0.045)');
      atmG.addColorStop(1, 'rgba(120,130,180,0)');
      ctx.fillStyle = atmG;
      ctx.fillRect(0, 0, W, H);

      const moonF = ctx.createRadialGradient(mx - mr * 0.22, my - mr * 0.22, 0, mx, my, mr);
      moonF.addColorStop(0, 'rgba(248,250,255,1)');
      moonF.addColorStop(0.45, 'rgba(232,236,252,0.99)');
      moonF.addColorStop(0.82, 'rgba(205,212,238,0.97)');
      moonF.addColorStop(1, 'rgba(172,180,215,0.88)');
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = moonF;
      ctx.fill();

      // Moon edge shadow
      const moonEdge = ctx.createRadialGradient(mx, my, mr * 0.55, mx, my, mr);
      moonEdge.addColorStop(0, 'rgba(0,0,0,0)');
      moonEdge.addColorStop(0.72, 'rgba(0,0,0,0.02)');
      moonEdge.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = moonEdge;
      ctx.fill();

      // Mountain helper
      function mountain(pts: number[][], grad: CanvasGradient) {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length - 2; i++) {
          const cpx = (pts[i][0] + pts[i + 1][0]) / 2;
          const cpy = (pts[i][1] + pts[i + 1][1]) / 2;
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], cpx, cpy);
        }
        ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Far mountains — parallax layer 1
      const p1 = tx * 1.2, q1 = ty * 0.7;
      const farG = ctx.createLinearGradient(0, H * 0.18, 0, H * 0.82);
      farG.addColorStop(0, 'rgba(32,38,62,0.92)');
      farG.addColorStop(1, 'rgba(14,18,34,0.98)');
      mountain([
        [-W * 0.05 + p1, H],
        [-W * 0.02 + p1, H * 0.72 + q1],
        [W * 0.10 + p1, H * 0.48 + q1],
        [W * 0.20 + p1, H * 0.28 + q1],
        [W * 0.30 + p1, H * 0.45 + q1],
        [W * 0.42 + p1, H * 0.60 + q1],
        [W * 0.50 + p1, H * 0.52 + q1],
        [W * 0.58 + p1, H * 0.60 + q1],
        [W * 0.70 + p1, H * 0.45 + q1],
        [W * 0.80 + p1, H * 0.28 + q1],
        [W * 0.90 + p1, H * 0.48 + q1],
        [W * 1.02 + p1, H * 0.72 + q1],
        [W * 1.05 + p1, H],
      ], farG);

      // Snow caps
      ctx.fillStyle = 'rgba(210,218,240,0.42)';
      [[W * 0.20 + p1, H * 0.28 + q1, 0.032], [W * 0.80 + p1, H * 0.28 + q1, 0.032]].forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.ellipse(sx as number, sy as number, W * (sr as number), H * 0.025, 0, Math.PI, 0);
        ctx.fill();
      });

      // Mid mountains — parallax layer 2
      const p2 = tx * 2.2, q2 = ty * 1.2;
      const midG = ctx.createLinearGradient(0, H * 0.35, 0, H);
      midG.addColorStop(0, 'rgba(18,22,40,0.96)');
      midG.addColorStop(1, 'rgba(8,10,20,1)');
      mountain([
        [-W * 0.05 + p2, H],
        [W * 0.05 + p2, H * 0.75 + q2],
        [W * 0.14 + p2, H * 0.55 + q2],
        [W * 0.22 + p2, H * 0.40 + q2],
        [W * 0.32 + p2, H * 0.58 + q2],
        [W * 0.44 + p2, H * 0.68 + q2],
        [W * 0.50 + p2, H * 0.62 + q2],
        [W * 0.56 + p2, H * 0.68 + q2],
        [W * 0.68 + p2, H * 0.58 + q2],
        [W * 0.78 + p2, H * 0.40 + q2],
        [W * 0.86 + p2, H * 0.55 + q2],
        [W * 0.95 + p2, H * 0.75 + q2],
        [W * 1.05 + p2, H],
      ], midG);

      // Snow caps mid
      ctx.fillStyle = 'rgba(198,208,235,0.38)';
      [[W * 0.22 + p2, H * 0.40 + q2, 0.025], [W * 0.78 + p2, H * 0.40 + q2, 0.025]].forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.ellipse(sx as number, sy as number, W * (sr as number), H * 0.018, 0, Math.PI, 0);
        ctx.fill();
      });

      // Front mountains — parallax layer 3 (closest)
      const p3 = tx * 3.8, q3 = ty * 2.0;
      const fgG = ctx.createLinearGradient(0, H * 0.5, 0, H);
      fgG.addColorStop(0, 'rgba(8,10,20,0.99)');
      fgG.addColorStop(1, 'rgba(4,5,12,1)');
      mountain([
        [-W * 0.05 + p3, H],
        [W * 0.0 + p3, H * 0.88 + q3],
        [W * 0.10 + p3, H * 0.72 + q3],
        [W * 0.18 + p3, H * 0.60 + q3],
        [W * 0.25 + p3, H * 0.72 + q3],
        [W * 0.38 + p3, H * 0.82 + q3],
        [W * 0.50 + p3, H * 0.76 + q3],
        [W * 0.62 + p3, H * 0.82 + q3],
        [W * 0.75 + p3, H * 0.72 + q3],
        [W * 0.82 + p3, H * 0.60 + q3],
        [W * 0.90 + p3, H * 0.72 + q3],
        [W * 1.0 + p3, H * 0.88 + q3],
        [W * 1.05 + p3, H],
      ], fgG);

      // Water / valley glow
      const waterG = ctx.createLinearGradient(0, H * 0.65, 0, H);
      waterG.addColorStop(0, 'rgba(10,14,26,0)');
      waterG.addColorStop(0.25, 'rgba(8,11,22,0.88)');
      waterG.addColorStop(1, 'rgba(4,6,14,1)');
      ctx.fillStyle = waterG;
      ctx.fillRect(0, H * 0.65, W, H * 0.35);

      // Moon reflection
      const reflG = ctx.createRadialGradient(mx, H * 0.82, 0, mx, H * 0.82, mr * 1.4);
      reflG.addColorStop(0, 'rgba(190,200,235,0.07)');
      reflG.addColorStop(0.6, 'rgba(160,172,215,0.03)');
      reflG.addColorStop(1, 'rgba(130,142,195,0)');
      ctx.fillStyle = reflG;
      ctx.fillRect(0, H * 0.68, W, H * 0.32);

      // Horizon mist
      const mistG = ctx.createLinearGradient(0, H * 0.58, 0, H * 0.70);
      mistG.addColorStop(0, 'rgba(12,16,30,0)');
      mistG.addColorStop(1, 'rgba(8,11,22,0.55)');
      ctx.fillStyle = mistG;
      ctx.fillRect(0, H * 0.58, W, H * 0.12);

      // Bottom content gradient
      const bottomG = ctx.createLinearGradient(0, H * 0.72, 0, H);
      bottomG.addColorStop(0, 'rgba(5,7,16,0)');
      bottomG.addColorStop(1, 'rgba(4,5,12,0.96)');
      ctx.fillStyle = bottomG;
      ctx.fillRect(0, H * 0.72, W, H * 0.28);

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', color: '#fff', background: '#050810' }}>

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Noise */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

      {/* NAVBAR */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(20px,4vw,52px)', backdropFilter: 'blur(16px)', background: 'rgba(5,8,16,0.55)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.10em', color: '#fff' }}>iKZ</span>
        <div style={{ display: 'flex', gap: 'clamp(20px,3vw,44px)', alignItems: 'center' }}>
          {['about', 'docs', 'github'].map(item => {
            const links = {
              about: 'https://ethglobal.com'
              docs: 'https://medium.com/@glassman4664/ikaizen-onchain-agent-537cbc3862d5'
              github: 'https://github.com/glassmahn/ikaizen-onchain-agent'
            }; 
            const destination = links[item];
            const isExternal = destination.startsWith('http');
            return (
              <a key={item}
              href={destination}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.48)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s, border-color 0.2s', paddingBottom: '2px', borderBottom: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.48)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
            >{item}
          </a>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ fontSize: '11.5px', fontWeight: 500, color: '#050810', background: 'rgba(240,244,255,0.92)', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.22s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,244,255,0.92)'; }}
          >Mint iNFT</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: 'absolute', top: '62px', left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 clamp(20px,5vw,80px)', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: 'clamp(18px,2.5vh,28px)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '24px', padding: '5px 16px', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'opacity 0.7s ease 100ms, transform 0.7s ease 100ms' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.8)' }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Continuous Improvement Protocol</span>
        </div>

        {/* Heading */}
        <h1 style={{ margin: '0 0 clamp(14px,2vh,22px) 0', fontSize: 'clamp(52px,9vw,130px)', fontWeight: 800, lineHeight: 0.92, letterSpacing: '-0.03em', color: '#fff', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: 'opacity 0.8s ease 200ms, transform 0.8s ease 200ms' }}>
          iKAIZEN
        </h1>

        {/* Sub heading */}
        <p style={{ margin: '0 0 clamp(10px,1.5vh,16px) 0', fontSize: 'clamp(13px,1.4vw,17px)', fontWeight: 400, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em', maxWidth: '520px', lineHeight: 1.5, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'opacity 0.8s ease 320ms, transform 0.8s ease 320ms' }}>
          iKAIZEN is built on one principle: progress compounds.
        </p>

        {/* Body */}
        <div style={{ maxWidth: '460px', marginBottom: 'clamp(24px,4vh,40px)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(12px)', transition: 'opacity 0.8s ease 440ms, transform 0.8s ease 440ms' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 'clamp(12px,1.1vw,14.5px)', fontWeight: 300, color: 'rgba(255,255,255,0.48)', lineHeight: 1.75 }}>
            Every day is an opportunity to improve, even if only by 1%.
          </p>
          <p style={{ margin: 0, fontSize: 'clamp(12px,1.1vw,14.5px)', fontWeight: 300, color: 'rgba(255,255,255,0.48)', lineHeight: 1.75 }}>
            {"This isn't about perfection. It's about becoming unstoppable."}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'opacity 0.8s ease 560ms, transform 0.8s ease 560ms' }}>
          <button style={{ fontSize: 'clamp(11px,1vw,13px)', fontWeight: 600, color: '#050810', background: 'rgba(235,240,255,0.95)', border: 'none', padding: 'clamp(10px,1.2vh,13px) clamp(20px,2vw,30px)', borderRadius: '28px', cursor: 'pointer', letterSpacing: '0.05em', boxShadow: '0 0 24px rgba(180,195,255,0.18)', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 32px rgba(200,215,255,0.32)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(235,240,255,0.95)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(180,195,255,0.18)'; e.currentTarget.style.transform = 'none'; }}
          >Mint iNFT</button>
          <button style={{ fontSize: 'clamp(11px,1vw,13px)', fontWeight: 400, color: 'rgba(255,255,255,0.78)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', padding: 'clamp(10px,1.2vh,13px) clamp(20px,2vw,30px)', borderRadius: '28px', cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.78)'; e.currentTarget.style.transform = 'none'; }}
          >Enter the System</button>
        </div>

        {/* Contract */}
        <p style={{ marginTop: 'clamp(18px,2.5vh,28px)', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 800ms' }}>
          Contract · 0x1515d22b7Ea637D69c760C3986373FB976d96E8F
        </p>
      </div>

      {/* Bottom glass stats bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', background: 'rgba(4,6,14,0.72)', opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 700ms' }}>
        {[
          { label: 'Network', value: '0G Galileo Testnet' },
          { label: 'Agent Status', value: 'Active ●' },
          { label: 'Protocol', value: 'ERC-7857 iNFT' },
          { label: 'KeeperHub', value: 'Every 4h' },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, padding: 'clamp(10px,1.5vh,16px) clamp(16px,2vw,28px)', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.label}</span>
            <span style={{ fontSize: 'clamp(11px,1vw,13px)', fontWeight: 400, color: item.value.includes('●') ? '#22d3ee' : 'rgba(255,255,255,0.72)', letterSpacing: '0.02em' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <style>{`* { box-sizing: border-box; } @media (max-width: 640px) { nav { padding: 0 20px !important; } }`}</style>
    </div>
  );
}
