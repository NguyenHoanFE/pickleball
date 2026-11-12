# 3. ROOT CREDENTIALS (TÀI KHOẢN QUẢN TRỊ & HỆ THỐNG)
**Dự án:** Website Học Viện Đào Tạo Pickleball (VN Pickleball Academy)

---

## A. THÔNG TIN TÀI KHOẢN QUẢN TRỊ TỐI CAO (ROOT ADMIN)

- **Cách đăng nhập:** Nhấn nút **"Đăng nhập"** ở góc trên bên phải thanh Header và nhập thông tin tài khoản Quản trị viên dưới đây.
- **Email Quản trị (Root Admin):** `admin@pickleball.edu.vn`
- **Mật khẩu (Password):** `Admin@123`
- **Họ tên Quản trị viên:** Trần Quốc Bảo (*Giám Đốc Học Viện*)
- **Đặc quyền Giao diện Quản trị riêng biệt (`AdminPortalSection`):**
  - Ngay sau khi đăng nhập, hệ thống tự động mở **Giao diện Quản trị Học viện (Admin Portal)** toàn màn hình với thanh Sidebar điều hướng bên trái (tách biệt hoàn toàn với giao diện khách hàng và không hiển thị nút Kênh HLV).
  - **Sơ đồ Sân trống & CRUD Ngày Giờ (`court-matrix`):** Xem ma trận trực quan `[6 Sân × 8 Khung giờ]` theo từng ngày bất kỳ; nhấn trực tiếp vào từng ô để tạo đặt sân cho khách vãng lai, khóa ca giờ hoặc mở khóa/giải phóng sân trống; chỉnh sửa chi tiết Ngày, Giờ, Sân tập của từng phiếu đặt sân.
  - **Cấu hình Cụm sân (`courts-crud`) & Quản lý Khung giờ (`slots-crud`):** Thêm/Sửa/Xóa sân tập, điều chỉnh giá giờ thường/giờ vàng, bật/tắt bảo trì sân và thêm/sửa/xóa các ca giờ hoạt động trong ngày.
  - **Quản lý Khóa học, Học viên, Pro Shop, Phân quyền Tài khoản & Hộp thư Liên hệ:** Toàn quyền thêm/sửa/xóa dữ liệu trên toàn hệ thống.

---

## B. BẢNG TỔNG HỢP 11 TÀI KHOẢN THEO VAI TRÒ TRONG DATABASE (`users.js` & `database.json`)

| STT | Vai trò (Role) | Họ tên hiển thị | Email đăng nhập | Mật khẩu | Trạng thái & Quyền hạn chính |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Admin (Quản trị viên)** | Trần Quốc Bảo | `admin@pickleball.edu.vn` | `Admin@123` | **Active** • Toàn quyền Admin Portal (Ma trận sân trống ngày/giờ, cụm sân, khung giờ, khóa học, Pro Shop, phân quyền). |
| 2 | **Coach (Huấn luyện viên)** | HLV Nguyễn Hoàng Nam | `coach@pickleball.edu.vn` | `Coach@123` | **Active** • Truy cập **Kênh HLV**: Chấm chuyên cần, chấm điểm trình độ DUPR, nhận xét học viên & sửa giáo trình. |
| 3 | **Coach (Huấn luyện viên)** | HLV Sarah Jenkins | `sarah.coach@pickleball.edu.vn` | `Coach@123` | **Active** • Phụ trách lớp Huấn luyện 1 Kèm 1 (VIP Private) & Khóa Cấp tốc Cuối tuần. |
| 4 | **Coach (Huấn luyện viên)** | HLV Vũ Minh Quân | `quan.coach@pickleball.edu.vn` | `Coach@123` | **Active** • Phụ trách khối Cơ bản (Beginner Foundation 2.0 - 3.0). |
| 5 | **Coach (Huấn luyện viên)** | HLV Lê Phương Thảo | `thao.coach@pickleball.edu.vn` | `Coach@123` | **Active** • Phụ trách khối Thiếu nhi (Kids Junior Camp 6-15 tuổi). |
| 6 | **Student (Học viên)** | Lê Minh Anh | `student@pickleball.edu.vn` | `Student@123` | **Active** • Học viên DUPR 3.25: Có sẵn lịch sử khóa học, phiếu đặt sân tập & đơn hàng Pro Shop. |
| 7 | **Student (Học viên)** | Phạm Gia Huy | `huy.pham@gmail.com` | `Student@123` | **Active** • Học viên DUPR 3.60: Đang theo học lớp Chiến thuật Nâng cao. |
| 8 | **Student (Học viên)** | Nguyễn Minh Đức | `duc.nguyen@doanhnghiep.vn` | `Student@123` | **Active** • Học viên DUPR 3.75: Đã hoàn thành khóa Thực chiến Giải đấu. |
| 9 | **Student (Học viên)** | Trần Thanh Tâm | `tam.tran@techcorp.vn` | `Student@123` | **Active** • Học viên DUPR 2.80: Đang theo học lớp Pickleball Phái đẹp. |
| 10 | **Student (Học viên)** | Võ Hoàng Khang | `khang.vo@gmail.com` | `Student@123` | **Active** • Học viên DUPR 2.40: Đang theo học khóa 1 Kèm 1. |
| 11 | **Banned (Tài khoản khóa)** | Đặng Văn Tùng | `tung.dang@spam.com` | `123456` | **Banned** • Tài khoản bị khóa dùng để kiểm thử tính năng chặn đăng nhập vi phạm. |
