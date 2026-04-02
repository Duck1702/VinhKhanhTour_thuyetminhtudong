# VinhKhanhTour.AutoNarration

Website giới thiệu phố ẩm thực Vĩnh Khánh kết hợp API thuyết minh tự động đa ngôn ngữ, xây bằng ASP.NET Core.

## Điểm nổi bật

- Trang chủ giới thiệu phố Vĩnh Khánh theo phong cách hiện đại.
- Có thêm trang chi tiết `/about.html` để giới thiệu sâu hơn về khu phố.
- Danh sách món và địa điểm mẫu được lấy từ API.
- Tạo thuyết minh đa ngôn ngữ bằng Azure Translator và Azure Speech.
- Audio MP3 được lưu trong `wwwroot/audio` và phát ngay trên trình duyệt.
- Mỗi món có nút tạo thuyết minh riêng để bấm là chạy ngay.
- Giao diện dùng ảnh thực tế của phố Vĩnh Khánh tải về cục bộ trong `wwwroot/assets`.
- Có section lộ trình cho khách đi từ quận 1 sang phố ẩm thực Vĩnh Khánh.
- Có trang admin `/admin.html` để CRUD nội dung, duyệt thuyết minh, quản lý voice/template và xem thống kê vận hành.

## Chạy dự án

```bash
dotnet restore
dotnet run
```

Mở đường dẫn hiển thị trong terminal để xem website.

## Cấu hình Azure AI

Cập nhật `appsettings.json`:

```json
"AzureAi": {
  "TranslatorEndpoint": "https://api.cognitive.microsofttranslator.com",
  "TranslatorKey": "YOUR_TRANSLATOR_KEY",
  "TranslatorRegion": "southeastasia",
  "SpeechKey": "YOUR_SPEECH_KEY",
  "SpeechRegion": "southeastasia"
}
```

## Cấu hình Admin

Thêm cấu hình trong `appsettings.Development.json` hoặc `appsettings.json`:

```json
"Admin": {
  "ApiKey": "dev-admin-123",
  "TranslationCostPerMillionChars": 10.0,
  "TtsCostPerMillionChars": 16.0
}
```

- Truy cập trang quản trị: `/admin.html`
- Mọi API admin yêu cầu header `X-Admin-Key`.

## API chính

- `GET /api/locations`: lấy danh sách nội dung mẫu.
- `POST /api/narrations`: tạo bản dịch và audio thuyết minh.
- `GET /api/narration-templates`: lấy danh sách thuyết minh có sẵn đã public.

## API Admin chính

- `GET /api/admin/dashboard`: tổng quan vận hành, cost, truy cập.
- `GET/POST/PUT/DELETE /api/admin/locations`: quản lý điểm đến/món ăn.
- `POST /api/admin/locations/{id}/approve`: duyệt nội dung thuyết minh để public.
- `GET/POST/DELETE /api/admin/voice-profiles`: quản lý voice theo ngôn ngữ/kịch bản.
- `GET/POST/DELETE /api/admin/narration-templates`: quản lý thuyết minh có sẵn.
- `GET /api/admin/logs/ai`: log tạo audio + ước tính chi phí AI.
- `GET /api/admin/logs/visits`: log lượt truy cập.

Body mẫu:

```json
{
  "locationId": "oc-tuoc-nuong",
  "targetLanguage": "en",
  "speakingRate": 1.0
}
```

Hoặc dùng nội dung tùy chỉnh:

```json
{
  "customTextVi": "Chào mừng bạn đến phố ẩm thực Vĩnh Khánh...",
  "targetLanguage": "fr",
  "voiceName": "fr-FR-DeniseNeural",
  "speakingRate": 0.95
}
```

## Giao diện website

Trang chủ `/` có:

- Hero giới thiệu dự án.
- Phần giới thiệu khu phố.
- Lộ trình gợi ý cho người xem.
- Danh sách món đặc trưng.
- Form tạo thuyết minh và phát audio.

Trang chi tiết `/about.html` có:

- Mô tả tổng quan về phố ẩm thực Vĩnh Khánh.
- Gợi ý lộ trình trải nghiệm.
- Hai khối ảnh thực tế để dùng trong thuyết trình hoặc demo.

Trang bản đồ `/ban-do.html` có:

- Tích hợp MapLibre.
- Cấu hình nguồn Offline Vector Tiles tại `/assets/vector-tiles/vinh-khanh/{z}/{x}/{y}.pbf`.
- Tự động đánh dấu các quán nổi bật theo toạ độ từ API `/api/locations`.

## Mở rộng tiếp theo

- Kết nối SQL Server thay cho dữ liệu in-memory.
- Thêm cache audio theo `locationId + targetLanguage`.
- Chuyển UI sang Blazor nếu muốn tương tác sâu hơn.
