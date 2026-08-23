import { chromium } from '@playwright/test'
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1})
await p.goto(process.argv[2],{waitUntil:'networkidle'})
await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}})
await p.waitForTimeout(700)
const i=Number(process.argv[4])
const f=p.locator('figure').nth(i)
await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
// snímek i s okolním textem, ať je vidět vztah k sazbě
const box=await f.boundingBox()
await p.screenshot({path:process.argv[3], clip:{x:0,y:Math.max(0,box.y-140),width:1440,height:Math.min(900, box.height+260)}})
console.log('ok', process.argv[3])
await b.close()
