from PIL import Image, ImageSequence
import json

imageName = input("zadaj meno GIFu: ")
img = Image.open(imageName + ".gif")

WIDTH = img.width
HEIGHT = img.height

count = 0
frames = []
for frame in ImageSequence.Iterator(img):
    frames.append(frame.copy())
    count += 1

result = Image.new(mode='RGBA', size=(WIDTH*count, HEIGHT))

x = 0
for frame in frames:
    result.paste(frame, (x, 0))
    x += WIDTH

result.save(imageName + "_sheet.png", format="PNG")

data = {
    'frame_count': count,
    'frame_width': WIDTH,
    'frame_height': HEIGHT
}

with open(imageName + '_data.json', 'w', encoding='utf-8') as file:
    json.dump(data, file)


input("files created!")
