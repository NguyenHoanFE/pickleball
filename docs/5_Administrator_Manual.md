# 5. ADMINISTRATOR MANUAL (HƯỚNG DẪN QUẢN TRỊ HỆ THỐNG)
**Dự án:** Website Học Viện Đào Tạo Pickleball (VN Pickleball Academy)

---

## 1. ĐĂNG NHẬP VÀ GIAO DIỆN QUẢN TRỊ RIÊNG BIỆT (`AdminPortalSection`)

- **Bước 1:** Nhấn nút **"Đăng nhập"** trên thanh Header.
- **Bước 2:** Nhập Email Quản trị viên: `admin@pickleball.edu.vn` và Mật khẩu: `Admin@123`.
- **Bước 3:** Ngay sau khi đăng nhập với vai trò `Admin`, hệ thống tự động chuyển vào **Giao Diện Quản Trị Học Viện (Admin Workspace)** toàn màn hình độc lập:
  - Gồm **Thanh điều hướng Sidebar cố định bên trái** (hiển thị 8 phân hệ quản trị chuyên biệt, hoàn toàn tách biệt với giao diện khách hàng và không hiển thị nút Kênh HLV).
  - Khu vực bên phải hiển thị **4 thẻ chỉ số KPI thời gian thực** (*Trạng thái cụm sân & doanh thu sân*, *Đào tạo & doanh thu học phí*, *Kho Pro Shop & đơn hàng*, *Tổng doanh thu toàn Học viện*) cùng không gian thao tác CRUD chi tiết.
  - Khi cần xem trang công khai của khách hàng, Admin nhấn nút **"Xem Giao Diện Khách Hàng"** ở cuối thanh Sidebar trái (và nhấn nút **"Về Trang Quản Trị"** trên Header để quay lại Admin Portal bất cứ lúc nào).

---

## 2. SƠ ĐỒ SÂN TRỐNG & CRUD NGÀY GIỜ (`📅 Sơ Đồ Trống & CRUD Ngày Giờ`)

Đây là phân hệ trung tâm giúp Admin quản lý chi tiết từng sân trống theo ngày và khung giờ cụ thể:
- **Chọn ngày kiểm soát (`Chọn ngày quản lý`):** Chọn bất kỳ ngày nào trên lịch Date Picker để xem trạng thái thực tế của toàn bộ cụm sân trong ngày đó.
- **Bảng Ma trận trực quan `[6 Sân Tập × 8 Khung Giờ]`:**
  - Ô màu xanh lá **`+ Sân Trống`**: Khung giờ đang trống, khách có thể đặt hoặc Admin có thể thao tác.
  - Ô màu xanh dương **`✓ Đã Đặt`**: Hiển thị rõ tên khách hàng và số điện thoại đã đặt ca đó.
  - Ô màu đỏ **`🔒 Đã Khóa Ca`**: Khung giờ đã bị Admin khóa tạm thời (để bảo dưỡng mặt sân, tổ chức sự kiện hoặc giữ sân cho lớp học).
  - Ô màu vàng **`🔧 Bảo trì`**: Toàn bộ sân đang trong trạng thái bảo trì.
- **Thao tác trực tiếp khi nhấn vào 1 ô `(Sân + Ngày + Khung giờ)` trên Ma trận:**
  - **Nếu ô đang là Sân Trống:** Mở bảng thao tác nhanh bên dưới ma trận cho phép Admin:
    1. Điền Họ tên & Số điện thoại khách để **Tạo Đặt Sân Trực Tiếp (Walk-in Booking)** vào đúng ngày và khung giờ đó.
    2. Hoặc nhấn nút **"🔒 Khóa Ca Giờ Này"** kèm ghi chú lý do để khóa ngay khung giờ đó (khách hàng bên ngoài sẽ thấy ca này báo *Đã kín* và không thể đặt).
  - **Nếu ô Đã Đặt hoặc Đã Khóa:** Mở bảng chi tiết cho phép Admin:
    1. **Chỉnh sửa trực tiếp (Update CRUD):** Đổi sang **Sân khác**, đổi **Ngày đặt (`YYYY-MM-DD`)**, đổi **Khung giờ (`Time Slot`)**, sửa tên/SĐT khách hàng hoặc đổi trạng thái phiếu.
    2. **Hủy / Mở trống lại sân (Delete):** Nhấn nút **"Hủy / Mở Trống Lại Sân"** để giải phóng ca giờ đó về trạng thái **`+ Sân Trống`** ngay lập tức.
- **Bảng Danh Sách & CRUD Toàn Bộ Lịch Đặt Sân / Khóa Ca:**
  - Nằm ngay phía dưới ma trận, liệt kê toàn bộ các phiếu đặt sân và ca khóa trên hệ thống kèm nút **Sửa** và **Xóa** nhanh.

---

## 3. CẤU HÌNH CỤM SÂN (`🏟️ Cấu Hình Cụm Sân - Courts CRUD`)
- **Thêm sân tập mới (Create):** Điền biểu mẫu *"Thêm Sân Tập Mới"* (Tên sân, Loại sân Indoor VIP / Mái che, Mặt sân, Hệ thống đèn, Đơn giá giờ thường, Đơn giá giờ vàng, Tiện ích) để mở thêm sân mới.
- **Sửa thông tin sân (Update):** Nhấn nút biểu tượng cây bút trên thẻ sân để chỉnh sửa tên sân, loại sân, mặt sân và cập nhật bảng giá thuê giờ thường / giờ vàng.
- **Bật / Tắt Bảo trì & Xóa sân (Delete):** Nhấn nút **"Tạm bảo trì"** (hoặc **"Mở hoạt động"**) để đóng/mở toàn bộ một sân tập, hoặc nhấn biểu tượng thùng rác để xóa sân.

---

## 4. QUẢN LÝ KHUNG GIỜ HOẠT ĐỘNG (`⏰ Quản Lý Khung Giờ - Time Slots CRUD`)
- **Thêm khung giờ mới (Create):** Nhập khoảng thời gian (ví dụ: `22:00 - 23:30`), nhãn ca (ví dụ: *Ca Đêm Tăng Cường*) và chọn loại ca (*Giờ thường* hoặc *Giờ vàng Peak Hour*).
- **Sửa / Xóa khung giờ (Update / Delete):** Chỉnh sửa giờ bắt đầu - kết thúc, tên ca, bật/tắt tính giá Giờ vàng hoặc xóa khung giờ. Mọi thay đổi đều tự động đồng bộ sang Sơ đồ sân trống và trang Đặt sân của học viên.

---

## 5. QUẢN LÝ KHÓA HỌC & HỒ SƠ HỌC VIÊN (`📚 Quản Lý Khóa Học` & `🎓 Hồ Sơ Học Viên`)
- **Quản lý Khóa học (`courses`):** Xem danh sách 8 khóa đào tạo hiện hành, mở thêm khóa học mới (chọn danh mục, học phí, thời lượng, lịch học, HLV phụ trách) hoặc xóa khóa học.
- **Hồ sơ Học viên (`enrollments`):** Theo dõi toàn bộ phiếu đăng ký khóa học của học viên, xem tiến độ điểm danh & đánh giá DUPR từ HLV, duyệt trạng thái hồ sơ (*Chờ duyệt*, *Đã xác nhận*, *Hoàn thành*, *Đã hủy*) hoặc xóa hồ sơ.

---

## 6. QUẢN LÝ PRO SHOP, TÀI KHOẢN & HỘP THƯ (`🛒 Kho Pro Shop`, `👥 Tài Khoản`, `✉️ Hộp Thư`)
- **Kho Pro Shop & Đơn hàng (`shop`):**
  - Theo dõi và cập nhật trạng thái đơn đặt hàng dụng cụ (*Chờ xử lý*, *Đang giao*, *Đã giao*, *Đã hủy*).
  - Thêm sản phẩm mới vào Pro Shop (vợt, bóng, giày, phụ kiện) hoặc xóa sản phẩm.
- **Tài khoản & Phân quyền (`users`):**
  - Tìm kiếm thành viên theo tên, email hoặc số điện thoại.
  - **Phân quyền (Change Role):** Chuyển đổi vai trò của tài khoản giữa `Học viên (student)` ↔ `Huấn luyện viên (coach)` ↔ `Quản trị viên (admin)`.
  - **Khóa / Mở khóa (Lock / Unlock):** Khóa tài khoản vi phạm sang trạng thái `Banned` (chặn đăng nhập) hoặc mở khóa lại trạng thái `Active`.
- **Hộp thư Liên hệ (`contacts`):** Xem nội dung câu hỏi tư vấn, yêu cầu đặt giải đấu doanh nghiệp từ khách hàng và đánh dấu trạng thái *"Đã phản hồi"*.
