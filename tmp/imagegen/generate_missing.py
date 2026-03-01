import subprocess
from pathlib import Path

ROOT = Path('/Users/codex/Desktop/WEBDEV/PERINADE')
CLI = Path.home() / '.codex/skills/imagegen/scripts/image_gen.py'

jobs = [
    dict(out='domaine-timeline-right.webp', image='Pictures-to-add/maison.webp', size='1024x1536', use_case='photorealistic-natural',
         prompt='Create a timeline visual for winery heritage.', scene='estate garden and architecture context',
         subject='heritage atmosphere and continuity of the estate', style='documentary editorial photo',
         composition='vertical timeline card', lighting='soft natural warm light',
         constraints='no people close-up; keep estate identity; no text; no watermark',
         negative='faces close-up, crowd scene, stock-photo posing'),
    dict(out='shop-img-5.webp', image='Pictures-to-add/bouteille_rose_withe_red.jpg', size='1024x1536', use_case='product-mockup',
         prompt='Boutique product image for rose wine card.', scene='estate outdoor table',
         subject='single rose bottle premium focus', style='ecommerce editorial product photo',
         composition='vertical product card', lighting='soft natural light',
         constraints='label coherent and readable; no text overlay; no watermark',
         negative='deformed bottle, random brands, fake reflections'),
    dict(out='shop-img-7.webp', image='Pictures-to-add/bouteille_rose_withe_red.jpg', size='1024x1536', use_case='product-mockup',
         prompt='Boutique crate/composer visual with grouped estate bottles.', scene='estate wood table',
         subject='curated bottle bundle premium look', style='premium product group shot',
         composition='vertical card', lighting='natural clean light',
         constraints='coherent estate bottle identity; no text overlay; no watermark',
         negative='cluttered props, unrelated labels, blur'),
]

for i,j in enumerate(jobs,1):
    out = ROOT / 'output/imagegen' / j['out']
    cmd = ['python', str(CLI), 'edit', '--model','gpt-image-1.5','--image',str(ROOT/j['image']), '--use-case',j['use_case'], '--prompt',j['prompt'], '--scene',j['scene'], '--subject',j['subject'], '--style',j['style'], '--composition',j['composition'], '--lighting',j['lighting'], '--constraints',j['constraints'], '--negative',j['negative'], '--size',j['size'], '--quality','high','--output-format','webp','--output-compression','88','--background','opaque','--input-fidelity','high','--out',str(out),'--force']
    print(f"[{i}/{len(jobs)}] {out.name}", flush=True)
    subprocess.run(cmd, cwd=ROOT, check=False)
