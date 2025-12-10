from pathlib import Path
path = Path('src/pages/DoctorDashboard.jsx')
text = path.read_text().splitlines()
start = None
for idx, line in enumerate(text):
    if line.strip() == '{/* Small info box */}':
        start = idx
        break
if start is None:
    raise SystemExit('Marker not found')
end = start
while end < len(text) and text[end].strip() != '':
    end += 1
while end < len(text) and text[end].strip() == '':
    end += 1
new_lines = text[:start] + text[end:]
Path('src/pages/DoctorDashboard.jsx').write_text('\n'.join(new_lines) + '\n')
