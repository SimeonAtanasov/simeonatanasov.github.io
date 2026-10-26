import re, sys
idx = open(sys.argv[1], encoding="utf-8").read()
a = idx.find('<section id="one"'); b = idx.find('<!-- Two -->')
one = idx[a:b].rstrip()
assert one.endswith('</section>'), one[-200:]
one = one.replace('src="images/', 'src="../images/').replace(' loading="lazy"', '')
one = re.sub(r'href="(?!https?:|#|\.\./)([^"]+)"', r'href="../\1"', one)
tpl = open("template2.html", encoding="utf-8").read()
out = tpl.replace("<!--SPOTLIGHTS-->", "\t\t" + one)
assert "\u2014" not in out, "em dash found"
open("index-image-animations-preview.html", "w", encoding="utf-8", newline="\n").write(out)
print(len(out.encode()), out.count('<section'), one.count('class="image"'))
