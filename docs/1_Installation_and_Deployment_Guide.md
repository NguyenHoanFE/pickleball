# 1. INSTALLATION & DEPLOYMENT GUIDE (HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI)
**Dự án:** Website Học Viện Đào Tạo Pickleball (VN Pickleball Academy)
**Công nghệ:** ReactJS 19, Bootstrap 5.3, Lucide React Icons, Context API & LocalStorage Database (`database.json`)

---

## A. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)
- **Node.js:** Phiên bản `>= 18.x` (Khuyến nghị bản LTS)
- **Trình quản lý gói:** `npm` (đi kèm khi cài đặt Node.js)
- **Git:** Dùng để quản lý phiên bản, đẩy mã nguồn lên GitHub và kết nối tự động với Vercel

---

## B. CẤU TRÚC THƯ MỤC MÃ NGUỒN (`2_Source_Code`)
- `public/`: Chứa `index.html`, cấu hình SEO và tài nguyên tĩnh.
- `src/data/`: Cơ sở dữ liệu khởi tạo phong phú (`users.js`, `courses.js`, `courts.js`, `products.js`, `blogs.js`) đồng bộ với `database.json`.
- `src/context/AuthContext.jsx`: Quản lý xác thực đăng nhập, đăng ký, cập nhật hồ sơ và phân quyền theo 3 vai trò (`admin`, `coach`, `student`).
- `src/components/`:
  - **Giao diện Quản trị viên độc lập (Role Admin):** `AdminPortalSection.jsx` (Full-screen Sidebar Portal với Sơ đồ sân trống theo Ngày/Giờ & 8 phân hệ CRUD).
  - **Giao diện Huấn luyện viên (Role Coach):** `CoachPortalSection.jsx` (Quản lý lớp dạy, điểm danh chuyên cần, chấm điểm trình độ DUPR và cập nhật giáo trình).
  - **Giao diện Học viên & Khách hàng (Role Student / Guest):** `Header.jsx`, `HomeSection.jsx`, `CoursesSection.jsx`, `RegisterSection.jsx`, `CourtBookingSection.jsx`, `ProShopSection.jsx`, `BlogReviewsSection.jsx`, `AboutContactSection.jsx`, `UserProfileModal.jsx`, `CartDrawerModal.jsx`, `AuthModal.jsx`, `Footer.jsx`.

---

## C. HƯỚNG DẪN CÀI ĐẶT & CHẠY DƯỚI LOCAL (INSTALLATION GUIDE)

### Bước 1: Mở Terminal tại thư mục chứa Source Code
Di chuyển vào thư mục `2_Source_Code`:
```bash
cd 2_Source_Code
```

### Bước 2: Cài đặt các gói thư viện (Dependencies)
```bash
npm install
```

### Bước 3: Khởi chạy ứng dụng ở môi trường Development
```bash
npm start
```
- Ứng dụng sẽ tự động mở trên trình duyệt tại địa chỉ: **`http://localhost:3000`**

### Bước 4: Đóng gói bản Production (Build kiểm thử)
```bash
npm run build
```
- Hệ thống sẽ biên dịch và tối ưu hóa toàn bộ giao diện ra thư mục `build/` (sẵn sàng triển khai lên máy chủ tĩnh hoặc dịch vụ đám mây).

---

## D. HƯỚNG DẪN DEPLOY LÊN HOST & DOMAIN MIỄN PHÍ (PUBLIC TRUY CẬP)

Để sản phẩm có đường link công khai (public URL) truy cập được từ bất kỳ thiết bị nào, bạn có thể triển khai qua **Vercel** (khuyến nghị chính) hoặc **Netlify**.

---

### PHƯƠNG ÁN 1: DEPLOY TỰ ĐỘNG QUA VERCEL + GITHUB (KHUYẾN NGHỊ HÀNG ĐẦU)

#### Bước 1: Chuẩn bị & Đẩy mã nguồn lên GitHub
1. Mở Terminal tại thư mục `2_Source_Code` (hoặc thư mục gốc dự án):
   ```bash
   cd 2_Source_Code
   git init
   git add .
   git commit -m "feat: release VN Pickleball Academy web application"
   git branch -M main
   ```
2. Đăng nhập [GitHub](https://github.com/), tạo một Repository mới (ví dụ: `pickleball-academy-web`).
3. Liên kết và đẩy code lên:
   ```bash
   git remote add origin https://github.com/<tai-khoan-github>/pickleball-academy-web.git
   git push -u origin main
   ```

#### Bước 2: Đăng nhập Vercel
1. Truy cập [https://vercel.com/](https://vercel.com/).
2. Nhấn **Log In** hoặc **Sign Up** và chọn **Continue with GitHub** (đồng bộ trực tiếp với tài khoản GitHub đã chứa repository).

#### Bước 3: Tạo dự án mới (Add New Project)
1. Tại Dashboard chính của Vercel, nhấn nút **Add New...** ➔ Chọn **Project**.
2. Tìm repository `pickleball-academy-web` vừa đẩy lên và nhấn nút **Import**.

#### Bước 4: Cấu hình Build & Root Directory (Cực kỳ quan trọng)
- **Trường hợp đẩy code từ thư mục `2_Source_Code` lên GitHub:**
  - **Framework Preset:** `Create React App` (Vercel tự động nhận diện).
  - **Root Directory:** `./` (mặc định).
  - **Build Command:** `npm run build`
  - **Output Directory:** `build`
  - **Install Command:** `npm install`
- **Trường hợp đẩy cả thư mục gốc `Group_Project` chứa `2_Source_Code` bên trong:**
  - Tại mục **Root Directory**, nhấn **Edit** ➔ Chọn thư mục `2_Source_Code` (hoặc `Group_Project/2_Source_Code`).
- Dự án đã tích hợp sẵn file [vercel.json](file:///c:/Users/ducan/Downloads/Group_Project/Group_Project/2_Source_Code/vercel.json) giúp định tuyến SPA mượt mà (không bị lỗi 404 khi F5/refresh trang).

#### Bước 5: Hoàn tất & Nhận Domain Public
1. Nhấn nút **Deploy**.
2. Đợi khoảng 1–2 phút để hệ thống Vercel tự động cài đặt thư viện và đóng gói ứng dụng.
3. Khi xuất hiện màn hình pháo hoa chúc mừng (*Congratulations!*), bạn sẽ nhận được đường link website chính thức dạng:
   $$\text{https://<ten-du-an>.vercel.app}$$
4. Bạn có thể gửi đường link này cho giảng viên, bạn bè hoặc khách hàng truy cập trực tiếp từ máy tính và điện thoại.

---

### PHƯƠNG ÁN 2: DEPLOY SIÊU TỐC QUA NETLIFY DROP (KHÔNG CẦN DÙNG GIT)

Nếu bạn muốn có ngay link public trong vòng 30 giây mà không cần tạo repository trên GitHub:

1. Chạy lệnh đóng gói tại thư mục `2_Source_Code`:
   ```bash
   cd 2_Source_Code
   npm run build
   ```
   Hệ thống sẽ tạo ra thư mục `build/` chứa toàn bộ trang web đã được tối ưu.
2. Truy cập [https://app.netlify.com/drop](https://app.netlify.com/drop) (đăng ký/đăng nhập miễn phí bằng Email hoặc GitHub).
3. Kéo thả (Drag & Drop) trực tiếp thư mục `build/` vào khung của Netlify.
4. Netlify sẽ tải lên và kích hoạt trang web ngay lập tức với domain miễn phí dạng:
   $$\text{https://<ten-ngau-nhien>.netlify.app}$$
5. Bạn có thể vào mục **Site configuration** ➔ **Change site name** để đổi tên miền theo ý muốn (ví dụ: `https://vn-pickleball-academy.netlify.app`).

---

## E. XỬ LÝ LỖI THƯỜNG GẶP KHI DEPLOY (TROUBLESHOOTING)
- **Lỗi `Could not find package.json` trên Vercel:** Xảy ra do kho lưu trữ GitHub chứa nhiều cấp thư mục. Khắc phục bằng cách chọn đúng **Root Directory** là `2_Source_Code` trong phần cấu hình của Vercel.
- **Lỗi `Page Not Found (404)` khi tải lại trang con:** Dự án đã cấu hình sẵn file `vercel.json` định tuyến toàn bộ request về `/index.html`, giúp loại bỏ hoàn toàn lỗi này.
- **Dữ liệu đăng nhập và giỏ hàng:** Ứng dụng chạy Client-side với LocalStorage kết hợp bộ dữ liệu gốc `database.json`, do đó toàn bộ tính năng phân quyền (Admin, Coach, Học viên), điểm danh, đặt sân và mua sắm đều hoạt động ổn định trên môi trường public mà không cần cấu hình thêm server phụ.
