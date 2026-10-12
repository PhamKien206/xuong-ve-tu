// Lưu sẵn toàn bộ app vào máy ở lần mở đầu để các lần sau chạy không cần mạng.
// build.mjs đổi mã phiên bản dưới đây theo nội dung app: có bản mới thì trình duyệt tải về nền, lần mở kế tiếp sẽ dùng bản mới.
const CACHE='xvt-7d557e3a7899';
const FILES=['./','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('xvt-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  // mọi kiểu mở trang (có ?tham-số, /index.html…) đều trả về trang đã lưu
  e.respondWith(caches.open(CACHE).then(c=>c.match(r.mode==='navigate'?'./':r,{ignoreSearch:true})).then(hit=>hit||fetch(r)));
});
