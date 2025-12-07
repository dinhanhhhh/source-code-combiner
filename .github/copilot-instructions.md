# Hướng dẫn cho AI Coding Agents

## Tổng quan về Dự án

Đây là một công cụ web được viết bằng React + TypeScript để phân tích và trích xuất mã nguồn của các dự án. Mục tiêu chính là tạo ra một tệp văn bản duy nhất chứa toàn bộ mã nguồn quan trọng của dự án, phục vụ cho việc cung cấp ngữ cảnh cho các mô hình AI.

## Kiến trúc và Thành phần Chính

### Components (trong thư mục `/components`)
- `FileSelector.tsx`: Component chính để chọn thư mục dự án
- `FileList.tsx`, `FileListItem.tsx`: Hiển thị danh sách các tệp
- `ConfigurePanel.tsx`: Panel cấu hình và điều khiển
- `PreviewPanel.tsx`: Xem trước kết quả trích xuất
- `LogPanel.tsx`: Hiển thị logs và thông báo

### Utils (trong thư mục `/utils`)
- `file-helpers.ts`: Các hàm xử lý tệp và thư mục
- `format.ts`: Các hàm định dạng dữ liệu

### Hooks (trong thư mục `/hooks`)
- `useMediaQuery.ts`: Hook tùy chỉnh cho responsive design

## Quy ước và Pattern

1. **Tổ chức Component:**
   - Mỗi component được đặt trong một file riêng
   - Props được định nghĩa rõ ràng với TypeScript interfaces
   - Sử dụng functional components với hooks

2. **State Management:**
   - Sử dụng React hooks (`useState`, `useEffect`)
   - Không sử dụng thư viện state management bên ngoài

3. **File Processing:**
   - Xử lý hoàn toàn ở client-side để đảm bảo quyền riêng tư
   - Sử dụng Web File System API để đọc tệp và thư mục

4. **Internationalization:**
   - Sử dụng `i18n.ts` để quản lý đa ngôn ngữ (Tiếng Việt và Tiếng Anh)
   - Chuỗi văn bản được định nghĩa trong các file ngôn ngữ riêng

## Developer Workflows

### Setup Môi trường
```bash
npm install
```

### Phát triển
```bash
npm run dev
```

### Build và Preview
```bash
npm run build
npm run preview
```

## Tích hợp và Phụ thuộc

- React 19
- TypeScript 5.8
- Vite 6.2
- Web File System API cho xử lý tệp

## Các Pattern Đặc biệt Cần Lưu ý

1. **Xử lý File Nhạy cảm:**
   - Tự động phát hiện và cảnh báo về các file nhạy cảm (ví dụ: `.env`, credentials)
   - Xem `SensitiveFileList.tsx` để hiểu logic phát hiện

2. **Performance Optimization:**
   - Sử dụng memo hóa cho các danh sách file lớn
   - Xử lý file theo batch để tránh treo UI

3. **Error Handling:**
   - Các lỗi liên quan đến file được hiển thị trong `LogPanel`
   - Sử dụng error boundaries cho các component chính