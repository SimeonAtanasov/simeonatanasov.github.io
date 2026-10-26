import sys, json
from playwright.sync_api import sync_playwright
from PIL import Image
S=sys.argv[1]; vw=int(sys.argv[2]); keys=sys.argv[3].split(",") if len(sys.argv)>3 else None
U="http://localhost:8765/Claude%20outputs/index-image-animations-preview.html"
ORDER={"scn":0,"pp":1,"aia":2,"dig":3,"pbi":4,"wav":5,"rdy":6,"rmx":7,"ast":8}
ENTRY={"scn":[150,500,1000,1350,1700,2300],"pp":[100,500,900,1300,1700],"aia":[200,700,1100,1500,1900,2500],"dig":[150,600,1100,1600,2100],
       "pbi":[200,600,1000,1500,2200,2900],"wav":[100,3000],"rdy":[150,450,750,1050,1600],"rmx":[150,450,800,1100,1400,1900],"ast":[200,700,1200,1700]}
PLAY={"scn":[300,900,1300,1600,2300],"pp":[300,800,1300],"aia":[300,900,1300,1700,2200],"dig":[300,900,1500,2000],"pbi":[300,900,1500,2300,2900],
      "wav":[],"rdy":[400,1100,2000,3600],"rmx":[500,1200,2400,3700],"ast":[500,1000,1600,2200,3000]}
def strip(paths,dest,maxh=420):
    ims=[Image.open(p) for p in paths]
    ims=[i.resize((int(i.width*maxh/i.height),maxh)) if i.height>maxh else i for i in ims]
    w=sum(i.width for i in ims)+10*(len(ims)-1); h=max(i.height for i in ims)
    c=Image.new("RGB",(w,h),(255,255,255)); x=0
    for i in ims: c.paste(i,(x,0)); x+=i.width+10
    c.save(dest)
with sync_playwright() as p:
    b=p.chromium.launch()
    touch = vw<700
    ctx=b.new_context(viewport={"width":vw,"height":844 if touch else 900}, device_scale_factor=2 if touch else 1, has_touch=touch, is_mobile=touch)
    pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto(U+"?mode=a&live=all"); pg.wait_for_timeout(500)
    def tile_rect(i):
        return pg.evaluate("(i)=>{const r=document.querySelectorAll('#one > section')[i].querySelector('.image').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}", i)
    def scroll_to(i):
        pg.evaluate("""(i)=>{const s=document.querySelectorAll('#one > section')[i];const b=document.getElementById('pv-bar').getBoundingClientRect();window.scrollTo(0,s.getBoundingClientRect().top+scrollY-b.bottom-8)}""", i)
    def shot(i,path):
        r=tile_rect(i); pg.screenshot(path=path, clip={"x":r[0],"y":max(0,r[1]),"width":r[2],"height":min(r[3], (844 if touch else 900)-max(0,r[1]))})
    for key in (keys or ORDER):
        i=ORDER[key]
        # entry: scroll far away, replay (clears pv-in), then scroll to the tile and capture
        pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(200); pg.evaluate("__pv.replay()"); pg.wait_for_timeout(300)
        scroll_to(i); t0=pg.evaluate("performance.now()"); fr=[]
        for j,t in enumerate(ENTRY[key]):
            while pg.evaluate("performance.now()")-t0 < t: pg.wait_for_timeout(10)
            f=f"{S}/shots/t_{key}_{vw}_e{j}.png"; shot(i,f); fr.append(f)
        strip(fr, f"{S}/shots/T-{key}-{vw}-entry.png")
        if PLAY[key] and not touch:
            pg.wait_for_timeout(6500)   # let the entry and any autoplay finish
            r=tile_rect(i); pg.mouse.move(r[0]+r[2]/2, r[1]+r[3]/2); t0=pg.evaluate("performance.now()"); fr=[]
            for j,t in enumerate(PLAY[key]):
                while pg.evaluate("performance.now()")-t0 < t: pg.wait_for_timeout(10)
                f=f"{S}/shots/t_{key}_{vw}_p{j}.png"; shot(i,f); fr.append(f)
            strip(fr, f"{S}/shots/T-{key}-{vw}-hover.png")
            pg.mouse.move(2,2)
        print(key, "done", pg.evaluate("document.querySelectorAll('#one > section')[%d].querySelector('.tl-scene').className" % i))
    print("errors", errs, "overflow", pg.evaluate("document.documentElement.scrollWidth-innerWidth"))
    b.close()
