# VinhKhanhTour.AutoNarration (C#)

Website và API thuyết minh tự động đa ngôn ngữ cho phố ẩm thực Vĩnh Khánh, viết bằng ASP.NET Core.

## Chức năng chính

- Trang chủ giới thiệu phố ẩm thực Vĩnh Khánh với giao diện hiện đại.
- Danh sách món/điểm ăn uống nổi bật được đổ dữ liệu từ API.
- Tạo thuyết minh tự động đa ngôn ngữ bằng Azure Translator + Azure Speech.
- Lưu audio MP3 vào `wwwroot/audio` và phát ngay trên website.

## Yêu cầu

- .NET SDK 9.0+
- Azure AI Translator (Key + Region)
- Azure AI Speech (Key + Region)

## Cấu hình

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

## Chạy dự án

```bash
dotnet restore
dotnet run
```

Sau khi chạy, mở trình duyệt tại địa chỉ ứng dụng hiển thị trong terminal để xem website.

## API chính

### 1) Lấy danh sách nội dung

`GET /api/locations`

### 2) Tạo thuyết minh

`POST /api/narrations`

Body mẫu:

```json
{
  "locationId": "oc-tuoc-nuong",
  "targetLanguage": "en",
  "speakingRate": 1.0
}
```

Hoặc gửi nội dung tiếng Việt tùy chỉnh:

```json
{
  "customTextVi": "Chào mừng bạn đến phố ẩm thực Vĩnh Khánh...",
  "targetLanguage": "fr",
  "voiceName": "fr-FR-DeniseNeural",
  "speakingRate": 0.95
}
```

Kết quả trả về gồm:

- `translatedText`: nội dung sau dịch.
- `voiceName`: giọng đã dùng.
- `audioUrl`: link file MP3 đã tạo.

## Giao diện website

Trang chủ ở `/` gồm:

- Hero giới thiệu phố ẩm thực Vĩnh Khánh.
- Khối giới thiệu lý do nên chọn khu phố này.
- Danh sách món/điểm mẫu lấy từ API.
- Form tạo thuyết minh để phát audio ngay trên trình duyệt.

## Gợi ý mở rộng

- Kết nối database (SQL Server) thay cho dữ liệu in-memory.
- Thêm cơ chế cache audio theo `locationId + targetLanguage` để tiết kiệm chi phí API.
- Chuyển sang Blazor nếu muốn giao diện tương tác sâu hơn hoặc làm app dạng web app đầy đủ.
