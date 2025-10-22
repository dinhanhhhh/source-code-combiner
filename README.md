<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<h1 align="center">Trích xuất Mã nguồn Dự án (Project Source Dumper)</h1>

<p align="center">
  Một công cụ web thông minh giúp phân tích, lọc và đóng gói toàn bộ mã nguồn của một dự án thành một tệp văn bản duy nhất. Được thiết kế đặc biệt để tối ưu hóa việc cung cấp ngữ cảnh cho các mô hình ngôn ngữ lớn (LLM).
</p>

<p align="center">
  <!-- Badges for professionalism -->
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" alt="TypeScript 5.8">
  <img src="https://img.shields.io/badge/Vite-6.2-purple?logo=vite" alt="Vite 6.2">
</p>

<p align="center">
  <strong><a href="https://ai.studio/apps/drive/18goTRysiP9CTXQt9Gz7OSBq_1rmyCWg4">🚀 Xem trực tiếp trên AI Studio 🚀</a></strong>
</p>

---

Đây là một công cụ web mạnh mẽ được thiết kế để giải quyết một vấn đề phổ biến của các lập trình viên và nhà phát triển AI: làm thế nào để nhanh chóng và hiệu quả trích xuất toàn bộ mã nguồn của một dự án? Thay vì sao chép thủ công từng tệp, công cụ này tự động hóa quy trình, đảm bảo bạn chỉ nhận được những tệp quan trọng nhất, được định dạng gọn gàng trong một tệp văn bản duy nhất.

## 🛡️ Triết lý cốt lõi: Quyền riêng tư là trên hết

**100% xử lý phía Client.** Mọi quá trình phân tích, đọc và kết hợp tệp đều diễn ra trực tiếp trên trình duyệt của bạn. **Không có bất kỳ tệp nào được tải lên máy chủ.** Điều này đảm bảo quyền riêng tư và bảo mật tuyệt đối cho mã nguồn của bạn.

## ✨ Tính năng chính

- **🤖 Tự động nhận diện công nghệ:**
  - Phân tích sâu các tệp cấu hình như `package.json`, `pom.xml`, `go.mod`, `pyproject.toml`,...
  - Tự động xác định các công nghệ chính (React, Node.js, Python, Java, Go,...) và áp dụng bộ lọc tệp phù hợp nhất cho công nghệ đó.

- **🗑️ Lọc tệp thông minh & Toàn diện:**
  - Tự động loại bỏ các thư mục và tệp không cần thiết dựa trên một danh sách bỏ qua (blacklist) toàn diện, bao gồm:
    - Thư mục dependencies (`node_modules`, `vendor`, `venv`,...)
    - Thư mục build (`dist`, `build`, `target`, `.next`,...)
    - Tệp của hệ thống quản lý phiên bản (`.git`, `.svn`,...)
    - Tệp cấu hình IDE (`.vscode`, `.idea`,...)
    - Tệp media, font, tài liệu và các tệp nhị phân.
    - Tệp log và lock files.

- **⚠️ Cảnh báo tệp nhạy cảm:**
  - Chủ động quét tên tệp và nội dung để tìm kiếm các thông tin nhạy cảm (ví dụ: `.env`, `credentials.json`, các từ khóa như `API_KEY`, `PRIVATE_KEY`).
  - Tự động loại trừ các tệp này và hiển thị chúng trong một danh sách riêng biệt với cảnh báo rõ ràng, giúp bạn bảo vệ an toàn cho các bí mật của dự án.

- **✍️ Toàn quyền tùy chỉnh:**
  - Giao diện trực quan hiển thị rõ ràng 3 danh sách: Tệp đã bao gồm, Tệp bị loại trừ tự động, và Tệp nhạy cảm.
  - Người dùng có thể dễ dàng di chuyển tệp giữa các danh sách chỉ với một cú nhấp chuột, đảm bảo kết quả cuối cùng chính xác theo ý muốn.

- **🌳 Tạo cây thư mục trực quan:**
  - Tự động tạo một cây thư mục dạng văn bản của tất cả các tệp được bao gồm, giúp người đọc (hoặc AI) dễ dàng hiểu được cấu trúc tổng thể của dự án.

- **📤 Đầu ra tiện lợi:**
  - Kết hợp cây thư mục và nội dung của tất cả các tệp đã chọn vào một tệp `.txt` duy nhất.
  - Sẵn sàng để sao chép vào clipboard hoặc tải về máy tính.

- **🌐 Hỗ trợ đa ngôn ngữ:**
  - Giao diện có sẵn bằng cả tiếng Việt và tiếng Anh.

## 🎯 Các trường hợp sử dụng lý tưởng

- **Prompt cho AI/LLM:** Cung cấp toàn bộ ngữ cảnh mã nguồn cho các mô hình AI như Gemini, Claude, hoặc ChatGPT để nhận được sự trợ giúp chính xác hơn về gỡ lỗi, tái cấu trúc mã, viết tài liệu, hoặc học một codebase mới.
- **Đánh giá mã (Code Review):** Dễ dàng chia sẻ một bản "snapshot" sạch và đầy đủ của mã nguồn với đồng nghiệp để họ xem xét mà không cần phải clone toàn bộ repository.
- **Lưu trữ dự án:** Tạo một bản lưu trữ chỉ chứa mã nguồn của dự án tại một thời điểm nhất định, loại bỏ tất cả các tệp không cần thiết.
- **Giới thiệu thành viên mới:** Giúp thành viên mới nhanh chóng nắm bắt cấu trúc và các tệp chính của dự án.

## 🚀 Hướng dẫn sử dụng

1.  **Chọn Thư mục Dự án:** Nhấp vào nút "Chọn Thư mục Dự án" và chọn thư mục gốc của dự án trên máy tính của bạn.
2.  **Phân tích & Lọc tự động:** Công cụ sẽ đọc toàn bộ cấu trúc, phát hiện công nghệ, và tự động phân loại các tệp vào các danh sách phù hợp (bao gồm, loại trừ, nhạy cảm).
3.  **Xem lại & Tùy chỉnh:** Kiểm tra các danh sách và di chuyển các tệp nếu cần thiết để tinh chỉnh kết quả cuối cùng.
4.  **Xem trước & Tải về:**
    - Nếu dự án có kích thước hợp lý, một bản xem trước của tệp kết quả sẽ tự động được tạo.
    - Sao chép nội dung vào clipboard hoặc tải tệp `.txt` cuối cùng về máy. Đối với các dự án lớn, bạn có thể sử dụng nút "Kết hợp & Tải trực tiếp".

## 📸 Ảnh chụp màn hình

<div align="center">
  <img src="https://github.com/user-attachments/assets/40ac1936-e047-418f-a78b-cc7ed7f8c057" alt="Screenshot" width="800"/>
</div>

## 🛠️ Chạy dự án tại local

Để chạy ứng dụng này trên máy của bạn, hãy làm theo các bước sau:

**Yêu cầu:** Đã cài đặt [Node.js](https://nodejs.org/).

1.  **Clone repository:**
    ```bash
    git clone <URL_CUA_REPOSITORY_NAY>
    cd <TEN_THU_MUC_DU_AN>
    ```

2.  **Cài đặt các gói phụ thuộc:**
    Mở terminal trong thư mục dự án và chạy lệnh:
    ```bash
    npm install
    ```

3.  **Chạy máy chủ phát triển:**
    Sau khi cài đặt xong, chạy lệnh:
    ```bash
    npm run dev
    ```

4.  Mở trình duyệt và truy cập vào địa chỉ `http://localhost:5173` (hoặc cổng khác nếu được chỉ định trong terminal).

## 💻 Công nghệ sử dụng

- **Framework:** [React](https://react.dev/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)

## 🤝 Đóng góp

Mọi sự đóng góp đều được hoan nghênh! Nếu bạn có ý tưởng để cải thiện công cụ này, vui lòng tạo một "issue" để thảo luận hoặc một "pull request" với các thay đổi của bạn.

1.  Fork a repository.
2.  Tạo một branch mới (`git checkout -b feature/AmazingFeature`).
3.  Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên branch (`git push origin feature/AmazingFeature`).
5.  Mở một Pull Request.

## 📜 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT. Xem tệp `LICENSE` để biết thêm chi tiết.
