
/* Nhặt Nhạnh Văn Chương — Bản posts.js hoàn chỉnh chống lẫn lộn danh mục */
const SUPABASE_URL = "https://vrlrvknuawnfdsarubjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_HO4vHnkFM1qw1gUyvUbGag_PtGmvnrC";

const NNVC_CATEGORIES = {
  "doc-hieu.html": "Đọc hiểu",
  "on-tap-van.html": "Ôn tập văn",
  "van-mau.html": "Văn mẫu",
  "dien-dat.html": "Diễn đạt",
  "tac-pham.html": "Tác phẩm"
};

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const nnvcStyle = document.createElement('style');
nnvcStyle.textContent = `
  .nnvc-community { margin: 30px 0; padding: 24px; background: #fffdf7; border: 1px solid #d9dfd1; border-radius: 18px; color: #344735; }
  .nnvc-community h2 { color: #607a5a; }
  .nnvc-post { padding: 20px 0; border-top: 1px solid #e0e5da; position: relative; }
  .nnvc-post h3 { margin: 8px 0 4px; color: #405640; font-size: 22px; font-weight: bold; }
  .nnvc-meta { font-size: 13px; color: #788071; margin-bottom: 12px; }
  .nnvc-body { white-space: pre-wrap; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; color: #555A4F; margin-bottom: 15px; line-height: 1.6; }
  .nnvc-read-more { display: inline-block; color: #607a5a; font-weight: bold; text-decoration: none; font-size: 14px; margin-top: 5px; margin-bottom: 15px; }
  .nnvc-read-more:hover { text-decoration: underline; }
  .nnvc-actions { margin-top: 10px; display: flex; gap: 8px; }
  .nnvc-actions button { padding: 6px 14px; font-size: 13px; border: none; border-radius: 15px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: bold; transition: 0.2s;}
  .nnvc-actions button:hover { opacity: 0.8; transform: translateY(-1px); }
  .btn-edit { background: #E8E5D8; color: #555A4F; }
  .btn-del { background: #E29595; color: white; }
  .nnvc-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center; padding: 15px; }
  .nnvc-modal.active { display: flex; }
  .nnvc-modal-content { background: white; padding: 25px; border-radius: 20px; width: 100%; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
  .nnvc-modal-content h3 { margin-top: 0; color: #7A9B76; font-size: 22px; font-family: 'Quicksand', sans-serif;}
  .nnvc-modal-content input, .nnvc-modal-content select, .nnvc-modal-content textarea { width: 100%; margin-bottom: 15px; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-family: inherit; font-size: 15px; background: #FAFAFA; }
  .nnvc-modal-content textarea { height: 200px; resize: vertical; }
  .nnvc-modal-btns { display: flex; gap: 10px; justify-content: flex-end; }
  .nnvc-btn-save { background: #7A9B76; color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
  .nnvc-btn-cancel { background: #E8E5D8; color: #555A4F; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: bold; }
`;
document.head.appendChild(nnvcStyle);

const modalHTML = `
  <div id="nnvcEditModal" class="nnvc-modal">
    <div class="nnvc-modal-content">
      <h3>✏️ Chỉnh sửa bài viết</h3>
      <input id="nnvcEditTitle" placeholder="Tiêu đề bài viết">
      <select id="nnvcEditCategory">
        <option value="Đọc hiểu">Đọc hiểu</option>
        <optgroup label="📚 Ôn tập văn">
          <option value="Ôn tập văn - Nghị luận văn học">Nghị luận văn học (Ôn tập)</option>
          <option value="Ôn tập văn - Nghị luận xã hội">Nghị luận xã hội (Ôn tập)</option>
        </optgroup>
        <optgroup label="📝 Văn mẫu">
