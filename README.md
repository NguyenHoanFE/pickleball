# 🏓 VN PICKLEBALL ACADEMY — HỆ THỐNG WEBSITE HỌC VIỆN ĐÀO TẠO PICKLEBALL CHUẨN QUỐC TẾ

[![React](https://img.shields.io/badge/React-19.x%20%2F%2018.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.x-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide%20React-F56565)](https://lucide.dev/)
[![Tests](https://img.shields.io/badge/Test%20Suite-36%2F36%20Passing-success)](file:///c:/Users/ducan/Downloads/Group_Project/Group_Project/2_Source_Code/test_roles_and_flows.js)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel%20SPA%20Ready-black?logo=vercel)](file:///c:/Users/ducan/Downloads/Group_Project/Group_Project/2_Source_Code/vercel.json)

> **Đồ án môn học:** Front-End Web Development with ReactJS (FER201 / FER202)  
> **Đơn vị phát triển:** Nhóm sinh viên chuyên ngành Kỹ thuật Phần mềm  
> **Đề tài:** Xây dựng Hệ sinh thái Website Đào tạo & Vận hành Học viện Pickleball Toàn diện  
> **Tương thích thiết bị (Responsive):** Tối ưu 100% trên Điện thoại di động (`320px` – `428px`), Máy tính bảng (`768px` – `1024px`) và Màn hình máy tính để bàn (`1280px+`).

---

## 📑 MỤC LỤC TÀI LIỆU (TABLE OF CONTENTS)

1. [Tổng quan Đề tài, Phân Tích Nghiệp Vụ (BA) & Lý Do Lựa Chọn Các Chức Năng](#1-tổng-quan-đề-tài-phân-tích-nghiệp-vụ-ba--lý-do-lựa-chọn-các-chức-năng)
2. [Cấu trúc Mã nguồn & Kiến trúc Component (Architecture)](#2-cấu-trúc-mã-nguồn--kiến-trúc-component-architecture)
3. [Bảng Phân Quyền & 11 Tài khoản Hệ thống (Root Credentials)](#3-bảng-phân-quyền--11-tài-khoản-hệ-thống-root-credentials)
4. [Các Phân Hệ Chức Năng Nổi Bật (Core Modules)](#4-các-phân-hệ-chức-năng-nổi-bật-core-modules)
   - [4.1. Không gian Quản trị Độc lập (Admin Portal)](#41-không-gian-quản-trị-độc-lập-admin-portal)
   - [4.2. Kênh Chuyên môn Huấn luyện viên (Coach Workspace)](#42-kênh-chuyên-môn-huấn-luyện-viên-coach-workspace)
   - [4.3. Cổng Học viên & Khách hàng (Student & Customer Portal)](#43-cổng-học-viên--khách-hàng-student--customer-portal)
5. [Hướng dẫn Cài đặt, Chạy Local & Kiểm thử Tự động (Testing Guide)](#5-hướng-dẫn-cài-đặt-chạy-local--kiểm-thử-tự-động-testing-guide)
6. [Hướng dẫn Triển khai Public lên Host Miễn phí (Vercel & Netlify)](#6-hướng-dẫn-triển-khai-public-lên-host-miễn-phí-vercel--netlify)

---

## 1. Tổng quan Đề tài, Phân Tích Nghiệp Vụ (BA) & Lý Do Lựa Chọn Các Chức Năng

### 1.1. Bối cảnh & Yêu cầu Đề tài Ban đầu
Theo yêu cầu tiêu chuẩn của đồ án môn học, hệ thống cần đáp ứng tối thiểu 4 trang cơ bản:
* **Trang chủ (`Home`):** Giới thiệu thông tin học viện và dịch vụ.
* **Khóa đào tạo (`Courses`):** Danh sách các khóa học Pickleball.
* **Đăng ký học (`Register`):** Biểu mẫu ghi danh khóa học.
* **Giới thiệu & Liên hệ (`About & Contact`):** Thông tin đơn vị và biểu mẫu phản hồi.

Tuy nhiên, dưới góc nhìn của **Chuyên viên Phân tích Nghiệp vụ (Business Analyst - BA)** khảo sát thị trường thể thao Pickleball bùng nổ tại Việt Nam, nhóm nhận thấy một học viện đào tạo chuyên nghiệp không thể vận hành hiệu quả nếu chỉ dừng lại ở các trang thông tin tĩnh. Một học viện thể thao muốn tồn tại và phát triển bền vững phải giải quyết được bài toán liên kết hữu cơ giữa **Học tập ↔ Luyện tập sân bãi ↔ Trang thiết bị dụng cụ ↔ Quản lý tiến độ đào tạo**.

Vì vậy, nhóm đã nghiên cứu và phát triển mô hình **Hệ sinh thái Đào tạo Khép Kín (All-in-One Pickleball Academy Platform)**:

```
                  ┌────────────────────────────────────────┐
                  │      VN PICKLEBALL ACADEMY ECOSYSTEM   │
                  └───────────────────┬────────────────────┘
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
┌──────────────┐              ┌──────────────┐              ┌──────────────┐
│  ĐÀO TẠO     │              │  CƠ SỞ VẬT   │              │  CỬA HÀNG    │
│  & DUPR      │              │  CHẤT SÂN    │              │  PRO SHOP    │
├──────────────┤              ├──────────────┤              ├──────────────┤
│• 8 Khóa học  │              │• 6 Cụm sân   │              │• Vợt JOOLA/  │
│• Phân bổ HLV │              │• Ma trận 8 ca│              │  Selkirk     │
│• Điểm danh B1│              │• Tự động giữ │              │• Bóng thi đấu│
│• Chấm điểm   │              │  sân tập lớp │• Giỏ hàng    │
│  DUPR skill  │              │• Thuê máy bắn│• VietQR/COD  │
└──────────────┘              └──────────────┘              └──────────────┘
```

---

### 1.2. Lý Do Lựa Chọn Các Chức Năng Nâng Cao (Tại sao lại làm thêm các chức năng này?)

Nhóm đã phân tích sâu hành vi người dùng (User Persona) của 3 đối tượng: **Học viên/Khách hàng**, **Huấn luyện viên** và **Ban Quản lý Học viện** để đưa ra quyết định phát triển 6 chức năng mở rộng thực tế:

#### 1. Hệ thống Đặt sân tập theo giờ (Real-time Court Booking & Sơ đồ Ma trận 6 sân × 8 ca)
* **Vấn đề thực tế:** Học viên sau mỗi buổi học với HLV luôn có nhu cầu thuê sân để tự luyện tập (Drilling) cùng bạn bè hoặc giao lưu đánh đôi (Social Play). Nếu học viện chỉ dạy học mà không cung cấp dịch vụ đặt sân, học viên buộc phải tìm kiếm và thuê sân của cụm sân khác $\rightarrow$ Vừa bất tiện cho học viên, vừa làm học viện thất thoát nguồn doanh thu khổng lồ từ việc khai thác sân bãi ngoài giờ học.
* **Lý do lựa chọn & Giá trị mang lại:**
  * Giúp học viện khai thác tối đa công suất 6 cụm sân cả ngày lẫn đêm (phân tách rõ Khung giờ thường và Khung giờ vàng Peak Hour).
  * Tích hợp dịch vụ giá trị gia tăng: Cho thuê máy bắn bóng tự động Titan Pro và vợt Carbon cao cấp.
  * Tự động áp dụng đặc quyền **Giảm giá 20% tiền thuê sân** cho học viên đang theo học, tạo động lực gắn bó lâu dài.

#### 2. Cửa hàng Dụng cụ Pickleball Chính hãng (Pro Shop & Giỏ hàng Live)
* **Vấn đề thực tế:** Trên 90% học viên mới bắt đầu chơi đều chưa sở hữu vợt riêng hoặc bối rối trước hàng trăm mẫu vợt trên thị trường (không biết chọn vợt độ dày lõi 14mm thiên về Lực hay 16mm thiên về Kiểm soát bóng, mặt sợi thủy tinh hay mặt Carbon T700). Họ thường có xu hướng tin tưởng và muốn mua các sản phẩm do chính HLV của học viện khuyên dùng.
* **Lý do lựa chọn & Giá trị mang lại:**
  * Cung cấp giải pháp trọn gói: Đăng ký học $\rightarrow$ Mua luôn vợt, bóng thi đấu Franklin X-40 và phụ kiện chính hãng USAPA ngay trên cùng một nền tảng.
  * Tích hợp Giỏ hàng tính tiền thời gian thực, hỗ trợ nhiều hình thức thanh toán tiện lợi (Chuyển khoản VietQR, COD hoặc Nhận hàng trực tiếp tại quầy lễ tân sân).

#### 3. Kênh Chuyên môn Huấn luyện viên (Coach Workspace, Điểm danh Chuyên cần & Đánh giá DUPR)
* **Vấn đề thực tế:** Các trang web thông thường chỉ dừng ở việc "nhận đơn đăng ký rồi để đó". Trong thực tế huấn luyện thể thao, yếu tố quyết định danh tiếng của học viện là **Chất lượng đào tạo và Sự tiến bộ đo lường được của học viên**.
* **Lý do lựa chọn & Giá trị mang lại:**
  * Cung cấp cho HLV công cụ xem lịch dạy tuần/ngày trực quan (Grid và Agenda).
  * Chức năng **Điểm danh chuyên cần theo buổi học thực tế:** Giúp giáo vụ theo dõi sát sao, chống thất thoát buổi học của học viên.
  * **Hệ thống Đánh giá DUPR chuẩn quốc tế:** HLV chấm điểm trình độ DUPR (2.0 – 5.0), đánh giá chi tiết 4 kỹ năng cốt lõi (Dink bóng trong Kitchen, Drop shot, Giao bóng & Bộ chân di chuyển) kèm nhận xét riêng cho từng học viên.

#### 4. Không Gian Quản Trị Độc Lập Toàn Màn Hình (Dedicated Admin Portal & 8 Phân Hệ CRUD)
* **Vấn đề thực tế:** Ban Giám đốc và Lễ tân cần một không gian quản trị tập trung (Back-office) độc lập, không hiển thị chung chạ với giao diện công khai của khách hàng.
* **Lý do lựa chọn & Giá trị mang lại:**
  * **Sơ đồ Ma trận Sân 6 Sân × 8 Khung giờ:** Lễ tân nhìn vào là thấy ngay ca nào trống, ca nào có lớp học, ca nào cần bảo trì; nhấp trực tiếp vào ô để tạo đặt sân nhanh cho khách vãng lai gọi điện đến đặt chỗ.
  * Toàn quyền cấu hình cụm sân, thời gian biểu, mở khóa học mới, phân công HLV và kiểm soát doanh thu tổng hợp.

#### 5. Thuật Toán Xếp Lịch Linh Hoạt & Phòng Ngừa Trùng Lịch (Conflict-Free Scheduling Engine)
* **Vấn đề thực tế:** Học viên có công việc và thời gian biểu khác nhau, không thể luôn bắt đầu học vào Thứ 2 đầu tuần. Nếu ép buộc bắt đầu từ đầu tuần sẽ làm giảm tỷ lệ đăng ký. Ngoài ra, việc xếp lịch thủ công rất dễ dẫn đến việc một HLV bị trùng 2 lớp cùng một giờ hoặc sân huấn luyện bị xếp chồng 2 nhóm học viên.
* **Lý do lựa chọn & Giá trị mang lại:**
  * Học viên được tự do chọn **Ngày bắt đầu học (`startDate`) bất kỳ**. Hệ thống tự động tính toán số buổi trong tuần để xác định chính xác **Ngày kết thúc dự kiến (`expectedEndDate`)**.
  * **Tự động giữ chỗ Sân Huấn Luyện #3** cho tất cả các buổi học của khóa.
  * Thuật toán kiểm tra giao thoa thời gian $\max(start_1, start_2) < \min(end_1, end_2)$ giúp cảnh báo và ngăn chặn trùng lịch dạy của HLV ngay từ lúc đăng ký.

#### 6. Cẩm Nang Kỹ Thuật, Luật Chơi & Đánh Giá Thực Tế (Knowledge Hub & Social Proof)
* **Vấn đề thực tế:** Pickleball là môn thể thao mới nổi tại Việt Nam, người mới tiếp cận thường chưa hiểu rõ luật Non-Volley Zone (Kitchen) hay quy tắc 2-Bounce Rule. Bên cạnh đó, người mới có tâm lý e ngại chưa biết học có tiến bộ không.
* **Lý do lựa chọn & Giá trị mang lại:**
  * Cung cấp cẩm nang luật chơi và video/bài viết hướng dẫn kỹ thuật giúp thu hút lượng truy cập tự nhiên (SEO).
  * Mục Đánh giá thực tế (Testimonials) hiển thị tiến bộ điểm DUPR thực tế của cựu học viên, tạo dựng niềm tin vững chắc (Social Proof) thúc đẩy người mới an tâm ghi danh.

---

## 2. Cấu trúc Mã nguồn & Kiến trúc Component (Architecture)

Toàn bộ dự án tuân thủ kiến trúc phân tầng Component-driven hiện đại, quản trị trạng thái tập trung qua Context API kết hợp bộ dữ liệu gốc `database.json` và đồng bộ `LocalStorage`:

```text
2_Source_Code/
├── public/
│   ├── favicon.svg                    # Logo biểu tượng vợt Pickleball
│   ├── icons.svg                      # Sprite Icons
│   └── index.html                     # HTML5 Shell, Google Fonts (Plus Jakarta Sans), SEO Meta
├── src/
│   ├── assets/                        # Hình ảnh Banner, minh họa sân bãi & trang thiết bị
│   ├── components/
│   │   ├── Header.jsx                 # Navigation đa vai trò, Giỏ hàng, Menu Mobile responsive
│   │   ├── HomeSection.jsx            # Trang chủ: Hero, Cơ sở vật chất 6 sân, 8 khóa học, Đội ngũ HLV
│   │   ├── CoursesSection.jsx         # Khóa học: Tìm kiếm, lọc cấp độ DUPR, modal giáo trình chi tiết
│   │   ├── RegisterSection.jsx        # Đăng ký khóa học: Chọn ngày bắt đầu, phát hiện trùng lịch, chống spam
│   │   ├── CourtBookingSection.jsx    # Đặt sân theo giờ: Sơ đồ sân, thuê vợt Carbon/máy bắn bóng, ưu đãi học viên
│   │   ├── ProShopSection.jsx         # Cửa hàng dụng cụ: Vợt thi đấu, bóng Franklin X-40, phụ kiện chính hãng
│   │   ├── BlogReviewsSection.jsx     # Cẩm nang kỹ thuật (Dink/Kitchen), gửi đánh giá học viên (Testimonials)
│   │   ├── AboutContactSection.jsx    # Lịch sử học viện, bản đồ Google Maps Iframe, form liên hệ
│   │   ├── AdminPortalSection.jsx     # [Role Admin] Không gian quản trị toàn màn hình: Ma trận sân, 8 phân hệ CRUD
│   │   ├── CoachPortalSection.jsx     # [Role Coach] Lịch dạy Grid/Agenda, Chấm chuyên cần theo ngày, Điểm DUPR
│   │   ├── UserProfileModal.jsx       # [Role Student] Hồ sơ cá nhân: Kế hoạch B1-BN, lịch đặt sân, đơn hàng
│   │   ├── CartDrawerModal.jsx        # Giỏ hàng: Cập nhật số lượng live, thanh toán VietQR/COD, chống spam đơn
│   │   ├── AuthModal.jsx              # Cửa sổ Đăng nhập / Đăng ký & Nút 1-Click Login nhanh
│   │   └── Footer.jsx                 # Chân trang, hotline giáo vụ, chứng chỉ USAPA/PPR
│   ├── context/
│   │   └── AuthContext.jsx            # Quản lý phiên làm việc, phân quyền RBAC, đồng bộ khóa tài khoản thời gian thực
│   ├── data/
│   │   ├── users.js                   # Danh mục 11 tài khoản định danh (Admin, 4 HLV, Học viên, Banned)
│   │   ├── courses.js                 # 8 Khóa học từ Nhập môn đến Thực chiến giải đấu
│   │   ├── courts.js                  # 6 Sân tập USAPA, 8 khung giờ, thuật toán xếp lịch và tránh trùng ca
│   │   ├── products.js                # Dụng cụ thể thao Pro Shop chuẩn chính hãng
│   │   └── blogs.js                   # Cẩm nang luật chơi & 5 hồ sơ ghi danh mẫu
│   ├── App.jsx                        # Component gốc điều phối Route Tab, State toàn cục và Guard bảo mật
│   ├── App.css                        # Hệ thống màu thương hiệu (Lime Green/Navy), Responsive 320px–428px
│   ├── index.css                      # Reset CSS & Typography
│   └── index.js                       # Điểm gắn kết React DOM
├── test_roles_and_flows.js            # [Test Suite] Bộ kịch bản kiểm thử tự động 36 ca kiểm thử
├── vercel.json                        # Cấu hình định tuyến SPA mượt mà trên nền tảng Vercel
├── database.json                      # Bản sao lưu trữ cấu trúc dữ liệu JSON
└── README.md                          # Tài liệu kỹ thuật dự án
```

---

## 3. Bảng Phân Quyền & 11 Tài khoản Hệ thống (Root Credentials)

Hệ thống tích hợp sẵn **11 tài khoản mẫu** đại diện cho đầy đủ các vai trò thực tế để giảng viên và người dùng kiểm thử ngay:

| STT | Vai trò (Role) | Họ tên hiển thị | Email đăng nhập | Mật khẩu | Trách nhiệm & Quyền hạn nghiệp vụ |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Root Admin** | Trần Quốc Bảo | `admin@pickleball.edu.vn` | `Admin@123` | **Toàn quyền Admin Portal:** Ma trận sân trống 6 sân $\times$ 8 ca, CRUD sân bãi, khóa/mở khung giờ, quản lý khóa học, kho Pro Shop & phân quyền tài khoản. |
| **2** | **Coach** | HLV Nguyễn Hoàng Nam | `coach@pickleball.edu.vn` | `Coach@123` | Phụ trách **Chiến thuật Nâng cao (3.5+)**, Tournament Bootcamp & Huấn luyện Doanh nghiệp. |
| **3** | **Coach** | HLV Sarah Jenkins | `sarah.coach@pickleball.edu.vn` | `Coach@123` | Phụ trách **Huấn luyện 1 Kèm 1 VIP (Private)** & Khóa Cấp tốc Cuối tuần. |
| **4** | **Coach** | HLV Vũ Minh Quân | `quan.coach@pickleball.edu.vn` | `Coach@123` | Phụ trách **Khối Cơ bản (Beginner Foundation 2.0 - 3.0)** & Nhập môn Pickleball. |
| **5** | **Coach** | HLV Lê Phương Thảo | `thao.coach@pickleball.edu.vn` | `Coach@123` | Phụ trách **Khối Thiếu nhi (Kids Junior Camp 6-15 tuổi)** & Pickleball Phái đẹp/Fitness. |
| **6** | **Student** | Lê Minh Anh | `student@pickleball.edu.vn` | `Student@123` | Học viên DUPR 3.25: Đã có sẵn lịch sử khóa học, phiếu đặt sân tập & đơn hàng Pro Shop. |
| **7** | **Student** | Phạm Gia Huy | `huy.pham@gmail.com` | `Student@123` | Học viên DUPR 3.60: Đang theo học lớp Chiến thuật Nâng cao. |
| **8** | **Student** | Nguyễn Minh Đức | `duc.nguyen@doanhnghiep.vn` | `Student@123` | Học viên DUPR 3.75: Đã hoàn thành khóa Thực chiến Giải đấu. |
| **9** | **Student** | Trần Thanh Tâm | `tam.tran@techcorp.vn` | `Student@123` | Học viên DUPR 2.80: Đang theo học lớp Pickleball Phái đẹp. |
| **10** | **Student** | Võ Hoàng Khang | `khang.vo@gmail.com` | `Student@123` | Học viên DUPR 2.40: Đang theo học khóa Huấn luyện 1 Kèm 1. |
| **11** | **Banned** | Đặng Văn Tùng | `tung.dang@spam.com` | `123456` | **Tài khoản bị khóa:** Dùng kiểm thử tính năng chặn đăng nhập vi phạm an toàn. |

> 💡 **Tính năng 1-Click Login:** Tại cửa sổ Đăng nhập, người dùng chỉ cần nhấn vào các nút tài khoản mẫu có sẵn để điền tự động Email và Mật khẩu mà không cần gõ phím thủ công.

---

## 4. Các Phân Hệ Chức Năng Nổi Bật (Core Modules)

### 4.1. Không gian Quản trị Độc lập (Admin Portal)
* **Giao diện làm việc chuyên biệt:** Tự động mở toàn màn hình khi Quản trị viên đăng nhập, trang bị thanh Sidebar gồm 8 phân hệ quản lý:
  1. **Sơ đồ Sân Trống theo Ngày/Giờ (`court-matrix`):** Ma trận trực quan 6 Sân $\times$ 8 Khung giờ. Nhấp vào ô bất kỳ để tạo đặt sân khách vãng lai, chuyển đổi ngày/giờ ca đặt, hoặc khóa sân bảo trì.
  2. **Quản lý Cụm Sân (`courts-crud`):** Thêm mới sân, cập nhật bảng giá thường/giờ cao điểm, bật tắt chế độ bảo trì.
  3. **Quản lý Khung Giờ (`slots-crud`):** Thêm/sửa/xóa ca giờ hoạt động, đánh dấu ca Peak Hour (Giờ vàng).
  4. **Quản lý Khóa Học (`courses`):** Tạo khóa học mới, cập nhật học phí, chỉnh sửa giáo trình đào tạo. Có cơ chế **chặn xóa khóa học đang có học viên theo học**.
  5. **Quản lý Hồ Sơ Ghi Danh (`enrollments`):** Tiếp nhận đơn đăng ký trực tuyến, phân công Huấn luyện viên phụ trách trực tiếp qua dropdown.
  6. **Quản lý Kho Hàng Pro Shop (`shop-products`):** Thêm dụng cụ, điều chỉnh tồn kho và giá bán.
  7. **Quản lý Phân Quyền & Tài Khoản (`users`):** Chuyển đổi vai trò `Student` $\leftrightarrow$ `Coach` $\leftrightarrow$ `Admin`, khóa/mở khóa tài khoản ngay lập tức.
  8. **Hộp Thư Liên Hệ (`contacts`):** Tiếp nhận câu hỏi và phản hồi của khách hàng.

### 4.2. Kênh Chuyên môn Huấn luyện viên (Coach Workspace)
* **Lịch Đứng Lớp Giảng Dạy Đa Chiều (Tương lai & Quá khứ):** HLV dễ dàng theo dõi toàn bộ hành trình giảng dạy qua 3 chế độ xem trực quan:
  * *Chế độ Dòng Thời Gian (Timeline View):* Hiển thị chi tiết từng buổi học cụ thể theo Ngày - Tháng - Năm (Date), tự động phân định:
    * 🔮 **Lịch Tương Lai / Sắp tới:** Các buổi học sắp diễn ra từ ngày mai trở đi (kèm tính năng đếm ngược số ngày).
    * ⚡ **Hôm Nay:** Các ca dạy cần đứng lớp ngay trong ngày hôm nay.
    * 📜 **Lịch Sử / Quá Khứ:** Toàn bộ các buổi học đã diễn ra trong quá khứ để HLV tra cứu tiến độ, điểm danh và đánh giá kỹ thuật.
  * *Chế độ Lưới Tuần (Weekly Grid):* Trực quan hóa thời khóa biểu cố định 7 ngày trong tuần (Thứ 2 đến Chủ Nhật).
  * *Chế độ Bảng Danh Sách (Agenda View):* Bảng dữ liệu chi tiết theo từng ca học với đầy đủ thông tin sân tập, mã học viên và giờ dạy.
* **Bộ Lọc Thời Gian Linh Hoạt (Time Horizon Filters):** Cho phép HLV chuyển đổi 1-click giữa `🌟 Tất cả`, `🔮 Lịch Tương Lai`, `⚡ Hôm Nay` và `📜 Quá Khứ / Lịch Sử`.
* **Quyền Hạn Điểm Danh Chuẩn Xác (Strict Coach Guard):**
  * HLV chỉ được điểm danh học viên thuộc lớp mình phụ trách.
  * Lớp do HLV khác phụ trách hiển thị nhãn `🔒 HLV khác phụ trách`.
  * Hồ sơ chưa được xếp giáo viên hiển thị nhãn `🔒 Chưa phân công HLV`.
* **Form Điểm Danh Tối Giản & Đánh Giá DUPR:**
  * Chỉ điểm danh buổi học hiện tại (`Có mặt` / `Vắng mặt`), tự động tính số buổi còn lại.
  * Chấm điểm xếp hạng DUPR (2.0 – 5.0).
  * Đánh giá 4 kỹ năng cốt lõi: Kỹ thuật Dink bóng, Kỹ thuật Drop shot (Thả bóng vào Kitchen), Giao bóng & Cú đánh thứ 3, Bộ chân di chuyển (Footwork).
  * Nhận xét chuyên môn gửi riêng cho học viên.

### 4.3. Cổng Học viên & Khách hàng (Student & Customer Portal)
* **Đăng ký Khóa học Nhanh chóng:** Tự do chọn ngày bắt đầu, hệ thống tự động tính ngày kết thúc, kiểm tra chống trùng lịch và tự động phân bổ Sân Huấn Luyện #3.
* **Hồ Sơ Cá Nhân (`UserProfileModal`):**
  * Thẻ tổng quan khóa học: Ngày bắt đầu $\rightarrow$ Ngày kết thúc dự kiến.
  * Bảng chi tiết kế hoạch từng buổi học (Buổi 1 đến Buổi $N$) với ngày dương lịch, thứ trong tuần, sân tập và huy hiệu trạng thái điểm danh.
  * Quản lý phiếu đặt sân theo giờ (hỗ trợ bấm Hủy lịch tức thì).
  * Lịch sử đơn hàng dụng cụ Pro Shop.
* **Đặt Sân Tập Tự Động:** Chọn ngày, chọn sân, chọn khung giờ trống, tích hợp tùy chọn mượn vợt tập và máy bắn bóng tự động. Giảm giá 20% cho học viên đang theo học.
* **Pro Shop & Giỏ Hàng:** Mua sắm dụng cụ chính hãng, giỏ hàng tự động cập nhật số lượng và tổng tiền theo thời gian thực, có chế độ chống bấm đúp khi thanh toán.

---

## 5. Hướng dẫn Cài đặt, Chạy Local & Kiểm thử Tự động (Testing Guide)

### 5.1. Yêu cầu môi trường
* **Node.js:** Phiên bản `>= 18.x` (Khuyến nghị bản LTS)
* **Trình quản lý gói:** `npm` (đi kèm Node.js) và `Git`

### 5.2. Cài đặt và Chạy máy chủ Local
```bash
# 1. Di chuyển vào thư mục mã nguồn
cd Group_Project/2_Source_Code

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Khởi chạy ứng dụng ở môi trường Development
npm start
```
* Trình duyệt sẽ tự động mở trang web tại địa chỉ: **`http://localhost:3000`**

### 5.3. Đóng gói Bản Build Kiểm thử
```bash
npm run build
```
* Mã nguồn sẽ được biên dịch tối ưu hóa vào thư mục `build/` với kết quả `Compiled successfully`.

### 5.4. Chạy Bộ Kiểm Thử Tự Động (Automated Regression Test Suite)
Dự án được trang bị sẵn script kiểm thử tự động toàn diện [test_roles_and_flows.js](file:///c:/Users/ducan/Downloads/Group_Project/Group_Project/2_Source_Code/test_roles_and_flows.js):
```bash
node test_roles_and_flows.js
```
**Kết quả kiểm thử đạt 50/50 tests:**
```text
================================================================
🧪 BẮT ĐẦU KIỂM THỬ TỪNG ROLE & CÁC LUỒNG NGHIỆP VỤ HỆ THỐNG
================================================================
✓ Đã nạp thành công: 11 tài khoản, 5 hồ sơ ghi danh, 5 lịch đặt sân.

▶ [TEST SUITE 1] ROLE ADMIN (Trần Quốc Bảo)          -> 5/5 PASS
▶ [TEST SUITE 2] ROLE COACH (4 HLV Chuyên Môn)       -> 21/21 PASS (Gồm xem Lịch Tương Lai & Quá Khứ)
▶ [TEST SUITE 3] ROLE STUDENT (Lê Minh Anh)          -> 11/11 PASS
▶ [TEST SUITE 4] ROLE BANNED ACCOUNT (Đặng Văn Tùng) -> 3/3 PASS
▶ [TEST SUITE 5] ĐĂNG XUẤT & XÓA PHIÊN               -> 2/2 PASS
================================================================
📊 TỔNG KẾT: 50 KIỂM THỬ THÀNH CÔNG, 0 THẤT BÀI (100% PASS).
```

---

## 6. Hướng dẫn Triển khai Public lên Host Miễn phí (Vercel & Netlify)

Để sản phẩm có đường link công khai truy cập từ bất kỳ đâu:

### Cách 1: Triển khai qua Vercel + GitHub (Khuyến nghị số 1)
1. **Đẩy mã nguồn lên GitHub:**
   ```bash
   cd Group_Project/2_Source_Code
   git init
   git add .
   git commit -m "feat: release VN Pickleball Academy full system"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/pickleball-academy.git
   git push -u origin main
   ```
2. **Đăng nhập Vercel:** Truy cập [https://vercel.com/](https://vercel.com/), chọn **Continue with GitHub**.
3. **Thêm Dự án mới:** Nhấn **Add New...** ➔ **Project** ➔ Chọn **Import** repository vừa đẩy lên.
4. **Cấu hình Build Settings:**
   * **Framework Preset:** `Create React App` (Vercel tự động nhận diện).
   * **Root Directory:** `./` (nếu đẩy từ `2_Source_Code`) hoặc chọn `Group_Project/2_Source_Code`.
   * **Build Command:** `npm run build`
   * **Output Directory:** `build`
   * File [vercel.json](file:///c:/Users/ducan/Downloads/Group_Project/Group_Project/2_Source_Code/vercel.json) đã được thiết lập sẵn quy tắc SPA rewrite để không bị lỗi 404 khi người dùng tải lại trang.
5. **Nhấn Deploy:** Sau khoảng 1 phút, bạn sẽ nhận được đường link website chính thức dạng:
   $$\text{https://<ten-du-an>.vercel.app}$$

### Cách 2: Triển khai qua Netlify Drop (Có Link trong 30 giây)
1. Chạy lệnh: `npm run build` tại thư mục `2_Source_Code`.
2. Mở trình duyệt vào [https://app.netlify.com/drop](https://app.netlify.com/drop).
3. Kéo thả trực tiếp thư mục `build/` vào khung upload của Netlify.
4. Nhận ngay domain miễn phí dạng `https://<ten-ngau-nhien>.netlify.app`.

---

## 👥 THÀNH VIÊN NHÓM THỰC HIỆN ĐỒ ÁN
* **Đề tài:** Hệ thống Website Học viện Đào tạo Pickleball (VN Pickleball Academy)
* **Giảng viên hướng dẫn:** Bộ môn Phát triển Ứng dụng Web Front-End (FER201/FER202)
* **Năm thực hiện:** 2026

*Chúc các bạn trải nghiệm và đánh giá hệ thống thành công tốt đẹp!* 🏓
