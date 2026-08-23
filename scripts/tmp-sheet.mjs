// Kontaktní list: celá stránka na jednom obrázku, ať je vidět MAKRO rytmus.
import { chromium } from '@playwright/test'
import sharp from 'sharp'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1})
await p.goto(process.argv[2],{waitUntil:'networkidle'})
await p.evaluate(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}window.scrollTo(0,0)})
await p.waitForTimeout(1200)
const buf=await p.screenshot({fullPage:true})
const meta=await sharp(buf).metadata()
// rozřež na tři pruhy vedle sebe, ať se vejde celá výška
const trety=Math.ceil(meta.height/3)
const dily=[]
for(let i=0;i<3;i++){
  const top=i*trety, h=Math.min(trety, meta.height-top)
  dily.push(await sharp(buf).extract({left:0,top,width:meta.width,height:h}).resize({width:430}).toBuffer())
}
const vysky=await Promise.all(dily.map(async d=>(await sharp(d).metadata()).height))
await sharp({create:{width:430*3+40,height:Math.max(...vysky),channels:3,background:'#888'}})
  .composite(dily.map((d,i)=>({input:d,left:i*(430+20),top:0})))
  .png().toFile(process.argv[3])
console.log('list:', process.argv[3], meta.width+'x'+meta.height)
await b.close()
