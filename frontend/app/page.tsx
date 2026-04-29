'use client';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    let raf: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const stars: {x:number;y:number;r:number;a:number;p:number}[] = [];
    for (let i = 0; i < 120; i++) stars.push({ x:Math.random(), y:Math.random()*0.55, r:0.3+Math.random()*1.1, a:0.15+Math.random()*0.55, p:Math.random()*Math.PI*2 });

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width, H = canvas.height;
      t += 0.004;
      ctx.clearRect(0,0,W,H);

      // Sky gradient
      const sky = ctx.createLinearGradient(0,0,0,H*0.72);
      sky.addColorStop(0,'#07090f');
      sky.addColorStop(0.3,'#0b0e18');
      sky.addColorStop(0.7,'#0f1220');
      sky.addColorStop(1,'#141828');
      ctx.fillStyle = sky;
      ctx.fillRect(0,0,W,H);

      // Stars
      stars.forEach(s => {
        const a = s.a * (0.5 + Math.sin(t*1.4+s.p)*0.35);
        ctx.beginPath();
        ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      // Moon glow
      const mx = W*0.5, my = H*0.26;
      const mg = ctx.createRadialGradient(mx,my,0,mx,my,H*0.28);
      mg.addColorStop(0,'rgba(220,225,240,0.10)');
      mg.addColorStop(0.5,'rgba(180,190,220,0.04)');
      mg.addColorStop(1,'rgba(100,110,160,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(0,0,W,H);

      // Moon
      const mr = H*0.13;
      const moonFill = ctx.createRadialGradient(mx-mr*0.2,my-mr*0.2,0,mx,my,mr);
      moonFill.addColorStop(0,'rgba(245,246,255,1)');
      moonFill.addColorStop(0.5,'rgba(228,232,248,0.98)');
      moonFill.addColorStop(0.88,'rgba(200,206,230,0.96)');
      moonFill.addColorStop(1,'rgba(170,176,208,0.88)');
      ctx.beginPath();
      ctx.arc(mx,my,mr,0,Math.PI*2);
      ctx.fillStyle = moonFill;
      ctx.fill();

      // Moon reflection on water
      const reflGrad = ctx.createLinearGradient(0,H*0.62,0,H*0.82);
      reflGrad.addColorStop(0,'rgba(200,210,240,0.0)');
      reflGrad.addColorStop(0.3,'rgba(200,210,240,0.06)');
      reflGrad.addColorStop(0.6,'rgba(180,190,220,0.04)');
      reflGrad.addColorStop(1,'rgba(150,160,200,0)');
      ctx.fillStyle = reflGrad;
      const reflW = mr*0.7;
      ctx.beginPath();
      ctx.ellipse(mx, H*0.75, reflW, H*0.1, 0, 0, Math.PI*2);
      ctx.fill();

      // LEFT mountain
      ctx.beginPath();
      ctx.moveTo(-W*0.05, H*0.85);
      ctx.bezierCurveTo(W*0.05,H*0.65, W*0.12,H*0.42, W*0.22,H*0.30);
      ctx.bezierCurveTo(W*0.28,H*0.22, W*0.30,H*0.38, W*0.35,H*0.55);
      ctx.bezierCurveTo(W*0.38,H*0.65, W*0.40,H*0.72, W*0.42,H*0.85);
      ctx.lineTo(-W*0.05,H*0.85);
      ctx.closePath();
      const lm = ctx.createLinearGradient(0,H*0.25,0,H*0.85);
      lm.addColorStop(0,'rgba(38,44,65,0.95)');
      lm.addColorStop(0.4,'rgba(30,36,55,0.97)');
      lm.addColorStop(1,'rgba(18,22,38,1)');
      ctx.fillStyle = lm;
      ctx.fill();

      // LEFT mountain snow
      ctx.beginPath();
      ctx.moveTo(W*0.22,H*0.30);
      ctx.bezierCurveTo(W*0.20,H*0.34, W*0.18,H*0.36, W*0.16,H*0.38);
      ctx.bezierCurveTo(W*0.19,H*0.37, W*0.23,H*0.35, W*0.26,H*0.38);
      ctx.bezierCurveTo(W*0.28,H*0.35, W*0.25,H*0.32, W*0.22,H*0.30);
      ctx.fillStyle = 'rgba(200,208,230,0.55)';
      ctx.fill();

      // LEFT foreground mountain
      ctx.beginPath();
      ctx.moveTo(-W*0.05,H);
      ctx.bezierCurveTo(W*0.02,H*0.82, W*0.08,H*0.68, W*0.18,H*0.55);
      ctx.bezierCurveTo(W*0.24,H*0.48, W*0.28,H*0.58, W*0.32,H*0.72);
      ctx.bezierCurveTo(W*0.35,H*0.80, W*0.37,H*0.88, W*0.40,H);
      ctx.lineTo(-W*0.05,H);
      ctx.closePath();
      ctx.fillStyle = 'rgba(10,12,22,1)';
      ctx.fill();

      // RIGHT mountain
      ctx.beginPath();
      ctx.moveTo(W*1.05,H*0.85);
      ctx.bezierCurveTo(W*0.95,H*0.65, W*0.88,H*0.42, W*0.78,H*0.30);
      ctx.bezierCurveTo(W*0.72,H*0.22, W*0.70,H*0.38, W*0.65,H*0.55);
      ctx.bezierCurveTo(W*0.62,H*0.65, W*0.60,H*0.72, W*0.58,H*0.85);
      ctx.lineTo(W*1.05,H*0.85);
      ctx.closePath();
      const rm = ctx.createLinearGradient(0,H*0.25,0,H*0.85);
      rm.addColorStop(0,'rgba(38,44,65,0.95)');
      rm.addColorStop(0.4,'rgba(30,36,55,0.97)');
      rm.addColorStop(1,'rgba(18,22,38,1)');
      ctx.fillStyle = rm;
      ctx.fill();

      // RIGHT mountain snow
      ctx.beginPath();
      ctx.moveTo(W*0.78,H*0.30);
      ctx.bezierCurveTo(W*0.80,H*0.34, W*0.82,H*0.36, W*0.84,H*0.38);
      ctx.bezierCurveTo(W*0.81,H*0.37, W*0.77,H*0.35, W*0.74,H*0.38);
      ctx.bezierCurveTo(W*0.72,H*0.35, W*0.75,H*0.32, W*0.78,H*0.30);
      ctx.fillStyle = 'rgba(200,208,230,0.55)';
      ctx.fill();

      // RIGHT foreground mountain
      ctx.beginPath();
      ctx.moveTo(W*1.05,H);
      ctx.bezierCurveTo(W*0.98,H*0.82, W*0.92,H*0.68, W*0.82,H*0.55);
      ctx.bezierCurveTo(W*0.76,H*0.48, W*0.72,H*0.58, W*0.68,H*0.72);
      ctx.bezierCurveTo(W*0.65,H*0.80, W*0.63,H*0.88, W*0.60,H);
      ctx.lineTo(W*1.05,H);
      ctx.closePath();
      ctx.fillStyle = 'rgba(10,12,22,1)';
      ctx.fill();

      // Water / valley floor
      const water = ctx.createLinearGradient(0,H*0.62,0,H);
      water.addColorStop(0,'rgba(14,18,32,0.92)');
      water.addColorStop(0.3,'rgba(10,13,25,0.97)');
      water.addColorStop(1,'rgba(6,8,16,1)');
      ctx.fillStyle = water;
      ctx.beginPath();
      ctx.moveTo(W*0.38,H*0.64);
      ctx.bezierCurveTo(W*0.42,H*0.60, W*0.48,H*0.58, W*0.5,H*0.58);
      ctx.bezierCurveTo(W*0.52,H*0.58, W*0.58,H*0.60, W*0.62,H*0.64);
      ctx.lineTo(W,H);
      ctx.lineTo(0,H);
      ctx.closePath();
      ctx.fill();

      // Horizon mist
      const mist = ctx.createLinearGradient(0,H*0.55,0,H*0.68);
      mist.addColorStop(0,'rgba(20,25,45,0)');
      mist.addColorStop(1,'rgba(14,18,34,0.65)');
      ctx.fillStyle = mist;
      ctx.fillRect(0,H*0.55,W,H*0.13);

      // Bottom glassmorphism cards hint
      const cardGrad = ctx.createLinearGradient(0,H*0.78,0,H);
      cardGrad.addColorStop(0,'rgba(20,24,40,0)');
      cardGrad.addColorStop(1,'rgba(12,15,28,0.95)');
      ctx.fillStyle = cardGrad;
      ctx.fillRect(0,H*0.78,W,H*0.22);

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, []);

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', position:'relative', fontFamily:'Inter,system-ui,sans-serif', color:'#fff' }}>

      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0 }}/>

      {/* Noise texture */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', opacity:0.028,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }}/>

      {/* NAVBAR */}
      <nav style={{ position:'absolute', top:0, left:0, right:0, zIndex:30, height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', backdropFilter:'blur(14px)', background:'rgba(7,9,15,0.55)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize:'15px', fontWeight:600, color:'#fff', letterSpacing:'0.08em' }}>iKZ</span>
        <div style={{ display:'flex', gap:'40px' }}>
          {['about','docs','github'].map(item => (
            <a key={item}
              href={item==='github'?'https://github.com/glassmahn/ikaizen-onchain-agent':'#'}
              target={item==='github'?'_blank':undefined}
              style={{ fontSize:'13px', fontWeight:300, color:'rgba(255,255,255,0.5)', textDecoration:'none', letterSpacing:'0.05em', transition:'color 0.22s', display:'inline-block', paddingBottom:'2px', borderBottom:'1px solid transparent' }}
              onMouseEnter={e=>{ e.currentTarget.style.color='#fff'; e.currentTarget.style.borderBottomColor='rgba(255,255,255,0.3)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.borderBottomColor='transparent'; }}
            >{item}</a>
          ))}
        </div>
        <button style={{ fontSize:'11px', fontWeight:500, color:'rgba(255,255,255,0.5)', background:'transparent', border:'none', cursor:'pointer', letterSpacing:'0.1em', textTransform:'uppercase', transition:'color 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.color='#fff'}}
          onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.5)'}}
        >Login →</button>
      </nav>

      {/* HERO CONTENT */}
      <div style={{ position:'absolute', top:'60px', left:0, right:0, bottom:0, zIndex:10, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'0 0 0 0' }}>

        {/* Top hero area */}
        <div style={{ flex:1, display:'flex', alignItems:'center', padding:'0 52px' }}>

          {/* LEFT text */}
          <div style={{ maxWidth:'520px', opacity:mounted?1:0, transform:mounted?'none':'translateY(22px)', transition:'opacity 0.9s ease 200ms, transform 0.9s ease 200ms' }}>

            {/* Trading Program badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', marginBottom:'24px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'5px 14px 5px 10px' }}>
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.55)' strokeWidth='1.8'>
                <circle cx='12' cy='12' r='3'/><path d='M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83'/>
              </svg>
              <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)', letterSpacing:'0.08em' }}>Continuous Improvement Protocol</span>
            </div>

            {/* Main heading */}
            <h1 style={{ margin:'0 0 20px 0', fontSize:'clamp(44px,5.8vw,80px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.025em', color:'#fff' }}>
              iKAIZEN
            </h1>

            {/* Description */}
            <p style={{ margin:'0 0 8px 0', fontSize:'14px', fontWeight:300, color:'rgba(255,255,255,0.65)', lineHeight:1.75, maxWidth:'420px' }}>
              iKAIZEN is built on one principle — progress compounds.
            </p>
            <p style={{ margin:'0 0 8px 0', fontSize:'14px', fontWeight:300, color:'rgba(255,255,255,0.52)', lineHeight:1.75, maxWidth:'420px' }}>
              Every day is an opportunity to improve, even if only by 1%.
            </p>
            <p style={{ margin:'0 0 32px 0', fontSize:'14px', fontWeight:300, color:'rgba(255,255,255,0.52)', lineHeight:1.75, maxWidth:'420px' }}>
              {"This isn't about perfection. It's about becoming unstoppable."}
            </p>

            {/* Buttons */}
            <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
              <button
                style={{ fontSize:'12.5px', fontWeight:500, color:'#0a0c14', background:'#f0f2ff', border:'none', padding:'11px 26px', borderRadius:'24px', cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s', boxShadow:'0 0 20px rgba(200,210,255,0.15)' }}
                onMouseEnter={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow='0 0 28px rgba(200,210,255,0.28)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='#f0f2ff'; e.currentTarget.style.boxShadow='0 0 20px rgba(200,210,255,0.15)';}}
              >Mint iNFT</button>
              <button
                style={{ fontSize:'12.5px', fontWeight:400, color:'rgba(255,255,255,0.75)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', padding:'11px 26px', borderRadius:'24px', cursor:'pointer', letterSpacing:'0.04em', transition:'all 0.25s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.28)'; e.currentTarget.style.color='#fff';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.color='rgba(255,255,255,0.75)';}}
              >Enter the System</button>
            </div>
          </div>

          {/* RIGHT stats — top right like inspo */}
          <div style={{ marginLeft:'auto', textAlign:'right', opacity:mounted?1:0, transform:mounted?'none':'translateY(18px)', transition:'opacity 0.9s ease 400ms, transform 0.9s ease 400ms', paddingRight:'24px' }}>
            <div style={{ display:'flex', gap:'40px', alignItems:'flex-start', marginBottom:'16px' }}>
              {[['100%','profit split'],['1','minimum'],['24/7','live support']].map(([val,label]) => (
                <div key={label} style={{ textAlign:'left' }}>
                  <div style={{ fontSize:'clamp(22px,2.8vw,36px)', fontWeight:600, color:'#fff', lineHeight:1.1, letterSpacing:'-0.01em' }}>{val}</div>
                  <div style={{ fontSize:'10.5px', color:'rgba(255,255,255,0.38)', marginTop:'4px', letterSpacing:'0.06em' }}>{label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:'11.5px', color:'rgba(255,255,255,0.38)', lineHeight:1.7, maxWidth:'220px', marginLeft:'auto', textAlign:'left' }}>
              refine expertise in managing on-chain agents through strategic insights and continuous improvement protocols.
            </p>
          </div>
        </div>

        {/* Bottom glass cards row */}
        <div style={{ display:'flex', gap:'2px', padding:'0 0 0 0', height:'130px', opacity:mounted?1:0, transition:'opacity 1s ease 600ms' }}>
          {[
            { label:'Cycles Completed', value:'1,248', icon:'⟳' },
            { label:'Agent Core', value:'Active', icon:'◉', center:true },
            { label:'PnL This Cycle', value:'+0.004 ETH', icon:'⚡' },
          ].map((card, i) => (
            <div key={i} style={{
              flex: i===1 ? '0 0 200px' : 1,
              display:'flex', flexDirection:'column', alignItems: i===1?'center':'flex-start', justifyContent:'center',
              padding: i===1 ? '0' : '0 36px',
              background: i===1 ? 'rgba(18,22,40,0.85)' : 'rgba(12,15,28,0.75)',
              backdropFilter:'blur(16px)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderBottom:'none',
              cursor:'pointer',
              transition:'background 0.25s',
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background=i===1?'rgba(24,28,50,0.92)':'rgba(16,20,36,0.88)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background=i===1?'rgba(18,22,40,0.85)':'rgba(12,15,28,0.75)';}}
            >
              {i===1 ? (
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'8px' }}>
                    <div style={{ width:'1px', height:'24px', background:'rgba(255,255,255,0.15)' }}/>
                    <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'rgba(255,255,255,0.92)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(220,225,255,0.35)' }}>
                      <div style={{ width:'18px', height:'18px', borderRadius:'3px', background:'#0a0c18' }}/>
                    </div>
                    <div style={{ width:'1px', height:'24px', background:'rgba(255,255,255,0.15)' }}/>
                  </div>
                  <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Agent Core</span>
                </>
              ) : (
                <>
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>{card.label}</div>
                  <div style={{ fontSize:'22px', fontWeight:500, color:'#fff', letterSpacing:'-0.01em' }}>{card.value}</div>
                  {i===0 && <div style={{ marginTop:'8px', width:'40%', height:'1px', background:'rgba(255,255,255,0.12)' }}/>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}
