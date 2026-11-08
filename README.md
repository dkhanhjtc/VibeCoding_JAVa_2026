# HostWise AI

Mini app tư vấn chọn gói hosting và tên miền cho chủ shop online nhỏ. Đề 1, Vibe Coding 2026.

- **Link online:** _(điền sau khi deploy)_
- **Video demo:** _(điền sau khi quay)_
- **Nhóm:** Nguyễn Đăng Khánh, Đỗ Quang Minh

Giá và thông số các gói trong app là dữ liệu minh họa, không phải báo giá của nhà cung cấp.

## Chức năng

Theo yêu cầu đề bài:

1. **Form nhu cầu:** loại website (có lựa chọn "Khác" để tự nhập), số sản phẩm, số website (trên 5 thì tự nhập số), lượt truy cập mỗi tháng, ngân sách, có mua kèm tên miền không (kèm ô nhập ý tưởng tên miền).
2. **AI gợi ý** 1 gói phù hợp nhất và 2 gói thay thế, giải thích bằng tiếng Việt đơn giản.
3. **Bảng so sánh** 3 gói được gợi ý: giá, dung lượng, lượt khách, số website, sao lưu, hỗ trợ.
4. **Đăng ký tư vấn:** nhập tên và số điện thoại, lưu vào danh sách khách hàng trong localStorage.
5. **FAQ** dạng accordion với 5 câu hỏi về hosting và tên miền.

Bổ sung:

- **Cảnh báo vượt ngân sách** khi gói nhỏ nhất đủ cho lượng khách vẫn đắt hơn ngân sách, kèm số tiền chênh lệch.
- **Nhãn nguồn kết quả:** "Gemini AI" khi AI trả lời hợp lệ, "Dự phòng · không dùng AI" khi dùng bộ quy tắc nội bộ.
- **Trang quản trị** xem, xuất CSV và xóa danh sách khách hàng. Mở bằng nút "Đăng nhập Quản Trị", tài khoản demo hiển thị sẵn ở màn hình đăng nhập.

## Chạy trên máy

Cần Node.js 20 trở lên.

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Mở http://localhost:5173. Điền `GEMINI_API_KEY` trong `.env` để dùng AI thật (lấy key tại [Google AI Studio](https://aistudio.google.com/apikey)). Không có key thì app vẫn chạy bằng bộ quy tắc dự phòng.

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy app và `/api/analyze` trên máy |
| `npm test` | Chạy 325 test tự động |
| `npm run build` | Build bản production |

## Deploy lên Vercel

Chưa thử thực tế, các bước dự kiến:

1. Import repo vào Vercel, đặt **Root Directory** là `Frontend`.
2. Thêm biến môi trường `GEMINI_API_KEY`. Có thể thêm `GEMINI_MODEL` để đổi model (mặc định `gemini-3.5-flash-lite`).
3. Deploy. Giao diện và `/api/analyze` chạy trên cùng một domain.

## Kiến trúc

```
Frontend/
├── api/                  Serverless function, giữ API key ở phía server
│   ├── analyze.js        Kiểm tra đầu vào, gọi Gemini, kiểm tra đầu ra, tự gọi lại khi lỗi tạm thời
│   └── _lib/prompt.js    Prompt và JSON schema
├── src/
│   ├── components/       Giao diện React
│   ├── services/         Gọi API, lưu khách hàng, đăng nhập quản trị
│   └── shared/           Danh mục gói, rule engine, kiểm tra dữ liệu (dùng chung cho cả server)
└── tests/                Test Vitest
```

Luồng xử lý một lần gợi ý:

1. Form kiểm tra dữ liệu rồi gửi tới `/api/analyze`.
2. Server kiểm tra lại dữ liệu, gửi prompt cho Gemini và yêu cầu trả JSON theo schema.
3. Server kiểm tra phản hồi của AI. Hợp lệ thì trả về, không hợp lệ thì báo dự phòng.
4. Trình duyệt kiểm tra lại lần nữa và tự tính chi phí. Nếu API lỗi hoặc báo dự phòng, rule engine tính gợi ý ngay trên trình duyệt.

## Kiểm soát đầu ra AI

AI chỉ được chọn gói và viết lời giải thích. Mọi con số về giá do hệ thống tự tính từ danh mục nội bộ.

- Gemini phải trả JSON theo schema cố định, mã gói nằm trong danh sách cho phép.
- `aiValidator.js` từ chối phản hồi nếu gói không tồn tại, gói thay thế không đủ 2 hoặc bị trùng, gói quá nhỏ so với lượng khách, gói vượt ngân sách khi có gói nhỏ hơn vẫn đủ dùng, lời giải thích sai định dạng, hoặc có chứa link hay mã HTML.
- Chữ người dùng tự gõ (tên shop, ý tưởng tên miền) **không được gửi cho AI**, nên không thể dùng để điều khiển AI. AI chỉ nhận các lựa chọn có sẵn trong form.
- Gemini lỗi tạm thời (500, 503) hoặc trả lời quá 10 giây thì server tự gọi lại 1 lần. Vẫn lỗi hoặc bị từ chối thì app chuyển sang rule engine và ghi rõ nhãn dự phòng.

Rule engine chọn gói nhỏ nhất đủ cho lượng khách. Shop bán hàng được ưu tiên tối thiểu gói Đồng hành nếu ngân sách cho phép. Tên miền gợi ý đuôi `.vn`, riêng blog hoặc ngân sách dưới 100.000đ thì gợi ý `.com`.

## Kiểm thử

Chạy `npm test` trong thư mục `Frontend`. Kết quả hiện tại: **325/325 test đạt**.

| File | Số test | Nội dung |
|---|---:|---|
| `ruleEngine.test.js` | 211 | Mọi tổ hợp lượt khách, loại website, ngân sách; số website cần chạy; chi phí; chuẩn hóa tên miền |
| `validation.test.js` | 36 | Kiểm tra form nhu cầu (gồm ô tự nhập), số điện thoại, email |
| `analyze.test.js` | 23 | API: chặn dữ liệu sai, xử lý lỗi Gemini, tự gọi lại, không gửi chữ người dùng cho AI |
| `aiValidator.test.js` | 18 | Từ chối phản hồi AI sai nghiệp vụ (kể cả gói không đủ số website), link, mã HTML |
| `services.test.js` | 11 | Dự phòng khi API lỗi, lưu khách hàng, xuất CSV an toàn |
| `ConsultationModal.test.jsx` | 10 | Form đăng ký: kiểm tra dữ liệu, tính tổng tiền, lưu khách |
| `NeedsSurveyForm.test.jsx` | 10 | Form nhu cầu: báo lỗi, ẩn hiện ô tên miền và ô tự nhập, nút Mẫu |
| `authService.test.js` | 6 | Đăng nhập quản trị |

Đã chạy thử với Gemini thật (`gemini-3.5-flash-lite`) ngày 02/11 và 07/11: các ca trong ngân sách và vượt ngân sách đều cho gói đúng nghiệp vụ, kèm cảnh báo đúng số tiền chênh lệch.

## Phân công và quá trình phát triển

| Thành viên | Phần việc |
|---|---|
| Nguyễn Đăng Khánh | Phiên bản đầu của toàn bộ ứng dụng; thiết kế lại giao diện; trang đăng nhập và quản trị |
| Đỗ Quang Minh | Rà soát theo đề bài và Bảng A; tích hợp AI thật và kiểm soát đầu ra; sửa logic nghiệp vụ; kiểm thử; tài liệu |

| Ngày | Người làm | Commit | Nội dung |
|---|---|---|---|
| 01/11 | Khánh | `61da7da` | Phiên bản đầu: giao diện, form, bảng so sánh, FAQ, API, prompt, rule engine |
| 02/11 | Minh | `0443a76` | Nối API với giao diện, đổi model Gemini, kiểm tra đầu vào và đầu ra AI, viết lại rule engine, dọn repo, 275 test |
| 02/11 | Minh | `3fb1e05` `c358a3c` `bf75823` | Sửa giao diện header, ô ngân sách, chỉnh prompt cho dễ hiểu |
| 03/11 | Khánh | `55c6707` `71f7a30` | Thiết kế lại giao diện, thêm đăng nhập và trang quản trị |
| 05/11 | Minh | `4240bb1` → `389fb9a` | Ô mua kèm tên miền, cảnh báo vượt ngân sách, bỏ dữ liệu giả, dọn repo, không gửi chữ người dùng cho AI, test form, tự gọi lại Gemini |

## Cách nhóm sử dụng AI

**Đỗ Quang Minh** dùng Claude Code (Anthropic) trong quá trình rà soát và hoàn thiện:

1. Cung cấp đề bài và Bảng A, yêu cầu AI đánh giá tiến độ và chấm thử.
2. Chọn thứ tự sửa theo mức ảnh hưởng tới điểm và làm trên nhánh riêng `fix/ai-integration` để không ảnh hưởng nhánh `main`.
3. Với mỗi việc, AI phân tích code và đưa hướng dẫn. Minh tự sửa theo hướng dẫn hoặc cho AI sửa, rồi nhờ AI chạy test, build và thử trên trình duyệt để kiểm tra lại.
4. Thử với Gemini thật, gửi ảnh kết quả cho AI đối chiếu với nghiệp vụ, rồi chỉnh prompt.

**Nguyễn Đăng Khánh:** _(bổ sung công cụ AI đã dùng và cách dùng khi làm phiên bản đầu và giao diện mới)_

Một số vấn đề phát hiện được và cách xử lý:

| Vấn đề | Cách xử lý |
|---|---|
| Giao diện và API tách thành 2 thư mục, gọi `/api/analyze` bị lỗi 404 | Gộp API vào `Frontend` để deploy chung |
| Model `gemini-1.5-flash` đã bị Google tắt | Đổi sang model hiện hành, cấu hình được qua biến môi trường |
| Prompt không có giá và thông số gói, AI phải đoán | Đưa danh mục gói và quy tắc chọn vào prompt |
| 42/84 tổ hợp thử gợi ý vượt ngân sách mà không cảnh báo | Viết lại rule engine, thêm cảnh báo và gói vừa túi tiền |
| AI dùng thuật ngữ (NVMe, WooCommerce), viết "vượt một chút" khi vượt 79.000đ | Thêm quy tắc viết vào prompt, thử lại với Gemini thật |
| Form thiếu lựa chọn mua kèm tên miền sau khi thiết kế lại | Thêm lại ô chọn và ô nhập tên miền |
| Form điền sẵn dữ liệu giả, bấm một lần là lưu khách giả | Bỏ dữ liệu giả, giữ nút "Mẫu" để demo |
| 3 ô mới bắt buộc nhưng API không đọc, mọi yêu cầu gửi AI bị chặn | Phát hiện nhờ test, cho API đọc đủ và chỉ chấp nhận giá trị có trong form |
| Gemini lỗi 503 liên tục ngày 05/11 | Tự gọi lại 1 lần khi lỗi tạm thời, nới thời gian chờ |

## Giới hạn đã biết

- Chưa giới hạn số lần gọi `/api/analyze`, cần đặt hạn mức cho API key trước khi công khai link lâu dài.
- Lời giải thích của AI được kiểm tra định dạng, chặn link và mã HTML, nhưng chưa kiểm tra nghĩa từng câu.
- AI có thể chọn gói lớn hơn mức cần nếu vẫn nằm trong ngân sách.
- Số website cần chạy quyết định gói tối thiểu, tối đa 10 website (giới hạn của gói lớn nhất). Số sản phẩm và trình độ kỹ thuật là bắt buộc nhưng chưa ảnh hưởng tới gói được gợi ý.
- Nội dung ô "Khác" (loại website tự nhập) không gửi cho AI; AI và bộ quy tắc xử lý loại này như một website thông thường.
- Đăng nhập quản trị chỉ để demo: kiểm tra mật khẩu trên trình duyệt, không phải bảo mật thật.
- Danh sách khách hàng lưu trên trình duyệt theo yêu cầu đề bài, nên chỉ xem được trên chính thiết bị đó.
- Khi Gemini quá tải kéo dài, app dùng bộ quy tắc dự phòng thay vì AI.
