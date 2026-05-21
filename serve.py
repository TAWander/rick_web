import socket
import socketserver
from http.server import SimpleHTTPRequestHandler
import os

PORT = 8000
# 关键修改：绑定到 0.0.0.0，允许局域网所有设备访问
BIND = "0.0.0.0"

def get_local_ip():
    """获取本机局域网 IP"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

class MyHandler(SimpleHTTPRequestHandler):
    # 可选：解决中文路径乱码
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

if __name__ == "__main__":
    local_ip = get_local_ip()
    
    with socketserver.TCPServer((BIND, PORT), MyHandler) as httpd:
        print(f"\n✅ 服务器已启动，局域网内均可访问：")
        print(f"─────────────────────────────────")
        print(f"🖥  本机访问：http://127.0.0.1:{PORT}")
        print(f"📱  手机/其他设备访问：http://{local_ip}:{PORT}")
        print(f"─────────────────────────────────")
        print(f"按 Ctrl+C 停止\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 服务器已停止")