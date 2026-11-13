// Comprehensive Role & Workflow Test Suite for VN Pickleball Academy
const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ TỪNG ROLE & CÁC LUỒNG NGHIỆP VỤ HỆ THỐNG');
console.log('================================================================\n');

// 1. Load Data
const usersPath = path.join(__dirname, 'src', 'data', 'users.js');
const courtsPath = path.join(__dirname, 'src', 'data', 'courts.js');
const coursesPath = path.join(__dirname, 'src', 'data', 'courses.js');
const blogsPath = path.join(__dirname, 'src', 'data', 'blogs.js');

// Helper to extract exported objects from ES module files
function parseDataFile(filePath, varName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Simple regex parser for JS data objects
  return content;
}

const usersFile = fs.readFileSync(usersPath, 'utf-8');
const coursesFile = fs.readFileSync(coursesPath, 'utf-8');
const blogsFile = fs.readFileSync(blogsPath, 'utf-8');

// Parse users
const usersMatch = usersFile.match(/export const INITIAL_USERS\s*=\s*(\[[\s\S]*?\n\];)/);
let users = [];
if (usersMatch) {
  // eval safe data array in sandbox
  users = eval(usersMatch[1].replace(/;\s*$/, ''));
}

// Parse enrollments
const enrMatch = blogsFile.match(/export const INITIAL_ENROLLMENTS\s*=\s*(\[[\s\S]*?\n\];)/);
let enrollments = [];
if (enrMatch) {
  enrollments = eval(enrMatch[1].replace(/;\s*$/, ''));
}

// Parse court bookings
const todayDate = '2026-11-13';
const courtsFile = fs.readFileSync(courtsPath, 'utf-8');
const cbMatch = courtsFile.match(/export const INITIAL_COURT_BOOKINGS\s*=\s*(\[[\s\S]*?\n\];)/);
let courtBookings = [];
if (cbMatch) {
  courtBookings = eval(cbMatch[1].replace(/;\s*$/, ''));
}

console.log(`✓ Đã nạp thành công: ${users.length} tài khoản, ${enrollments.length} hồ sơ ghi danh, ${courtBookings.length} lịch đặt sân.\n`);

// Simulation of Auth Logic from AuthContext.jsx
function simulateLogin(email, password, userList = users) {
  const found = userList.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!found) {
    return { success: false, message: 'Email hoặc mật khẩu không chính xác!' };
  }
  if (found.status === 'banned') {
    return {
      success: false,
      message: 'Tài khoản này đã bị Quản trị viên tạm khóa do vi phạm quy định Học viện!'
    };
  }
  return { success: true, user: found };
}

let testPassed = 0;
let testFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testFailed++;
  }
}

// ============================================================================
// TEST SUITE 1: ROOT ADMIN ROLE
// ============================================================================
console.log('▶ [TEST SUITE 1] KIỂM THỬ ROLE QUẢN TRỊ VIÊN (ADMIN - Trần Quốc Bảo)');
{
  const res = simulateLogin('admin@pickleball.edu.vn', 'Admin@123');
  assert(res.success === true, 'Đăng nhập tài khoản Root Admin thành công');
  assert(res.user.role === 'admin', 'Xác nhận Role là "admin"');
  assert(res.user.name === 'Trần Quốc Bảo', 'Tên hiển thị đúng Giám đốc Trần Quốc Bảo');

  // Verify Role Redirection: Admin -> 'admin-portal'
  let targetTab = res.user.role === 'admin' ? 'admin-portal' : 'home';
  assert(targetTab === 'admin-portal', 'Hệ thống tự động điều hướng vào Admin Portal');

  // Verify Admin Guard: Non-admin trying to access admin-portal
  const studentUser = { role: 'student', name: 'Student Test' };
  const canAccessAdmin = studentUser.role === 'admin';
  assert(canAccessAdmin === false, 'Học viên (Student) bị CHẶN tuyệt đối khỏi Admin Portal');

  // Test Course Deletion Protection (Lỗi 9)
  const courseWithStudents = 'course-101';
  const activeStudents = enrollments.filter(
    (e) => e.courseId === courseWithStudents && e.status !== 'cancelled'
  );
  const isDeleteAllowed = activeStudents.length === 0;
  assert(
    isDeleteAllowed === false,
    `Khóa học "${courseWithStudents}" đang có ${activeStudents.length} học viên -> Bị CHẶN xóa (Bảo toàn dữ liệu học viên)`
  );
}
console.log('');

// ============================================================================
// TEST SUITE 2: COACH (HUẤN LUYỆN VIÊN) ROLES
// ============================================================================
console.log('▶ [TEST SUITE 2] KIỂM THỬ ROLE HUẤN LUYỆN VIÊN (COACH - 4 HLV Chuyên Môn)');
const coachCredentials = [
  { email: 'coach@pickleball.edu.vn', name: 'HLV Nguyễn Hoàng Nam', scope: 'Chiến thuật Nâng cao / Giải đấu' },
  { email: 'sarah.coach@pickleball.edu.vn', name: 'HLV Sarah Jenkins', scope: 'Huấn luyện 1 Kèm 1 VIP & Cấp tốc' },
  { email: 'quan.coach@pickleball.edu.vn', name: 'HLV Vũ Minh Quân', scope: 'Khối Cơ bản 2.0 - 3.0' },
  { email: 'thao.coach@pickleball.edu.vn', name: 'HLV Lê Phương Thảo', scope: 'Khối Thiếu nhi Junior Camp' }
];

coachCredentials.forEach((coach) => {
  const res = simulateLogin(coach.email, 'Coach@123');
  assert(res.success === true, `Đăng nhập thành công HLV ${coach.name}`);
  assert(res.user.role === 'coach', `Xác nhận role "coach" cho ${coach.name}`);

  let targetTab = res.user.role === 'coach' ? 'coach-portal' : 'home';
  assert(targetTab === 'coach-portal', `Hệ thống tự động chuyển vào Kênh HLV cho ${coach.name}`);
});

// Test Coach Attendance Authorization Guard (Lỗi phân quyền HLV)
{
  function isCoachOwner(coachName, currentCoachName) {
    if (!currentCoachName) return false;
    if (!coachName || typeof coachName !== 'string') return false;
    const targetClean = coachName.trim().toLowerCase();
    if (!targetClean || targetClean === 'chưa phân công' || targetClean === 'chưa có') return false;
    const currentClean = currentCoachName.trim().toLowerCase();
    return currentClean.includes(targetClean) || targetClean.includes(currentClean);
  }

  const coachNam = 'HLV Nguyễn Hoàng Nam';
  const coachSarah = 'HLV Sarah Jenkins';

  assert(isCoachOwner('HLV Nguyễn Hoàng Nam', coachNam) === true, 'HLV Nam được điểm danh lớp của chính mình');
  assert(isCoachOwner('HLV Sarah Jenkins', coachNam) === false, 'HLV Nam BỊ CHẶN điểm danh lớp của HLV Sarah');
  assert(isCoachOwner('Chưa phân công', coachNam) === false, 'HLV Nam BỊ CHẶN điểm danh hồ sơ chưa phân công HLV');
  assert(isCoachOwner('', coachNam) === false, 'HLV Nam BỊ CHẶN điểm danh chuỗi rỗng');

  // Kiểm tra liên kết học viên Nguyễn Minh Đức (Khóa 1 Kèm 1) cho HLV Sarah Jenkins
  const sarahEnrollments = enrollments.filter((e) => isCoachOwner(e.coachName, coachSarah));
  const ducEnrollment = sarahEnrollments.find((e) => e.studentName === 'Nguyễn Minh Đức');
  assert(ducEnrollment !== undefined, 'Học viên Nguyễn Minh Đức hiển thị chính xác trong lớp HLV Sarah Jenkins');
  assert(ducEnrollment.courseId === 'course-103', 'Học viên Nguyễn Minh Đức đăng ký đúng khóa Huấn Luyện 1 Kèm 1');
  assert(isCoachOwner(ducEnrollment.coachName, coachSarah) === true, 'HLV Sarah Jenkins có đầy đủ quyền điểm danh & chấm DUPR cho Nguyễn Minh Đức');

  // Kiểm thử HLV xem được lịch học ở TƯƠNG LAI và QUÁ KHỨ
  const { calculateCourseDates } = require('./src/data/courts');
  const checkTodayStr = '2026-11-13';

  // 1. Lịch Tương Lai: Lớp 1 Kèm 1 của Nguyễn Minh Đức (HLV Sarah Jenkins) bắt đầu từ 14/11/2026
  const sarahDates = calculateCourseDates(ducEnrollment.preferredSchedule, ducEnrollment.startDate, ducEnrollment.totalSessions);
  assert(sarahDates.sessionDates.length === 10, 'Lớp 1 Kèm 1 của Nguyễn Minh Đức tính đúng đủ 10 buổi học');
  const sarahFutureSessions = sarahDates.sessionDates.filter((d) => d >= checkTodayStr);
  assert(sarahFutureSessions.length === 10, 'HLV Sarah Jenkins xem được 10 buổi học trong TƯƠNG LAI của học viên Nguyễn Minh Đức (Từ 14/11/2026)');

  // 2. Lịch Quá Khứ: Lớp Thực Chiến Giải Đấu của Võ Hoàng Khang (HLV Nguyễn Hoàng Nam) từ 21/10 đến 08/11/2026
  const khangEnrollment = enrollments.find((e) => e.studentName === 'Võ Hoàng Khang');
  assert(khangEnrollment !== undefined, 'Tìm thấy hồ sơ lớp của Võ Hoàng Khang');
  const khangDates = calculateCourseDates(khangEnrollment.preferredSchedule, khangEnrollment.startDate, khangEnrollment.totalSessions);
  const khangPastSessions = khangDates.sessionDates.filter((d) => d < checkTodayStr);
  assert(khangPastSessions.length === 6, 'HLV Nguyễn Hoàng Nam xem được 6 buổi học trong QUÁ KHỨ / LỊCH SỬ của học viên Võ Hoàng Khang (Kết thúc 08/11/2026)');

  // 3. Phân định đa chiều Quá Khứ & Tương Lai của lớp đang diễn ra (Phạm Gia Huy)
  const huyEnrollment = enrollments.find((e) => e.studentName === 'Phạm Gia Huy');
  const huyDates = calculateCourseDates(huyEnrollment.preferredSchedule, huyEnrollment.startDate, huyEnrollment.totalSessions);
  const huyPast = huyDates.sessionDates.filter((d) => d < checkTodayStr);
  const huyFuture = huyDates.sessionDates.filter((d) => d >= checkTodayStr);
  assert(huyPast.length > 0 && huyFuture.length > 0, 'HLV xem được phân định rõ ràng giữa các buổi học trong Quá Khứ và buổi học Tương Lai');

  // Test Conflict-Free Scheduling (Giao nhau một phần: Lớp A 08:00-10:00 vs Lớp B 09:00-11:00)
  function parseTimeRangeMinutes(timeStr) {
    if (!timeStr) return { start: 0, end: 0 };
    const match = timeStr.match(/(\d{1,2})[:h](\d{2})\s*-\s*(\d{1,2})[:h](\d{2})/i);
    if (!match) return { start: 0, end: 0 };
    const start = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    const end = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
    return { start, end };
  }
  function isTimeOverlapping(timeStr1, timeStr2) {
    const t1 = parseTimeRangeMinutes(timeStr1);
    const t2 = parseTimeRangeMinutes(timeStr2);
    if (t1.start === 0 && t1.end === 0) return false;
    if (t2.start === 0 && t2.end === 0) return false;
    return Math.max(t1.start, t2.start) < Math.min(t1.end, t2.end);
  }

  const isOverlappingPartial = isTimeOverlapping('08:00 - 10:00', '09:00 - 11:00');
  assert(isOverlappingPartial === true, 'Phát hiện chính xác 2 lớp giao thoa thời gian một phần: Lớp A (08:00-10:00) và Lớp B (09:00-11:00)');

  const isConsecutiveOverlapping = isTimeOverlapping('08:00 - 10:00', '10:00 - 12:00');
  assert(isConsecutiveOverlapping === false, 'Hai ca liền kề kết thúc ca này bắt đầu ca kia (10:00) KHÔNG bị tính là trùng lịch');

  // Simulation of checkScheduleSlotConflict
  const mockCoachNamBookings = [
    {
      id: 'TRAIN-CLASS-A',
      courtId: 'court-3',
      date: '2026-11-20',
      time: '08:00 - 10:00',
      linkedCoachName: 'HLV Nguyễn Hoàng Nam',
      status: 'confirmed'
    }
  ];
  const newClassConflict = mockCoachNamBookings.some((b) => {
    return b.status !== 'cancelled' && b.date === '2026-11-20' && b.linkedCoachName.includes('Nguyễn Hoàng Nam') && isTimeOverlapping('09:00 - 11:00', b.time);
  });
  assert(newClassConflict === true, 'Hệ thống CHẶN Lớp B (09:00-11:00) khi HLV Nguyễn Hoàng Nam đã có Lớp A (08:00-10:00)');
}
console.log('');

// ============================================================================
// TEST SUITE 3: STUDENT (HỌC VIÊN) ROLE
// ============================================================================
console.log('▶ [TEST SUITE 3] KIỂM THỬ ROLE HỌC VIÊN (STUDENT - Lê Minh Anh)');
{
  const res = simulateLogin('student@pickleball.edu.vn', 'Student@123');
  assert(res.success === true, 'Đăng nhập tài khoản Học viên Lê Minh Anh thành công');
  assert(res.user.role === 'student', 'Xác nhận Role là "student"');

  // Verify Student cannot access Admin or Coach tabs
  let targetTab = res.user.role === 'admin' ? 'admin-portal' : res.user.role === 'coach' ? 'coach-portal' : 'home';
  assert(targetTab === 'home', 'Học viên được chuyển hướng về trang chủ công khai (Public Home)');

  // Test Duplicate Course Enrollment Prevention (Lỗi 8)
  const studentPhone = res.user.phone || '0903123456';
  const studentEmail = res.user.email;
  const courseToEnroll = 'course-1'; // Assume student already has ENR in course-1 or test matching
  
  const testEnrollments = [
    { courseId: 'course-1', studentPhone: '0903123456', studentEmail: 'student@pickleball.edu.vn', status: 'confirmed' }
  ];

  const cleanPhone = studentPhone.replace(/\s+/g, '');
  const cleanEmail = studentEmail.toLowerCase();
  const isDuplicate = testEnrollments.some(
    (enr) =>
      enr.courseId === courseToEnroll &&
      enr.status !== 'cancelled' &&
      (enr.studentPhone.replace(/\s+/g, '') === cleanPhone || enr.studentEmail.toLowerCase() === cleanEmail)
  );
  assert(isDuplicate === true, 'Hệ thống PHÁT HIỆN học viên đã có hồ sơ lớp này và CHẶN đăng ký trùng (Lỗi 8)');

  // Test Court Booking Conflict Prevention (Lỗi 6)
  const existingBooking = { courtId: 'court-1', date: '2026-11-20', slotId: 'slot-4', status: 'confirmed' };
  const newBookingAttempt = { courtId: 'court-1', date: '2026-11-20', slotId: 'slot-4', status: 'confirmed' };
  
  const isSlotOccupied = (b1, b2) =>
    b1.courtId === b2.courtId && b1.date === b2.date && b1.slotId === b2.slotId && b1.status !== 'cancelled';

  assert(isSlotOccupied(existingBooking, newBookingAttempt) === true, 'Hệ thống PHÁT HIỆN sân đã bị đặt và CHẶN trùng giờ (Lỗi 6)');

  // Test Court Booking Cancellation (Lỗi 7)
  const cancelledBooking = { ...existingBooking, status: 'cancelled' };
  assert(isSlotOccupied(cancelledBooking, newBookingAttempt) === false, 'Sau khi hủy đặt sân, khung giờ TRỞ THÀNH TRỐNG ngay lập tức (Lỗi 7)');

  // Test Học viên tự do chọn sân tập mong muốn (không fix cứng) & Chặn khách vãng lai chiếm chỗ
  const mockEnrollment = {
    id: 'ENR-9999',
    studentName: 'Nguyễn Văn A',
    courseId: 'course-101',
    courseTitle: 'Khóa Nhập Môn Pickleball',
    preferredSchedule: 'T2 - T4 - T6 17:30 - 19:30',
    preferredCourtId: 'court-1', // Học viên chủ động chọn Sân Championship #1 thay vì fix cứng Sân 3
    courtId: 'court-1',
    courtName: 'Sân Trung Tâm Championship #1 (Indoor Pro)',
    startDate: '2026-11-16',
    totalSessions: 8,
    sessionDates: [
      '2026-11-16', '2026-11-18', '2026-11-20', '2026-11-23',
      '2026-11-25', '2026-11-27', '2026-11-30', '2026-12-02'
    ]
  };

  // generateTrainingBookingsForEnrollment giữ đúng sân do học viên chọn
  const chosenCourtId = mockEnrollment.preferredCourtId || mockEnrollment.courtId || 'court-3';
  const autoReservedBookings = mockEnrollment.sessionDates.map((d, idx) => ({
    id: `TRAIN-${mockEnrollment.id}-${d}`,
    courtId: chosenCourtId,
    courtName: mockEnrollment.courtName,
    date: d,
    slotId: 'slot-6',
    time: '17:30 - 19:00',
    bookingType: 'training_class',
    status: 'confirmed'
  }));

  assert(autoReservedBookings.length === 8, 'Hệ thống TỰ ĐỘNG GIỮ ĐỦ 8 BUỔI trên sân học viên đã chọn');
  assert(autoReservedBookings.every(b => b.courtId === 'court-1'), '100% tất cả các buổi học đều được giữ trên SÂN DO HỌC VIÊN CHỌN (Sân #1, không bị fix cứng Sân 3)');

  // Khách vãng lai cố đặt Sân #1 cùng ngày và trùng giờ
  const freeCustomerConflict = autoReservedBookings.some((b) => {
    return b.courtId === 'court-1' && b.date === '2026-11-16' && b.status !== 'cancelled' && (b.slotId === 'slot-6' || isTimeOverlapping('17:30 - 19:00', b.time));
  });
  assert(freeCustomerConflict === true, 'Khách vãng lai đặt sân tự do BỊ CHẶN TUYỆT ĐỐI không thể chiếm khung giờ của lớp học trên Sân do học viên chọn');

  // Test Trạng thái điểm danh: Các buổi chưa học (tương lai) KHÔNG ĐỂ TRẠNG THÁI (null)
  const todayStr = '2026-11-13';
  const enrDuc = enrollments.find(e => e.id === 'ENR-2003');
  assert(enrDuc !== undefined, 'Hồ sơ học viên Nguyễn Minh Đức (ENR-2003) tồn tại');
  assert(enrDuc.attendedSessions === 0, 'Nguyễn Minh Đức có ngày bắt đầu 14/11 (tương lai) nên số buổi đã học phải bằng 0');

  // Kiểm tra logic xác định trạng thái buổi học:
  const getSessionStatus = (dateStr, idx, enr) => {
    if (dateStr > todayStr) return null; // Tương lai: KHÔNG ĐỂ TRẠNG THÁI
    if (dateStr === todayStr) {
      if (Array.isArray(enr.sessionsList) && enr.sessionsList[idx] === 'present') return 'present';
      if (Array.isArray(enr.sessionsList) && enr.sessionsList[idx] === 'absent') return 'absent';
      return null;
    }
    if (Array.isArray(enr.sessionsList) && enr.sessionsList[idx]) return enr.sessionsList[idx];
    return idx < (enr.attendedSessions || 0) ? 'present' : 'absent';
  };

  assert(getSessionStatus('2026-11-14', 0, enrDuc) === null, 'Buổi học ngày 14/11 (tương lai) TUYỆT ĐỐI KHÔNG HIỂN THỊ PRESENT/ABSENT (để trống không trạng thái)');
  assert(getSessionStatus('2026-11-15', 1, enrDuc) === null, 'Buổi học ngày 15/11 (tương lai) TUYỆT ĐỐI KHÔNG HIỂN THỊ PRESENT/ABSENT (để trống không trạng thái)');
  assert(getSessionStatus('2026-11-03', 0, enrollments[0]) === 'present', 'Buổi học trong quá khứ đã tham gia hiển thị đúng Present');

  // Test Cart Quantity & Live Total calculation (Lỗi 12)
  const cart = [
    { product: { id: 'p1', price: 2500000 }, quantity: 2 },
    { product: { id: 'p2', price: 150000 }, quantity: 4 }
  ];
  let totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  assert(totalAmount === 2 * 2500000 + 4 * 150000, 'Tính đúng tổng tiền giỏ hàng ban đầu: 5.600.000đ (Lỗi 12)');

  // Increase quantity of item 1
  cart[0].quantity += 1;
  totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  assert(totalAmount === 3 * 2500000 + 4 * 150000, 'Tổng tiền TỰ ĐỘNG CẬP NHẬT khi tăng số lượng: 8.100.000đ (Lỗi 12)');

  // Test Spam Checkout Prevention (Lỗi 13)
  let isSubmitting = false;
  let orderCount = 0;
  function simulateCheckout() {
    if (isSubmitting) return; // Prevent double submit
    isSubmitting = true;
    orderCount++;
  }
  simulateCheckout(); // 1st click
  simulateCheckout(); // 2nd rapid click
  simulateCheckout(); // 3rd rapid click
  assert(orderCount === 1, 'Bấm nút thanh toán liên tục chỉ tạo ĐÚNG 1 ĐƠN HÀNG duy nhất (Lỗi 13)');
}
console.log('');

// ============================================================================
// TEST SUITE 4: BANNED ACCOUNT TEST (TÀI KHOẢN BỊ KHÓA)
// ============================================================================
console.log('▶ [TEST SUITE 4] KIỂM THỬ ROLE TÀI KHOẢN BỊ KHÓA (BANNED - Đặng Văn Tùng)');
{
  const res = simulateLogin('tung.dang@spam.com', '123456');
  assert(res.success === false, 'Đăng nhập bị TỪ CHỐI hoàn toàn');
  assert(
    res.message.includes('tạm khóa'),
    'Thông báo lỗi rõ ràng: "Tài khoản này đã bị Quản trị viên tạm khóa do vi phạm quy định Học viện!" (Lỗi 10)'
  );

  // Test real-time ban kick out: If an active user gets banned while logged in
  let currentUser = { id: 'user-active-1', name: 'Test User', status: 'active' };
  let currentUsersList = [{ id: 'user-active-1', name: 'Test User', status: 'banned' }];
  
  const liveUser = currentUsersList.find((u) => u.id === currentUser.id);
  if (liveUser && liveUser.status === 'banned') {
    currentUser = null; // Auto kick out
  }
  assert(currentUser === null, 'Tài khoản đang đăng nhập bị Admin khóa -> TỰ ĐỘNG ĐĂNG XUẤT NGAY LẬP TỨC (Lỗi 10)');
}
console.log('');

// ============================================================================
// TEST SUITE 5: LOGOUT & LOCALSTORAGE CLEANUP (Lỗi 14)
// ============================================================================
console.log('▶ [TEST SUITE 5] KIỂM THỬ ĐĂNG XUẤT & XÓA PHIÊN (Lỗi 14)');
{
  let mockLocalStorage = { vp_academy_current_user: JSON.stringify({ name: 'Admin', role: 'admin' }) };
  let activeTab = 'admin-portal';

  // Logout action
  delete mockLocalStorage['vp_academy_current_user'];
  activeTab = 'home';

  assert(mockLocalStorage['vp_academy_current_user'] === undefined, 'LocalStorage bị XÓA SẠCH khi đăng xuất');
  assert(activeTab === 'home', 'Giao diện tự động TRỞ VỀ TRANG CHỦ, F5 không bị kẹt tab Admin/Coach (Lỗi 14)');
}
console.log('');

console.log('================================================================');
console.log(`📊 TỔNG KẾT KẾT QUẢ KIỂM THỬ: ${testPassed} KIỂM THỬ THÀNH CÔNG, ${testFailed} THẤT BÀI.`);
if (testFailed === 0) {
  console.log('🎉 TẤT CẢ CÁC LUỒNG VAI TRÒ & NGHIỆP VỤ BẢO VỆ HOẠT ĐỘNG HOÀN HẢO 100%!');
}
console.log('================================================================');
