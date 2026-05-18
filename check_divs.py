from pathlib import Path
import re

text = Path('src/pages/HomePage.jsx').read_text('utf-8')
lines = text.splitlines()

stack = []
for i, line in enumerate(lines, 1):
    opens = len(re.findall(r'<div\s', line))
    self_closing = len(re.findall(r'<div[^>]*/>', line))
    closes = line.count('</div>')
    
    net_opens = opens - self_closing
    
    for _ in range(net_opens):
        stack.append(i)
    
    for _ in range(closes):
        if stack:
            stack.pop()
    
    if opens or closes or self_closing:
        print(f"Line {i}: +{net_opens} -{closes} self:{self_closing} | depth={len(stack)} | {line[:70]}")

print(f"\nUnclosed divs: {len(stack)}")
if stack:
    print(f"Opened at lines: {stack}")
