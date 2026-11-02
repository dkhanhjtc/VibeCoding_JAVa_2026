# HostWise AI

Mini app tư vấn chọn gói hosting và tên miền cho chủ shop online nhỏ. Đề 1, Vibe Coding 2026.

Link online: _(điền sau khi deploy)_ · Video demo: _(điền sau khi quay)_

Giá và thông số các gói trong app là dữ liệu minh họa.

## Chức năng

1. Form nhu cầu: loại website, lượng truy cập, ngân sách, mua kèm tên miền.
2. AI gợi ý 1 gói phù hợp nhất và 2 gói thay thế, giải thích bằng tiếng Việt dễ hiểu.
3. Bảng so sánh 3 gói được gợi ý.
4. Đăng ký tư vấn, lưu khách hàng vào localStorage, xem và xuất CSV ở mục "Quản trị Leads".
5. FAQ dạng accordion với 5 câu hỏi.

## Chạy trên máy

Cần Node.js 20 trở lên.

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Mở http://localhost:5173. Điền `GEMINI_API_KEY` trong `.env` để dùng AI thật (lấy key tại [Google AI Studio](https://aistudio.google.com/apikey)). Không có key thì app vẫn chạy bằng bộ quy tắc dự phòng và hiển thị nhãn "Đề Xuất Dự Phòng".

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy app và `/api/analyze` trên máy |
| `npm test` | Chạy test tự động |
| `npm run build` | Build bản production |

## Deploy lên Vercel

1. Import repo vào Vercel, đặt **Root Directory** là `Frontend`.
2. Thêm biến môi trường `GEMINI_API_KEY`. Có thể thêm `GEMINI_MODEL` để đổi model (mặc định `gemini-3.5-flash-lite`).
3. Deploy. Giao diện và `/api/analyze` chạy trên cùng một domain.

## Kiến trúc

```
Frontend/
├── api/                  Serverless function, giữ API key ở phía server
│   ├── analyze.js        Kiểm tra đầu vào, gọi Gemini, kiểm tra đầu ra
│   └── _lib/prompt.js    Prompt và JSON schema
├── src/
│   ├── components/       Giao diện React
│   ├── services/         Gọi API, lưu khách hàng
│   └── shared/           Danh mục gói, rule engine, validate (dùng chung cho cả server)
└── tests/                Test Vitest
```

## Kiểm soát đầu ra AI

AI chỉ được chọn gói và viết lời giải thích. Mọi con số do hệ thống tự tính từ danh mục nội bộ.

- Gemini phải trả JSON theo schema cố định, mã gói nằm trong danh sách cho phép.
- `aiValidator.js` từ chối phản hồi nếu gói không tồn tại, gói thay thế không đủ 2 hoặc bị trùng, gói quá nhỏ so với lượng khách, gói vượt ngân sách khi có gói nhỏ hơn vẫn đủ dùng, hoặc lời giải thích sai định dạng.
- Dữ liệu người dùng được đưa vào prompt dưới dạng JSON để hạn chế prompt injection.
- AI lỗi, quá 12 giây, hoặc bị từ chối thì app chuyển sang rule engine và ghi rõ nhãn dự phòng.

## Giới hạn đã biết

- Chưa giới hạn số lần gọi `/api/analyze`, cần đặt hạn mức cho API key trước khi công khai link lâu dài.
- Nội dung lời giải thích của AI chỉ được kiểm tra định dạng, chưa đối chiếu từng số liệu trong câu chữ.
- Danh sách khách hàng lưu trên trình duyệt theo yêu cầu đề bài, nên chỉ xem được trên chính thiết bị đó.
