
/* Nhặt Nhạnh Văn Chương — bài do người dùng tự đăng, không có nội dung mẫu cài sẵn.
   Dán Publishable key của project Supabase ĐÚNG vào SUPABASE_KEY. */
const SUPABASE_URL = "https://vrlrvknuawnfdsarubjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_HO4vHnkFM1qw1gUyvUbGag_PtGmvnrC";

const NNVC_CATEGORIES = {
  "doc-hieu.html": "Đọc hiểu",
  "on-tap-van.html": "Ôn tập văn",
  "van-mau.html": "Văn mẫu",
  "dien-dat.html": "Diễn đạt",
  "tac-pham.html": "Tác phẩm"
};

const nnvcStyle = document.createElement('style');
nnvcStyle.textContent = `
  .nnvc-community { margin: 30px 0; padding: 24px; background: #fffdf7; border: 1px solid #d9dfd1; border-radius: 18px; color: #344735; }
  .nnvc-community h2 { color: #607a5a; }
  .nnvc-post { padding: 20px 0; border-top: 1px solid #e0e5da; position: relative; }
  .nnvc-post h3 { margin: 8px 0 4px; color: #405640; font-size: 22px; font-weight: bold; }
  .nnvc-meta { font-size: 13px; color: #788071; margin-bottom: 12px; }
  
  /* Cắt chữ và thêm dấy 3 chấm */
  .nnvc-body { 
    white-space: pre-wrap; 
    overflow-wrap: anywhere; 
    display: -webkit-box; 
    -webkit-line-clamp: 5; /* Số dòng cắt */
    -webkit-box-orient: vertical; 
    overflow: hidden; 
    color: #555A4F;
    margin-bottom: 15px;
  }
  
  .nnvc-read-more {
    display: inline-block; color: #607a5a; font-weight: bold; text-decoration: none; font-size: 14px; margin-top: 5px; margin-bottom: 15px;
  }
  .nnvc-read-more:hover { text-decoration: underline; }
  .nnvc-home-feed { margin: 12px 0; padding: 10px; background: #fffdf7; border-radius: 10px; font-size: 13px; }
  .nnvc-home-feed a, .card-post-preview a { display: block; color: #526e4d; text-decoration: none; margin-top: 6px; overflow-wrap: anywhere; }
  .nnvc-error { color: #a13f48; }
`;
document.head.appendChild(nnvcStyle);

function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function date(v) { try { return new Date(v).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return '' } }

function card(p) { 
  // BIẾN XUỐNG DÒNG THÀNH THẺ <BR> ĐỂ CSS CẮT CHỮ HOẠT ĐỘNG
  const formattedContent = esc(p.content).replace(/\n/g, '<br>');

  return `
    <article class="nnvc-post">
      <span class="post-category" style="background:#E8F0E1; color:#7A9B76; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:bold;">${esc(p.category)}</span>
      <h3>${esc(p.title)}</h3>
      <p class="nnvc-meta">Đăng bởi ${esc(p.author_name || 'Ẩn danh')} · Lúc ${date(p.created_at)}</p>
      
      <div class="nnvc-body">${formattedContent}</div>
      <a href="chi-tiet.html?id=${p.id}" class="nnvc-read-more">Đọc bài ➔</a>
    </article>
  `; 
}

function client() { 
  if (!window.supabase) throw Error('Chưa tải được thư viện Supabase. Hãy tải lại trang.'); 
  if (SUPABASE_KEY === 'DAN_PUBLISHABLE_KEY_CUA_PROJECT_NAY_VAO_DAY') throw Error('Cần điền Publishable key của project hiện tại vào posts.js và cong-dong.html.'); 
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

async function fetchPosts(category, limit = 100) { 
  const db = client(); 
  let q = db.from('posts').select('id,title,author_name,category,content,created_at').order('created_at', { ascending: false }).limit(limit); 
  if (category) q = q.eq('category', category); 
  const { data, error } = await q; 
  if (error) throw error; 
  return data || [];
}

async function loadHome() {
  for (const el of document.querySelectorAll('[data-preview-category]')) { 
    try { 
      const ps = await fetchPosts(el.dataset.previewCategory, 3); 
      el.innerHTML = ps.length ? ps.map(p => `<a href="${esc(el.dataset.previewHref || 'cong-dong.html')}">${esc(p.title)}</a>`).join('') : 'Chưa có bài viết trong mục này.' 
    } catch (e) { el.textContent = 'Chưa kết nối được kho bài viết.' } 
  }
  for (const el of document.querySelectorAll('[data-home-category]')) { 
    try { 
      const ps = await fetchPosts(el.dataset.homeCategory, 5); 
      el.innerHTML = ps.length ? ps.map(p => {
         const formattedContent = esc(p.content).replace(/\n/g, '<br>');
         return `
        <article class="nnvc-post">
          <h3><a href="chi-tiet.html?id=${p.id}" style="color:inherit;text-decoration:none">${esc(p.title)}</a></h3>
          <p class="nnvc-meta">${esc(p.author_name || 'Ẩn danh')} · ${date(p.created_at)}</p>
          <div class="nnvc-body">${formattedContent}</div>
          <a href="chi-tiet.html?id=${p.id}" class="nnvc-read-more">Đọc bài ➔</a>
        </article>
      `}).join('') : 'Chưa có bài viết. Hãy bấm “Viết bài” để tự thêm nội dung.' 
    } catch (e) { el.textContent = 'Chưa kết nối được kho bài viết.' } 
  }
}

async function loadCategory() { 
  const file = location.pathname.split('/').pop() || 'index.html'; 
  const category = NNVC_CATEGORIES[file]; 
  if (!category) return; 
  
  const section = document.querySelector('.nnvc-category-feed'); 
  if (!section) return; 
  
  const box = section.querySelector('.nnvc-posts'); 
  try { 
    const ps = await fetchPosts(category); 
    box.innerHTML = ps.length ? ps.map(card).join('') : '<p>Chưa có bài viết trong mục này. Bấm “Viết bài mới” để thêm bài đầu tiên nhé.</p>';
  } catch (e) { 
    box.innerHTML = `<p class="nnvc-error">${esc(e.message)}</p>`;
  } 
}

document.addEventListener('DOMContentLoaded', () => { loadHome(); loadCategory(); });
