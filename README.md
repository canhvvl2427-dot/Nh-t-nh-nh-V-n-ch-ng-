# Nhặt Nhạnh Văn Chương — bản nối bài đăng vào chuyên mục

## Quan trọng: cần điền Publishable key của đúng project Supabase

Trong Supabase project `nhat-nhanh-van-chuong` (project ID `vrlrvknuawnfdsarubjb` theo ảnh của bạn), vào Project Settings → API Keys và sao chép **Publishable key** (không dùng secret/service_role key).

Mở cả `posts.js` và `cong-dong.html`, thay chuỗi:
`DAN_PUBLISHABLE_KEY_CUA_PROJECT_NAY_VAO_DAY`
bằng Publishable key vừa sao chép. Hai file phải dùng cùng key.

Không đưa secret/service_role key vào website.

## Cách hoạt động

- Khách truy cập vào `cong-dong.html`, chọn chuyên mục, đăng bài công khai.
- Bài được lưu trong bảng `public.posts` của Supabase.
- Bài tự hiện trong đúng trang chuyên mục và tiêu đề bài mới được hiển thị trong ô tương ứng trên trang chủ.
- Không cần tài khoản; vì vậy người lạ cũng có thể gửi nội dung. Hãy kiểm tra bài đăng định kỳ.

## Tải lên GitHub

Tải các file trong thư mục này lên thư mục gốc repository, không tải thư mục cha. Các file trùng tên sẽ được thay thế. Giữ bản ZIP cũ làm dự phòng.
`SUPABASE_SETUP.sql` chỉ chạy trong Supabase SQL Editor, không cần chạy trong GitHub.
