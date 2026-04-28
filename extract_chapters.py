import docx
import os
import glob

novel_dir = 'novels/Mutation of the Apocalypse'
output_dir = 'novels/Mutation of the Apocalypse/extracted'
os.makedirs(output_dir, exist_ok=True)

pattern = novel_dir + '/Chapter_*.docx'
files = glob.glob(pattern)

def get_num(path):
    p = path.replace('\\', '/')
    return int(p.split('Chapter_')[1].split('_')[0])

files = sorted(files, key=get_num)

for f in files:
    num = get_num(f)
    doc = docx.Document(f)
    text = '\n'.join([p.text for p in doc.paragraphs])
    out_path = os.path.join(output_dir, 'ch%03d.txt' % num)
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write(text)
    print('Extracted ch%03d: %d chars' % (num, len(text)))

print('Done')
