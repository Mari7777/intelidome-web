import { chromium } from '@playwright/test'
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}})
await p.goto(process.argv[2],{waitUntil:'networkidle'})
await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}})
await p.waitForTimeout(700)
console.log(JSON.stringify(await p.evaluate(()=>{
  const fig=[...document.querySelectorAll('figure')].map(f=>{const r=f.getBoundingClientRect()
    return { cis:(f.querySelector('b')?.textContent||'?').trim(), sazba:(f.className.match(/id-figure--[\w-]+/)||['v ose'])[0],
             levy:Math.round(r.left), sirka:Math.round(r.width) }})
  const proza=[...document.querySelectorAll('.prose > p')].slice(0,3).map(e=>{const r=e.getBoundingClientRect()
    return {levy:Math.round(r.left), sirka:Math.round(r.width)}})
  return { proza, fig, prekrocil: document.documentElement.scrollWidth>document.documentElement.clientWidth }
}),null,1))
await b.close()
