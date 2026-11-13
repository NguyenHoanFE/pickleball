# 1. INSTALLATION & DEPLOYMENT GUIDE (HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI)

**Đồ án:** Website Học Viện Đào Tạo Pickleball & Đặt Sân Tự Động (VN Pickleball Academy)  
**Môn học:** Lập trình Web với ReactJS (FER202 / Web Frontend)  
**Công nghệ:** ReactJS 18.3.1, Bootstrap 5.3.3, React-Bootstrap 2.10.4, Lucide React Icons, Context API & LocalStorage Architecture  
**Đường link Website đã triển khai (Live Production):** [https://pickleball-academy-roan.vercel.app](https://pickleball-academy-roan.vercel.app)  
**Kho mã nguồn (GitHub Repository):** [https://github.com/ducanh30vip/pickleball-academy](https://github.com/ducanh30vip/pickleball-academy)  

---

## A. YÊU CẦU MÔI TRƯỜNG HỆ THỐNG (PREREQUISITES)

Để cài đặt và vận hành hệ thống một cách tối ưu, máy tính cần đáp ứng các tiêu chuẩn sau:

- **Node.js:** Phiên bản `>= 18.x` (Khuyến nghị các bản LTS ổn định: Node.js 18.x, 20.x, hoặc 22.x/24.x).
- **Trình quản lý gói (Package Manager):** `npm` phiên bản `>= 9.x` (được tích hợp sẵn khi cài đặt Node.js).
- **Git:** Dùng để clone mã nguồn, quản lý phiên bản và đồng bộ CI/CD lên GitHub & Vercel.
- **Trình duyệt web hiện đại:** Google Chrome, Microsoft Edge, Mozilla Firefox hoặc Safari (hỗ trợ đầy đủ chuẩn ES6+ và LocalStorage).

---

## B. CẤU TRÚC THƯ MỤC DỰ ÁN

Toàn bộ gói đồ án nộp bài được tổ chức khoa học theo chuẩn đồ án môn học:

```text
Group_Project/
├── 1_Installation_and_Deployment_Guide.md   # [File này] Hướng dẫn cài đặt, chạy local & triển khai cloud
├── 3_Root_Credentials.md                    # Danh sách 11 tài khoản theo 3 Roles (Admin, Coach, Student, Banned)
├── 4_End_User_Manual.md                     # Cẩm nang hướng dẫn sử dụng dành cho Học viên, Khách hàng & HLV
├── 5_Administrator_Manual.md                # Cẩm nang hướng dẫn vận hành chuyên sâu cho Quản trị viên (Admin)
└── 2_Source_Code/                           # Toàn bộ mã nguồn ReactJS của hệ thống
    ├── build/                               # Bản đóng gói Production tối ưu (tạo sau khi chạy npm run build)
    ├── public/                              # Tài nguyên tĩnh, index.html, favicon, SEO manifest
    ├── src/
    │   ├── components/                      # Toàn bộ các phân hệ giao diện người dùng
    │   │   ├── AdminPortalSection.jsx       # Giao diện Quản trị viên (Sơ đồ sân ngày/giờ, Quản lý tiến độ học, CRUD)
    │   │   ├── CoachPortalSection.jsx       # Giao diện Huấn luyện viên (Thời khóa biểu, Chấm chuyên cần, DUPR)
    │   │   ├── RegisterSection.jsx          # Đăng ký khóa học, chọn HLV, chọn giữ sân tự động
    │   │   ├── CourtBookingSection.jsx      # Đặt sân tự do theo giờ, chống xung đột lịch lớp học
    │   │   ├── CartDrawerModal.jsx          # Giỏ hàng Pro Shop (Tính tổng tiền tức thì, chống spam đơn hàng)
    │   │   ├── Header.jsx & Footer.jsx      # Thanh điều hướng và chân trang hệ thống
    │   │   ├── HomeSection.jsx              # Trang chủ giới thiệu Học viện
    │   │   ├── CoursesSection.jsx           # Tra cứu, tìm kiếm, lọc 8 khóa học & xem giáo trình
    │   │   ├── ProShopSection.jsx           # Cửa hàng dụng cụ vợt, bóng, phụ kiện chính hãng
    │   │   ├── BlogReviewsSection.jsx       # Bài viết kiến thức chuyên sâu & đánh giá học viên
    │   │   ├── AboutContactSection.jsx      # Giới thiệu cơ sở vật chất & form liên hệ
    │   │   ├── AuthModal.jsx                # Modal Đăng nhập / Đăng ký phân quyền
    │   │   └── UserProfileModal.jsx         # Sổ điểm danh, DUPR & hồ sơ cá nhân học viên
    │   ├── context/
    │   │   └── AuthContext.jsx              # Quản lý phiên đăng nhập, phân quyền 3 roles và xác thực người dùng
    │   ├── data/                            # Bộ dữ liệu mẫu ban đầu (users, courses, courts, products, blogs)
    │   ├── App.jsx & index.js               # Điểm khởi chạy chính của ứng dụng
    │   └── index.css                        # Tùy biến phong cách giao diện Academy hiện đại
    ├── database.json                        # Cơ sở dữ liệu mẫu dự phòng JSON
    ├── package.json                         # Khai báo thư viện phụ thuộc và scripts thực thi
    ├── test_roles_and_flows.js              # Script kiểm thử tự động 63/63 kịch bản nghiệp vụ (PASS 100%)
    └── vercel.json                          # Cấu hình định tuyến SPA Rewrites (chống lỗi 404 khi reload trang)
```

---

## C. HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL (LOCAL DEVELOPMENT)

Thực hiện lần lượt các bước sau trên máy tính để khởi chạy dự án:

### Bước 1: Mở Terminal và di chuyển vào thư mục mã nguồn
Mở phần mềm dòng lệnh (PowerShell, Command Prompt, Git Bash trên Windows hoặc Terminal trên macOS/Linux) và trỏ vào thư mục `2_Source_Code`:

```bash
cd Group_Project/2_Source_Code
```

*(Nếu bạn đang mở sẵn Terminal ngay tại thư mục `2_Source_Code`, có thể bỏ qua lệnh `cd` trên).*

### Bước 2: Cài đặt các gói thư viện (Dependencies)
Chạy lệnh sau để tải và cài đặt toàn bộ các thư viện cần thiết (`react`, `bootstrap`, `react-bootstrap`, `lucide-react`,...):

```bash
npm install
```

> **Lưu ý:** Nếu gặp cảnh báo phiên bản peer dependencies trên các môi trường Node đặc thù, bạn có thể chạy:
> ```bash
> npm install --legacy-peer-deps
> ```

### Bước 3: Khởi chạy môi trường phát triển (Development Server)
Chạy lệnh:

```bash
npm start
```

- Hệ thống sẽ biên dịch mã nguồn và tự động mở trình duyệt web tại địa chỉ:  
  **`http://localhost:3000`**
- Nếu cổng `3000` đang bị ứng dụng khác chiếm dụng, Terminal sẽ hỏi `Would you like to run the app on another port instead? (Y/n)`. Bạn gõ `Y` và nhấn Enter để chuyển sang cổng `3001`.

---

## D. HƯỚNG DẪN CHẠY BỘ KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITE)

Dự án đã tích hợp sẵn kịch bản kiểm thử độc lập kiểm tra toàn bộ các nghiệp vụ quan trọng (Xác thực 3 Roles, Chống trùng lịch HLV, Tự động giữ sân theo khóa học, Kiểm tra tiến độ học viên của Admin, Chống spam giỏ hàng, Khóa tài khoản vi phạm,...).

Để chạy bộ kiểm thử, tại thư mục `2_Source_Code`, thực hiện lệnh:

```bash
node test_roles_and_flows.js
```

**Kết quả mong đợi:**
```text
================================================================
📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ: 63 KIỂM THỬ THÀNH CÔNG, 0 THẤT BÀI.
🎉 TẤT CẢ CÁC LUỒNG VAI TRÒ & NGHIỆP VỤ BẢO VỆ HOẠT ĐỘNG HOÀN HẢO 100%!
================================================================
```

---

## E. HƯỚNG DẪN BIÊN DỊCH BẢN PRODUCTION (BUILD APPLICATION)

Để kiểm tra chất lượng mã nguồn trước khi triển khai hoặc chuẩn bị gói nộp bài:

```bash
npm run build
```

- Hệ thống sẽ tối ưu hóa toàn bộ mã JavaScript, CSS và nén dung lượng, xuất kết quả vào thư mục `build/`.
- Bản build này hoàn toàn độc lập và sẵn sàng để deploy lên bất kỳ dịch vụ lưu trữ web tĩnh nào.

---

## F. HƯỚNG DẪN TRIỂN KHAI LÊN CLOUD (DEPLOYMENT GUIDE)

### PHƯƠNG ÁN 1: TRIỂN KHAI QUA VERCEL (KHUYẾN NGHỊ CHÍNH - ĐÃ TRIỂN KHAI THỰC TẾ)

Dự án hiện đã được triển khai hoạt động ổn định trên Vercel tại địa chỉ:  
👉 **[https://pickleball-academy-roan.vercel.app](https://pickleball-academy-roan.vercel.app)**

Nếu bạn muốn tự triển khai lại từ tài khoản Vercel cá nhân:

#### Bước 1: Đẩy mã nguồn lên GitHub cá nhân
1. Tại thư mục `2_Source_Code`:
   ```bash
   git init
   git add .
   git commit -m "feat: deploy VN Pickleball Academy"
   git branch -M main
   ```
2. Tạo Repository mới trên GitHub (ví dụ: `pickleball-academy`).
3. Đẩy code lên:
   ```bash
   git remote add origin https://github.com/<tai-khoan-github>/pickleball-academy.git
   git push -u origin main
   ```

#### Bước 2: Liên kết và cấu hình trên Vercel
1. Truy cập [https://vercel.com/](https://vercel.com/) và đăng nhập bằng tài khoản GitHub.
2. Nhấn nút **Add New...** ➔ Chọn **Project**.
3. Chọn Repository `pickleball-academy` và nhấn **Import**.
4. **Cấu hình Project Settings (Rất quan trọng):**
   - **Framework Preset:** Chọn `Create React App`.
   - **Root Directory:**
     - Nếu bạn đẩy trực tiếp thư mục `2_Source_Code` lên GitHub ➔ Để mặc định là `./`.
     - Nếu bạn đẩy cả thư mục gốc `Group_Project` chứa `2_Source_Code` bên trong ➔ Nhấn **Edit** và chọn thư mục `Group_Project/2_Source_Code` (hoặc `2_Source_Code`).
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Nhấn nút **Deploy**.
6. Sau khoảng 1-2 phút, hệ thống Vercel cấp phát tên miền công khai dạng `https://<ten-du-an>.vercel.app`.

> **Ưu điểm vượt trội:** Trong mã nguồn đã có sẵn file `vercel.json` chứa cấu hình định tuyến:
> ```json
> {
>   "rewrites": [
>     { "source": "/(.*)", "destination": "/index.html" }
>   ]
> }
> ```
> Cấu hình này đảm bảo khi người dùng tải lại trang (F5/Refresh) ở bất kỳ URL nào cũng không bao giờ bị lỗi `404 Not Found`.

---

### PHƯƠNG ÁN 2: TRIỂN KHAI SIÊU TỐC QUA NETLIFY DROP (KHÔNG CẦN DÙNG GIT)

Nếu bạn muốn có ngay link web công khai trong 30 giây mà không cần cấu hình Git:

1. Chạy lệnh đóng gói tại thư mục `2_Source_Code`:
   ```bash
   npm run build
   ```
2. Truy cập trang web: [https://app.netlify.com/drop](https://app.netlify.com/drop).
3. Đăng nhập hoặc đăng ký tài khoản Netlify miễn phí.
4. Kéo và thả (Drag & Drop) trực tiếp cả thư mục `build/` vừa tạo vào vùng chỉ định của Netlify.
5. Netlify sẽ tự động tải lên và cấp phát link trực tiếp có định dạng `https://<ten-ngau-nhien>.netlify.app`. Bạn có thể vào phần **Site configuration** để đổi tên miền ngắn gọn theo ý muốn.

---

## G. BẢNG TÀI KHOẢN ĐĂNG NHẬP NHANH PHỤC VỤ CHẤM BÀI

Để thuận tiện cho Giảng viên và Người chấm bài kiểm tra tức thì các phân hệ vai trò mà không cần thao tác tạo mới:

| Vai trò (Role) | Họ tên hiển thị | Email đăng nhập | Mật khẩu | Quyền hạn và phân hệ kiểm tra chính |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | Trần Quốc Bảo | `admin@pickleball.edu.vn` | `Admin@123` | Toàn quyền Admin Portal: Quản lý ma trận sân trống ngày/giờ, sơ đồ sân, theo dõi tiến độ chi tiết từng học viên, CRUD sân tập, khóa học, khung giờ & duyệt hồ sơ. |
| **Huấn luyện viên (Coach)** | HLV Sarah Jenkins | `sarah.coach@pickleball.edu.vn` | `Coach@123` | Toàn quyền Kênh HLV: Thời khóa biểu trực quan, điểm danh chuyên cần, chấm DUPR, tra cứu học viên tuần hiện tại/tương lai. |
| **Huấn luyện viên (Coach)** | HLV Nguyễn Hoàng Nam | `coach@pickleball.edu.vn` | `Coach@123` | Kênh HLV lớp Chiến thuật Nâng cao, kiểm tra chống trùng lịch ca dạy. |
| **Học viên (Student)** | Lê Minh Anh | `student@pickleball.edu.vn` | `Student@123` | Xem sổ theo dõi học tập, điểm danh, kết quả DUPR, lịch sử đặt sân tập & đơn hàng Pro Shop. |
| **Học viên (Student)** | Nguyễn Minh Đức | `duc.nguyen@doanhnghiep.vn` | `Student@123` | Đăng ký khóa 1 Kèm 1, kiểm tra trạng thái buổi chưa học (để trống, không bị hiện Present trước). |
| **Học viên (Student)** | Nguyễn Văn An | `an.nguyen@gmail.com` | `Student@123` | Học viên mới đăng ký, kiểm tra tính năng Quick-Jump chuyển tuần học trên lịch HLV. |
| **Tài khoản Khóa (Banned)** | Đặng Văn Tùng | `tung.dang@spam.com` | `123456` | Kiểm tra tính năng chặn đăng nhập và tự động đăng xuất khi bị Admin khóa tài khoản. |

*(Chi tiết đầy đủ về 11 tài khoản vui lòng xem thêm tại tài liệu [3_Root_Credentials.md](file:///c:/Users/ducan/Downloads/Group_Project/Group_Project/3_Root_Credentials.md)).*

---

## H. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING & FAQ)

1. **Lỗi `Something is already running on port 3000` khi chạy `npm start`:**
   - *Nguyên nhân:* Cổng 3000 đang được một ứng dụng khác (hoặc tab dòng lệnh trước đó) sử dụng.
   - *Khắc phục:* Nhấn phím `Y` trên Terminal để React tự động chuyển sang chạy ở cổng tiếp theo (`http://localhost:3001`), hoặc đóng tiến trình chiếm dụng qua Task Manager.

2. **Lỗi `Could not find package.json` khi Deploy trên Vercel:**
   - *Nguyên nhân:* Chọn sai thư mục gốc (Root Directory) khi nhập dự án từ GitHub.
   - *Khắc phục:* Trong phần cài đặt **Root Directory** của dự án trên Vercel, trỏ chính xác vào thư mục `2_Source_Code` (nơi chứa file `package.json`).

3. **Lỗi `404 Not Found` khi F5 (Refresh) lại trang trên Vercel:**
   - *Khắc phục:* Đảm bảo file `vercel.json` nằm cùng cấp với `package.json` trong thư mục `2_Source_Code`. File này đã được cấu hình sẵn luật rewrite `{"source": "/(.*)", "destination": "/index.html"}`.

4. **Muốn đặt lại (Reset) toàn bộ dữ liệu ban đầu:**
   - *Khắc phục:* Nhấn nút **Đăng xuất** ở góc trên bên phải hoặc mở công cụ F12 (Developer Tools) ➔ chọn tab **Application** ➔ **Local Storage** ➔ xóa các khóa `pickleball_...` và tải lại trang. Hệ thống sẽ tự động đồng bộ lại bộ dữ liệu gốc chuẩn xác nhất.
