# VinhKhanhTour.AutoNarration

Website giới thiệu phố ẩm thực Vĩnh Khánh kết hợp API thuyết minh tự động đa ngôn ngữ, xây bằng ASP.NET Core.

## Điểm nổi bật

- Trang chủ giới thiệu phố Vĩnh Khánh theo phong cách hiện đại.
- Có thêm trang chi tiết `/about.html` để giới thiệu sâu hơn về khu phố.
- Danh sách món và địa điểm mẫu được lấy từ API.
- Tạo thuyết minh đa ngôn ngữ bằng Azure Translator và Azure Speech.
- Audio MP3 được lưu trong `wwwroot/audio` và phát ngay trên trình duyệt.
- Mỗi món có nút tạo thuyết minh riêng để bấm là chạy ngay.
- Giao diện dùng ảnh minh họa SVG cục bộ trong `wwwroot/assets`.

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

## API chính

- `GET /api/locations`: lấy danh sách nội dung mẫu.
- `POST /api/narrations`: tạo bản dịch và audio thuyết minh.

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
- Hai khối hình minh họa để dùng trong thuyết trình hoặc demo.

## Mở rộng tiếp theo

- Kết nối SQL Server thay cho dữ liệu in-memory.
- Thêm cache audio theo `locationId + targetLanguage`.
- Chuyển UI sang Blazor nếu muốn tương tác sâu hơn.
