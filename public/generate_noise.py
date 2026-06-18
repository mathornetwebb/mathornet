import os
import random
from PIL import Image

width, height = 256, 256
img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
pixels = img.load()

for y in range(height):
    for x in range(width):
        # Generate monochromatic noise
        val = random.randint(0, 255)
        # Use low alpha to make it subtle
        pixels[x, y] = (val, val, val, 20)

img.save('f:/Antigravity/Mathörnet/public/img/pure_noise.png')
print("Noise image generated!")
