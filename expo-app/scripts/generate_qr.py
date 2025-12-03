#!/usr/bin/env python3
import sys
import qrcode

def main():
    if len(sys.argv) < 2:
        print("Usage: generate_qr.py <URL> [output_path]")
        sys.exit(1)

    url = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) >= 3 else "../expo_qr.png"

    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(out)
    print(f"QR saved to: {out}")

if __name__ == '__main__':
    main()
