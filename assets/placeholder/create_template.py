#!/usr/bin/env python3
"""
Generate a template image for The Workshop background art.
Shows where to draw and where to leave transparent for animations.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL/Pillow not installed. Installing...")
    import subprocess
    subprocess.check_call(['python', '-m', 'pip', 'install', 'pillow'])
    from PIL import Image, ImageDraw, ImageFont

# Canvas size
WIDTH = 360
HEIGHT = 640

# Create image with transparency
img = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# Try to use a font, fall back to default if not available
try:
    font = ImageFont.truetype("arial.ttf", 12)
    small_font = ImageFont.truetype("arial.ttf", 10)
except:
    font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Color scheme
DRAW_AREA = (200, 230, 255, 80)      # Light blue - areas to draw
TRANSPARENT_AREA = (255, 200, 200, 80)  # Light red - leave transparent
OUTLINE = (100, 100, 100, 255)       # Gray outline
TEXT = (0, 0, 0, 255)                # Black text
HIGHLIGHT = (255, 100, 100, 200)     # Red highlight

# Draw the main canvas area (where you should draw)
draw.rectangle([0, 0, WIDTH-1, HEIGHT-1], outline=OUTLINE, width=2)

# Add grid for reference
for i in range(0, WIDTH, 40):
    draw.line([(i, 0), (i, HEIGHT)], fill=(200, 200, 200, 100), width=1)
for i in range(0, HEIGHT, 40):
    draw.line([(0, i), (WIDTH, i)], fill=(200, 200, 200, 100), width=1)

# Title
draw.rectangle([0, 0, WIDTH, 25], fill=(50, 50, 50, 200))
draw.text((WIDTH//2 - 80, 8), "Workshop Background Template", fill=(255, 255, 255, 255), font=font)

# Background area (where you SHOULD draw)
draw.rectangle([5, 30, WIDTH-5, HEIGHT-5], fill=DRAW_AREA)
draw.text((WIDTH//2 - 100, 40), "DRAW YOUR BACKGROUND HERE", fill=TEXT, font=font)
draw.text((10, 55), "• Walls, floor, window frame, shelves", fill=TEXT, font=small_font)
draw.text((10, 70), "• Workbench surface, decorations", fill=TEXT, font=small_font)
draw.text((10, 85), "• Any background details you want!", fill=TEXT, font=small_font)

# ANIMATED ELEMENTS - Leave these TRANSPARENT!

# 1. Radio area (with antenna)
radio_x, radio_y = 50, 50
radio_w, radio_h = 60, 70
draw.rectangle([radio_x, radio_y, radio_x+radio_w, radio_y+radio_h],
               fill=TRANSPARENT_AREA, outline=HIGHLIGHT, width=3)
draw.text((radio_x+5, radio_y+15), "RADIO", fill=TEXT, font=font)
draw.text((radio_x-10, radio_y+30), "Leave", fill=TEXT, font=small_font)
draw.text((radio_x-10, radio_y+42), "transparent!", fill=TEXT, font=small_font)
draw.text((radio_x-10, radio_y+54), "(animated)", fill=HIGHLIGHT, font=small_font)

# 2. Plant area
plant_x, plant_y = 280, 85
plant_w, plant_h = 40, 65
draw.rectangle([plant_x, plant_y, plant_x+plant_w, plant_y+plant_h],
               fill=TRANSPARENT_AREA, outline=HIGHLIGHT, width=3)
draw.text((plant_x+5, plant_y+20), "PLANT", fill=TEXT, font=font)
draw.text((plant_x-15, plant_y+35), "Leave", fill=TEXT, font=small_font)
draw.text((plant_x-15, plant_y+47), "transparent!", fill=TEXT, font=small_font)

# REFERENCE AREAS - You can draw these OR leave transparent

# 3. Window area (can be part of your background)
window_x, window_y = 140, 20
window_w, window_h = 80, 60
draw.rectangle([window_x, window_y, window_x+window_w, window_y+window_h],
               outline=(100, 200, 100, 200), width=2)
draw.text((window_x+10, window_y+25), "WINDOW", fill=(0, 100, 0, 255), font=font)
draw.text((window_x-35, window_y+40), "(optional - code", fill=(0, 100, 0, 200), font=small_font)
draw.text((window_x-35, window_y+52), "will draw if empty)", fill=(0, 100, 0, 200), font=small_font)

# 4. Shelf areas
shelf_x, shelf_y = 20, 150
shelf_w = 320
for i in range(3):
    y = shelf_y + (i * 50)
    draw.rectangle([shelf_x, y+30, shelf_x+shelf_w, y+38],
                   outline=(150, 150, 100, 150), width=1)
    if i == 1:
        draw.text((shelf_x+100, y+15), "Shelves (for constructs)", fill=(100, 100, 50, 200), font=small_font)

# 5. Workbench area
wb_x, wb_y = 90, 400
wb_w, wb_h = 180, 100
draw.rectangle([wb_x, wb_y, wb_x+wb_w, wb_y+wb_h],
               outline=(150, 100, 50, 150), width=2)
draw.text((wb_x+40, wb_y+45), "WORKBENCH", fill=(100, 70, 30, 200), font=font)
draw.text((wb_x+10, wb_y+60), "(draw or leave to code)", fill=(100, 70, 30, 150), font=small_font)

# 6. Floor area
floor_y = 540
draw.line([(0, floor_y), (WIDTH, floor_y)], fill=(139, 69, 19, 150), width=3)
draw.text((WIDTH//2-20, floor_y+10), "FLOOR LINE", fill=(139, 69, 19, 200), font=small_font)

# 7. Piece spawn area
piece_y = 555
draw.rectangle([50, piece_y, 310, piece_y+30],
               outline=(200, 150, 50, 150), width=1)
draw.text((100, piece_y+10), "Pieces appear here", fill=(200, 150, 50, 200), font=small_font)

# Add legend at bottom
legend_y = HEIGHT - 60
draw.rectangle([5, legend_y, WIDTH-5, HEIGHT-5], fill=(255, 255, 255, 220), outline=OUTLINE)
draw.text((10, legend_y+5), "LEGEND:", fill=TEXT, font=font)

# Color boxes for legend
draw.rectangle([10, legend_y+22, 25, legend_y+32], fill=DRAW_AREA, outline=OUTLINE)
draw.text((30, legend_y+20), "= Draw your background here", fill=TEXT, font=small_font)

draw.rectangle([10, legend_y+37, 25, legend_y+47], fill=TRANSPARENT_AREA, outline=HIGHLIGHT)
draw.text((30, legend_y+35), "= LEAVE TRANSPARENT (for animations!)", fill=HIGHLIGHT, font=small_font)

# Save the template
img.save('workshop-template.png')
print("Template created: workshop-template.png")
print("\nHow to use:")
print("1. Open workshop-template.png in your image editor")
print("2. Draw your background in the blue areas")
print("3. IMPORTANT: Leave the red areas transparent (delete that layer)")
print("4. Save as 'workshop-day.png' (keep transparency!)")
print("5. Create 'workshop-night.png' (same layout, darker colors)")
print("6. Drop both files in assets/placeholder/")
print("\nThe radio and plant will animate on top of your background!")
