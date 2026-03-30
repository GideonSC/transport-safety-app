import zlib
import struct


def chunk(tag, data):
    return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)


def write_png(path, width, height, color):
    header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    row = b''.join(bytes(color) for _ in range(width))
    data = b''.join(b'\x00' + row for _ in range(height))
    idat = zlib.compress(data)
    png = header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)


write_png('client/public/icon-192.png', 192, 192, (11, 79, 108))
write_png('client/public/icon-512.png', 512, 512, (11, 79, 108))
print('icons created')
