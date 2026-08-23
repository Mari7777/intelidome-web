import { chromium, devices } from '@playwright/test'
const b=await chromium.launch()
for (const [jm,opt] of [['mobil 393',{...devices['iPhone 14 Pro']}],['tablet 768',{viewport:{width:768,height:1024}}],['uzke 320',{viewport:{width:320,height:800}}]]) {
  const c=await b.newContext(opt); const p=await c.newPage()
  await p.goto(process.argv[2],{waitUntil:'networkidle'})
  await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,130))}})
  await p.waitForTimeout(600)
  const r=await p.evaluate(()=>{
    const fig=[...document.querySelectorAll('figure')].map(f=>{const b=f.getBoundingClientRect();return [Math.round(b.left),Math.round(b.width)]})
    const pr=document.querySelector('.prose > p')?.getBoundingClientRect()
    return { proza:pr?[Math.round(pr.left),Math.round(pr.width)]:null, fig,
             pretok: document.documentElement.scrollWidth-document.documentElement.clientWidth }})
  console.log(jm.padEnd(11), 'proza', JSON.stringify(r.proza), 'figury', JSON.stringify(r.fig), 'pretok', r.pretok)
  await c.close()
}
await b.close()
