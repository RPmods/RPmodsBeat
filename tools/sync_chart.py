from pathlib import Path
p=Path(__file__).resolve().parents[1]/'assets'
(p/'chart.js').write_text('window.CHART='+ (p/'vocal-chart.json').read_text(encoding='utf-8')+';\n',encoding='utf-8')
