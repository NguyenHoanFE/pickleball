import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  BookOpen,
  FileText,
  Calendar,
  ShieldCheck,
  Sparkles,
  Clock,
  Sun,
  Moon,
  Zap,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateCourseDates, getAssignedCoachForCourse, checkScheduleSlotConflict, INITIAL_COURTS } from '../data/courts';

export const TIME_SLOT_GROUPS = [
  {
    id: 'evening',
    label: 'Ca Tối Giờ Vàng',
    icon: Moon,
    desc: 'Khung giờ vàng phổ biến nhất cho dân văn phòng, công sở & doanh nhân sau giờ làm việc',
    slots: [
      {
        id: 'slot-t2t5-eve',
        days: 'Thứ 2 & Thứ 5',
        time: '18:30 - 20:30',
        label: 'Giờ Vàng Công Sở',
        badge: '🔥 Rất Phổ Biến',
        badgeColor: 'bg-danger text-white',
        capacity: 'Còn 2 chỗ'
      },
      {
        id: 'slot-t3t6-eve',
        days: 'Thứ 3 & Thứ 6',
        time: '19:00 - 21:00',
        label: 'Chiến Thuật & Match Play',
        badge: '⚡ Giờ Cao Điểm',
        badgeColor: 'bg-warning text-dark',
        capacity: 'Còn 3 chỗ'
      },
      {
        id: 'slot-t4cn-eve',
        days: 'Thứ 4 & Chủ Nhật',
        time: '19:00 - 21:00',
        label: 'Bootcamp Thi Đấu',
        badge: '🏆 Nâng Hạng DUPR',
        badgeColor: 'bg-primary text-white',
        capacity: 'Còn 4 chỗ'
      }
    ]
  },
  {
    id: 'morning',
    label: 'Ca Buổi Sáng',
    icon: Sun,
    desc: 'Không khí trong lành, mặt sân mát mẻ, khởi đầu ngày mới tràn đầy năng lượng',
    slots: [
      {
        id: 'slot-t2t5-mor',
        days: 'Thứ 2 & Thứ 5',
        time: '06:30 - 08:30',
        label: 'Sáng Sớm Thể Lực',
        badge: '🌱 Sân Thoáng Mát',
        badgeColor: 'bg-success text-white',
        capacity: 'Còn 5 chỗ'
      },
      {
        id: 'slot-t3t6-mor',
        days: 'Thứ 3 & Thứ 6',
        time: '07:30 - 09:30',
        label: 'Cơ Bản & Footwork',
        badge: '🎾 Năng Động',
        badgeColor: 'bg-info text-dark',
        capacity: 'Còn 4 chỗ'
      },
      {
        id: 'slot-weekend-mor',
        days: 'Thứ 7 & Chủ Nhật',
        time: '07:30 - 09:30',
        label: 'Cuối Tuần Sáng Sớm',
        badge: '⭐ VIP Cuối Tuần',
        badgeColor: 'bg-warning text-dark',
        capacity: 'Còn 2 chỗ'
      }
    ]
  },
  {
    id: 'afternoon',
    label: 'Ca Buổi Chiều',
    icon: Zap,
    desc: 'Lớp chuyên biệt phái đẹp giữ dáng, học sinh sinh viên & trại huấn luyện trẻ em',
    slots: [
      {
        id: 'slot-t3t5-aft',
        days: 'Thứ 3 & Thứ 5',
        time: '16:00 - 17:30',
        label: 'Ladies Fitness & Skill',
        badge: '🌸 Lớp Phái Đẹp',
        badgeColor: 'bg-danger text-white',
        capacity: 'Còn 3 chỗ'
      },
      {
        id: 'slot-t7cn-aft',
        days: 'Thứ 7 & Chủ Nhật',
        time: '15:00 - 17:00',
        label: 'Junior Kids Camp',
        badge: '👶 Lớp 6 - 15 Tuổi',
        badgeColor: 'bg-primary text-white',
        capacity: 'Còn 4 chỗ'
      }
    ]
  },
  {
    id: 'flexible',
    label: 'Ca Linh Hoạt 1-1',
    icon: Sparkles,
    desc: 'Học viên chủ động chọn ngày giờ học từ 06:00 - 22:00 cùng Huấn luyện viên',
    slots: [
      {
        id: 'slot-vip-private',
        days: 'Tất cả các ngày trong tuần (T2 - CN)',
        time: 'Tự chọn (06:00 - 22:00)',
        label: 'Huấn Luyện VIP 1 Kèm 1',
        badge: '👑 Linh Hoạt 100%',
        badgeColor: 'bg-warning text-dark',
        capacity: 'Ưu tiên xếp HLV'
      }
    ]
  }
];

export default function RegisterSection({
  courses,
  courts = [],
  preselectedCourse,
  onAddEnrollment,
  enrollments = [],
  courtBookings = [],
  onNavigate
}) {
  const { currentUser } = useAuth();

  const getUpcomingDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: preselectedCourse ? preselectedCourse.id : courses[0]?.id || '',
    coachName: '',
    preferredSchedule: 'Thứ 2 & Thứ 5 (18:30 - 20:30) • Giờ Vàng Công Sở',
    preferredCourtId: 'court-3',
    startDate: getUpcomingDateString(),
    experienceLevel: 'Người mới bắt đầu (Chưa từng chơi)',
    notes: ''
  });

  const [scheduleCategory, setScheduleCategory] = useState('all');
  const [isCustomSchedule, setIsCustomSchedule] = useState(false);
  const [customScheduleInput, setCustomScheduleInput] = useState('');

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submittedRecord, setSubmittedRecord] = useState(null);

  const availableCourts = useMemo(() => {
    return Array.isArray(courts) && courts.length > 0 ? courts : INITIAL_COURTS;
  }, [courts]);

  const selectedCourtObj = useMemo(() => {
    return (
      availableCourts.find((c) => c.id === formData.preferredCourtId) ||
      availableCourts.find((c) => c.id === 'court-3') ||
      availableCourts[0]
    );
  }, [availableCourts, formData.preferredCourtId]);

  // Sync preselected course or current logged-in user
  useEffect(() => {
    if (preselectedCourse) {
      setFormData((prev) => ({
        ...prev,
        courseId: preselectedCourse.id,
        coachName: preselectedCourse.coach || getAssignedCoachForCourse(preselectedCourse),
        preferredSchedule: preselectedCourse.schedule || prev.preferredSchedule
      }));
    }
  }, [preselectedCourse]);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
        email: prev.email || currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
  const sessionCountMatch = selectedCourseObj?.duration?.match(/(\d+)\s*buổi/i);
  const sessionCount = sessionCountMatch ? parseInt(sessionCountMatch[1], 10) : 8;

  const calculatedDates = useMemo(() => {
    return calculateCourseDates(formData.preferredSchedule, formData.startDate, sessionCount);
  }, [formData.preferredSchedule, formData.startDate, sessionCount]);

  const assignedCoach = useMemo(() => {
    return getAssignedCoachForCourse(selectedCourseObj);
  }, [selectedCourseObj]);

  const currentSlotConflict = useMemo(() => {
    return checkScheduleSlotConflict({
      coachName: assignedCoach,
      scheduleStr: formData.preferredSchedule,
      startDate: formData.startDate,
      sessionCount,
      enrollments,
      courtBookings,
      courtId: formData.preferredCourtId
    });
  }, [assignedCoach, formData.preferredSchedule, formData.startDate, sessionCount, enrollments, courtBookings, formData.preferredCourtId]);

  // Item 8: Detect if student already has an active enrollment in this specific course
  const isAlreadyEnrolled = useMemo(() => {
    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanPhone && !cleanEmail) return false;
    return enrollments.some(
      (enr) =>
        enr.courseId === selectedCourseObj.id &&
        enr.status !== 'cancelled' &&
        ((cleanPhone && enr.studentPhone?.replace(/\s+/g, '') === cleanPhone) ||
          (cleanEmail && enr.studentEmail?.toLowerCase() === cleanEmail))
    );
  }, [enrollments, selectedCourseObj.id, formData.phone, formData.email]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Strict Validation Function
  const validateField = (name, value) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';

    switch (name) {
      case 'fullName':
        if (!trimmed) return 'Vui lòng nhập Họ và tên học viên (không được để trống).';
        if (trimmed.length < 3) return 'Họ và tên phải có ít nhất 3 ký tự.';
        if (/\d/.test(trimmed)) return 'Họ và tên không được chứa chữ số.';
        return '';

      case 'phone': {
        if (!trimmed) return 'Vui lòng nhập Số điện thoại liên hệ (không được để trống).';
        const cleanPhone = trimmed.replace(/\s+/g, '');
        const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (!vnPhoneRegex.test(cleanPhone)) {
          return 'Số điện thoại không đúng định dạng Việt Nam (VD hợp lệ: 0901234567 hoặc 0987654321).';
        }
        return '';
      }

      case 'email': {
        if (!trimmed) return 'Vui lòng nhập địa chỉ Email nhận lịch học (không được để trống).';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return 'Địa chỉ Email không đúng định dạng (VD hợp lệ: hocvien@gmail.com).';
        }
        return '';
      }

      case 'courseId':
        if (!value) return 'Vui lòng chọn một khóa học muốn đăng ký.';
        return '';

      case 'preferredSchedule':
        if (!trimmed) return 'Vui lòng chọn hoặc đề xuất một khung giờ học mong muốn.';
        if (trimmed.length < 5) return 'Khung giờ học quá ngắn, vui lòng chọn ca cụ thể.';
        return '';

      case 'notes':
        if (value && value.length > 500) return 'Ghi chú tối đa 500 ký tự.';
        return '';

      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    ['fullName', 'phone', 'email', 'courseId', 'preferredSchedule', 'notes'].forEach((field) => {
      const errMsg = validateField(field, formData[field]);
      if (errMsg) newErrors[field] = errMsg;
    });
    setErrors(newErrors);
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      courseId: true,
      preferredSchedule: true,
      notes: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'courseId') {
        const foundCourse = courses.find((c) => c.id === value);
        if (foundCourse) {
          updated.preferredSchedule = foundCourse.schedule;
          updated.coachName = getAssignedCoachForCourse(foundCourse);
        }
      }
      return updated;
    });

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Item 8: Prevent duplicate active enrollment for the same student on the same course
    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    const cleanEmail = formData.email.trim().toLowerCase();
    const existingEnrollment = enrollments.find(
      (enr) =>
        enr.courseId === selectedCourseObj.id &&
        enr.status !== 'cancelled' &&
        (enr.studentPhone?.replace(/\s+/g, '') === cleanPhone ||
          enr.studentEmail?.toLowerCase() === cleanEmail)
    );

    if (existingEnrollment) {
      alert(
        `Thông báo trùng ghi danh (Lỗi số 8):\n` +
        `Học viên ${formData.fullName.trim()} (SĐT: ${formData.phone.trim()}) hiện ĐÃ ĐĂNG KÝ khóa học "${selectedCourseObj.title}" (Mã hồ sơ: #${existingEnrollment.id}) và lớp học đang diễn ra.\n\n` +
        `Bạn không cần đăng ký lại. Vui lòng vào trang "Hồ Sơ Cá Nhân" để xem lịch học hoặc liên hệ Giáo vụ nếu cần đổi ca!`
      );
      setErrors((prev) => ({
        ...prev,
        courseId: 'Học viên này đã ghi danh khóa học này rồi và hồ sơ đang hoạt động.'
      }));
      return;
    }

    if (currentSlotConflict.hasConflict) {
      const confirmProceed = window.confirm(
        `Cảnh báo trùng lịch ca dạy:\n${currentSlotConflict.reason}\n\nBạn có muốn tiếp tục gửi đăng ký không? Giáo vụ học viện sẽ chủ động liên hệ để hỗ trợ điều phối lịch học tối ưu cho bạn.`
      );
      if (!confirmProceed) return;
    }

    const newEnrollment = {
      id: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: formData.fullName.trim(),
      studentPhone: formData.phone.trim(),
      studentEmail: formData.email.trim(),
      courseId: selectedCourseObj.id,
      courseTitle: selectedCourseObj.title,
      coachName: formData.coachName || assignedCoach || selectedCourseObj.coach || 'Chưa phân công',
      courtId: selectedCourtObj.id,
      courtName: selectedCourtObj.name,
      preferredCourtId: selectedCourtObj.id,
      tuition: selectedCourseObj.tuition,
      preferredSchedule: formData.preferredSchedule,
      startDate: calculatedDates.startDate,
      expectedEndDate: calculatedDates.expectedEndDate,
      sessionDates: calculatedDates.sessionDates,
      totalSessions: sessionCount,
      attendedSessions: 0,
      absentSessions: 0,
      remainingSessions: sessionCount,
      sessionsList: Array(sessionCount).fill('pending'),
      duprEvaluation: 'Chưa đánh giá',
      coachFeedback: 'Học viên chuẩn bị bắt đầu buổi học đầu tiên.',
      experienceLevel: formData.experienceLevel,
      notes: formData.notes.trim() || 'Không có ghi chú thêm',
      status: 'confirmed',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    onAddEnrollment(newEnrollment);
    setSubmittedRecord(newEnrollment);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Page Header */}
        <div className="vp-page-header rounded-4 p-4 p-lg-5 mb-4 text-white shadow-sm">
          <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-2">
            GHI DANH TRỰC TUYẾN NHANH CHÓNG
          </span>
          <h1 className="fw-extrabold mb-2">Đăng Ký Khóa Học Pickleball</h1>
          <p className="text-white-75 mb-0">
            Điền thông tin vào biểu mẫu bên dưới để giữ chỗ lớp học và nhận lịch kiểm tra trình độ DUPR miễn phí cùng Huấn luyện viên.
          </p>
        </div>

        <div className="row g-4">
          {/* Left Column: Registration Form with Full Validation */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              {submittedRecord ? (
                <div className="text-center py-4">
                  <div
                    className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                    style={{ width: '72px', height: '72px' }}
                  >
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="fw-extrabold text-success mb-2">
                    Đăng Ký Khóa Học Thành Công!
                  </h3>
                  <p className="text-secondary mb-4">
                    Mã hồ sơ ghi danh của bạn là <strong>#{submittedRecord.id}</strong>. Bộ phận Giáo vụ Học viện sẽ liên hệ qua số điện thoại <strong>{submittedRecord.studentPhone}</strong> trong vòng 15 phút để xác nhận lịch lên sân.
                  </p>

                  <div className="bg-light rounded-4 p-4 text-start mb-4 border">
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                      📋 Chi Tiết Phiếu Đăng Ký Học Viên
                    </h6>
                    <div className="row g-2 small">
                      <div className="col-sm-4 text-secondary">Họ và tên học viên:</div>
                      <div className="col-sm-8 fw-bold text-dark">{submittedRecord.studentName}</div>

                      <div className="col-sm-4 text-secondary">Số điện thoại:</div>
                      <div className="col-sm-8 fw-bold text-dark">{submittedRecord.studentPhone}</div>

                      <div className="col-sm-4 text-secondary">Địa chỉ Email:</div>
                      <div className="col-sm-8 fw-bold text-dark">{submittedRecord.studentEmail}</div>

                      <div className="col-sm-4 text-secondary">Khóa học đăng ký:</div>
                      <div className="col-sm-8 fw-bold text-success">{submittedRecord.courseTitle}</div>

                      <div className="col-sm-4 text-secondary">Lịch học dự kiến:</div>
                      <div className="col-sm-8 text-dark">{submittedRecord.preferredSchedule}</div>

                      <div className="col-sm-4 text-secondary">Ngày bắt đầu học:</div>
                      <div className="col-sm-8 fw-bold text-dark">
                        📅 {submittedRecord.startDate}
                      </div>

                      <div className="col-sm-4 text-secondary">Ngày kết thúc dự kiến:</div>
                      <div className="col-sm-8 fw-bold text-success">
                        🏁 {submittedRecord.expectedEndDate} ({submittedRecord.totalSessions} buổi)
                      </div>

                      <div className="col-sm-4 text-secondary">HLV phụ trách dự kiến:</div>
                      <div className="col-sm-8 fw-bold text-dark">
                        👤 {submittedRecord.coachName || 'Chưa phân công'}
                      </div>

                      <div className="col-sm-4 text-secondary">Sân tập phân bổ:</div>
                      <div className="col-sm-8 fw-bold text-primary">
                        🏟️ {submittedRecord.courtName || 'Sân Huấn Luyện #3'} (Đã tự động giữ sân toàn khóa)
                      </div>

                      <div className="col-sm-4 text-secondary">Học phí trọn khóa:</div>
                      <div className="col-sm-8 fw-extrabold text-danger">
                        {formatVND(submittedRecord.tuition)}
                      </div>

                      <div className="col-sm-4 text-secondary">Ghi chú của học viên:</div>
                      <div className="col-sm-8 text-dark">{submittedRecord.notes || 'Không có'}</div>
                    </div>
                  </div>

                  <div className="alert alert-success d-flex align-items-center gap-2 small text-start mb-4 rounded-3 border-0 shadow-xs">
                    <ShieldCheck size={22} className="text-success flex-shrink-0" />
                    <div>
                      <strong>Đặc quyền khóa học trọn gói:</strong> Học phí đã bao gồm tiền thuê sân và bóng tập. Học viện đã tự động giữ sân tại <strong>{submittedRecord.courtName || 'Sân Huấn Luyện #3'}</strong> cố định theo ca học bạn đã chọn, học viên không cần phải tự đặt sân!
                    </div>
                  </div>

                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedRecord(null)}
                      className="btn btn-outline-dark fw-semibold px-4"
                    >
                      Đăng ký thêm học viên khác
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('courts')}
                      className="btn vp-btn-lime fw-bold px-4"
                    >
                      Khám phá Đặt sân tập →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                    <div>
                      <h4 className="fw-extrabold text-dark mb-1">Biểu Mẫu Ghi Danh Học Viên</h4>
                      <small className="text-secondary">
                        Các trường đánh dấu <span className="text-danger fw-bold">*</span> là thông tin bắt buộc
                      </small>
                    </div>
                    <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                      Cam Kết Giữ Chỗ 100%
                    </span>
                  </div>

                  {/* 1. Họ và tên */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark small">
                      1. Họ và tên học viên <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <User size={18} className="text-secondary" />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Nhập đầy đủ họ và tên (VD: Nguyễn Văn An)"
                        className={`form-control ${
                          touched.fullName
                            ? errors.fullName
                              ? 'is-invalid'
                              : 'is-valid'
                            : ''
                        }`}
                      />
                    </div>
                    {touched.fullName && errors.fullName && (
                      <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                        <AlertCircle size={14} />
                        <span>{errors.fullName}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Số điện thoại & 3. Email */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">
                        2. Số điện thoại di động <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Phone size={18} className="text-secondary" />
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="VD: 0901234567"
                          className={`form-control ${
                            touched.phone ? (errors.phone ? 'is-invalid' : 'is-valid') : ''
                          }`}
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">
                        3. Địa chỉ Email <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <Mail size={18} className="text-secondary" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="VD: hocvien@gmail.com"
                          className={`form-control ${
                            touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''
                          }`}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Khóa học muốn đăng ký */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark small">
                      4. Chọn khóa học muốn đăng ký <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <BookOpen size={18} className="text-secondary" />
                      </span>
                      <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-select fw-semibold"
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} — {formatVND(course.tuition)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Chọn Huấn luyện viên phụ trách */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-bold text-dark small mb-0">
                        Huấn luyện viên phụ trách lớp <span className="text-danger">*</span>
                      </label>
                      <span className="badge bg-primary-subtle text-primary fw-semibold" style={{ fontSize: '0.72rem' }}>
                        Tự do chọn HLV yêu thích
                      </span>
                    </div>
                    <select
                      name="coachName"
                      value={formData.coachName || assignedCoach}
                      onChange={handleChange}
                      className="form-select fw-semibold"
                    >
                      <option value="HLV Vũ Minh Quân">HLV Vũ Minh Quân — Chuẩn hóa Footwork & Khối Cơ bản (DUPR 4.65)</option>
                      <option value="HLV Sarah Jenkins">HLV Sarah Jenkins — IPTPA Master Instructor, VIP 1 Kèm 1 & Kỹ thuật Dinking (DUPR 5.00)</option>
                      <option value="HLV Nguyễn Hoàng Nam">HLV Nguyễn Hoàng Nam — Cựu VĐV Quốc gia, Nâng cao & Chiến thuật Match Play (DUPR 5.15)</option>
                      <option value="HLV Lê Phương Thảo">HLV Lê Phương Thảo — Chuyên gia Phái đẹp & Trại huấn luyện Thiếu nhi (DUPR 4.50)</option>
                    </select>
                  </div>

                  {/* Trình độ hiện tại */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small">
                      5. Trình độ Pickleball hiện tại của bạn
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Người mới bắt đầu (Chưa từng chơi)">
                        Người mới bắt đầu (Chưa từng cầm vợt)
                      </option>
                      <option value="Đã từng chơi Tennis / Cầu lông / Bóng bàn">
                        Đã từng chơi Tennis / Cầu lông / Bóng bàn
                      </option>
                      <option value="Đã chơi Pickleball 1-3 tháng (DUPR ~2.5)">
                        Đã chơi Pickleball 1-3 tháng (DUPR ~2.5)
                      </option>
                      <option value="Trình độ Trung cấp / Nâng cao (DUPR 3.25+)">
                        Trình độ Trung cấp / Nâng cao (DUPR 3.25+)
                      </option>
                    </select>
                  </div>

                  {/* 6. PHÂN KHUNG GIỜ HỌC VIÊN CHUYÊN NGHIỆP */}
                  <div className="mb-4 p-3 p-md-4 bg-light rounded-4 border">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                      <div>
                        <label className="form-label fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
                          <Clock size={18} className="text-success" />
                          <span>6. Chọn Khung Giờ & Ca Học Phù Hợp <span className="text-danger">*</span></span>
                        </label>
                        <small className="text-secondary d-block">
                          Chọn ca học phù hợp với thời gian biểu của bạn (hoặc tự đề xuất ca riêng)
                        </small>
                      </div>
                      <span className="badge bg-success-subtle text-success fw-bold">
                        Sĩ số giới hạn 6-8 HV/sân
                      </span>
                    </div>

                    {/* Category Filter Pills for Time Slots */}
                    <div className="d-flex flex-wrap gap-2 my-3">
                      <button
                        type="button"
                        onClick={() => {
                          setScheduleCategory('all');
                          setIsCustomSchedule(false);
                        }}
                        className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                          scheduleCategory === 'all' && !isCustomSchedule
                            ? 'vp-btn-lime shadow-sm'
                            : 'btn-white bg-white border text-secondary'
                        }`}
                      >
                        Tất cả ca học
                      </button>
                      {TIME_SLOT_GROUPS.map((group) => {
                        const Icon = group.icon;
                        const active = scheduleCategory === group.id && !isCustomSchedule;
                        return (
                          <button
                            key={group.id}
                            type="button"
                            onClick={() => {
                              setScheduleCategory(group.id);
                              setIsCustomSchedule(false);
                            }}
                            className={`btn btn-sm rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 ${
                              active
                                ? 'vp-btn-lime shadow-sm'
                                : 'btn-white bg-white border text-secondary'
                            }`}
                          >
                            <Icon size={14} />
                            <span>{group.label}</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSchedule(true);
                          setScheduleCategory('');
                        }}
                        className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                          isCustomSchedule
                            ? 'vp-btn-lime shadow-sm'
                            : 'btn-white bg-white border text-secondary'
                        }`}
                      >
                        ✍️ Tự đề xuất ca riêng
                      </button>
                    </div>

                    {/* Banner Phân Công HLV Chuyên Môn */}
                    <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary-subtle mb-3">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div>
                          <span className="badge bg-primary text-white mb-1" style={{ fontSize: '0.68rem' }}>
                            HUẤN LUYỆN VIÊN PHỤ TRÁCH KHỐI LỚP
                          </span>
                          <h6 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
                            <User size={18} className="text-primary" />
                            <span>{assignedCoach}</span>
                          </h6>
                        </div>
                        <span className="badge bg-white text-primary border border-primary-subtle px-3 py-2 fw-bold" style={{ fontSize: '0.72rem' }}>
                          ✓ Phân công chuyên môn tự động
                        </span>
                      </div>
                    </div>

                    {/* Time Slot Cards Grid Với Kiểm Tra Trùng Lịch Thời Gian Thực */}
                    {!isCustomSchedule ? (
                      <div className="row g-3">
                        {TIME_SLOT_GROUPS
                          .filter((g) => scheduleCategory === 'all' || scheduleCategory === g.id)
                          .flatMap((g) => g.slots)
                          .map((slot) => {
                            const formattedSlot = `${slot.days} (${slot.time}) • ${slot.label}`;
                            const isSelected =
                              formData.preferredSchedule === formattedSlot ||
                              formData.preferredSchedule.includes(slot.time);

                            const slotConflict = checkScheduleSlotConflict({
                              coachName: assignedCoach,
                              scheduleStr: `${slot.days} (${slot.time})`,
                              startDate: formData.startDate,
                              sessionCount,
                              enrollments,
                              courtBookings
                            });

                            return (
                              <div className="col-md-6" key={slot.id}>
                                <div
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      preferredSchedule: formattedSlot
                                    }));
                                    if (errors.preferredSchedule) {
                                      setErrors((prev) => ({ ...prev, preferredSchedule: '' }));
                                    }
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  className={`card h-100 p-3 rounded-4 transition-all ${
                                    isSelected
                                      ? 'border-2 border-success bg-white shadow'
                                      : slotConflict.hasConflict
                                      ? 'border-warning bg-warning bg-opacity-10'
                                      : 'border bg-white hover-shadow'
                                  }`}
                                >
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                      <Clock size={16} className={isSelected ? 'text-success' : 'text-primary'} />
                                      <span className="fw-bold text-dark small">{slot.days}</span>
                                    </div>
                                    <span
                                      className={`badge rounded-pill ${slot.badgeColor}`}
                                      style={{ fontSize: '0.65rem' }}
                                    >
                                      {slot.badge}
                                    </span>
                                  </div>

                                  <div className="fs-6 fw-extrabold text-success mb-1">
                                    {slot.time}
                                  </div>
                                  <div className="small text-secondary mb-2">{slot.label}</div>

                                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto small">
                                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                      {slotConflict.hasConflict ? (
                                        <span className="text-danger fw-bold d-flex align-items-center gap-1">
                                          <AlertCircle size={12} /> Trùng lịch ca dạy
                                        </span>
                                      ) : (
                                        <span className="text-success fw-bold d-flex align-items-center gap-1">
                                          <Check size={12} /> Sẵn sàng xếp lớp
                                        </span>
                                      )}
                                    </span>
                                    <span
                                      className={`badge ${
                                        slotConflict.hasConflict
                                          ? 'bg-danger-subtle text-danger border border-danger-subtle'
                                          : 'bg-success-subtle text-success border border-success-subtle'
                                      }`}
                                      style={{ fontSize: '0.65rem' }}
                                    >
                                      {slotConflict.hasConflict ? 'Bận lịch' : 'Khả dụng'}
                                    </span>
                                  </div>

                                  {isSelected && (
                                    <div className="mt-2 text-center text-success fw-bold small border-top pt-1">
                                      ✓ Đang chọn ca này
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-3 border">
                        <label className="form-label small fw-bold text-dark">
                          Nhập khung giờ & ngày học riêng bạn mong muốn:
                        </label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="VD: Thứ 4 & Thứ 7 từ 20:00 - 22:00, hoặc sáng Chủ Nhật..."
                          value={customScheduleInput}
                          onChange={(e) => {
                            setCustomScheduleInput(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              preferredSchedule: e.target.value
                            }));
                            if (errors.preferredSchedule) {
                              setErrors((prev) => ({ ...prev, preferredSchedule: '' }));
                            }
                          }}
                        />
                        <small className="text-muted">
                          Bộ phận Giáo vụ sẽ chủ động liên hệ để sắp xếp sân tập & Huấn luyện viên phù hợp nhất với bạn.
                        </small>
                      </div>
                    )}

                    {errors.preferredSchedule && (
                      <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                        <AlertCircle size={15} />
                        <span>{errors.preferredSchedule}</span>
                      </div>
                    )}

                    {/* Currently Selected Schedule Display */}
                    <div className="mt-3 p-2 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                      <div className="small">
                        <span className="text-secondary">Ca học đã chọn: </span>
                        <strong className="text-success">{formData.preferredSchedule}</strong>
                      </div>
                      <span className="badge bg-success-subtle text-success">Đã lưu lựa chọn</span>
                    </div>

                    {currentSlotConflict.hasConflict && (
                      <div className="alert alert-warning rounded-3 p-3 mt-3 mb-0 small d-flex align-items-start gap-2">
                        <AlertCircle size={20} className="text-warning flex-shrink-0 mt-1" />
                        <div>
                          <strong className="text-dark">Cảnh báo trùng lịch ca dạy:</strong> {currentSlotConflict.reason}
                          <div className="text-secondary mt-1">
                            Học viện khuyến nghị chọn ngày bắt đầu khác hoặc chọn các ca có huy hiệu xanh để đảm bảo HLV phục vụ trọn vẹn nhất.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Kế hoạch Ngày Bắt Đầu & Ngày Kết Thúc Dự Kiến */}
                    <div className="mt-3 p-3 bg-white rounded-3 border">
                      <label className="form-label fw-bold text-dark small d-flex align-items-center gap-2 mb-2">
                        <Calendar size={18} className="text-primary" />
                        <span>Kế Hoạch Khởi Đầu & Ngày Kết Thúc Dự Kiến:</span>
                      </label>
                      <div className="row g-2 align-items-center">
                        <div className="col-sm-6">
                          <label className="form-label text-secondary small mb-1">
                            Chọn ngày bắt đầu học *
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-secondary small mb-1">
                            Ngày kết thúc dự kiến
                          </label>
                          <div className="form-control bg-light fw-bold text-success border">
                            🏁 {calculatedDates.expectedEndDate} ({sessionCount} buổi)
                          </div>
                        </div>
                      </div>
                      <small className="text-muted d-block mt-2" style={{ fontSize: '0.75rem' }}>
                        💡 Hệ thống tự động tính {sessionCount} buổi theo ca <strong>{formData.preferredSchedule}</strong> tính từ ngày bắt đầu bạn chọn (không bắt buộc từ đầu tuần).
                      </small>
                    </div>
                  </div>

                  {/* 5. Chọn Sân Tập Mong Muốn (Tự Do Chọn Sân - Không Fix Cứng) */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <label className="form-label fw-bold text-dark small mb-0 d-flex align-items-center gap-2">
                        <span className="badge bg-primary text-white rounded-circle p-1" style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
                        <span>Chọn Sân Tập Mong Muốn (Tự Do Chọn Sân Toàn Khóa) *</span>
                      </label>
                      <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold" style={{ fontSize: '0.72rem' }}>
                        ✓ Học viện tự động giữ sân
                      </span>
                    </div>
                    <p className="text-secondary small mb-3">
                      Học viên có thể tự do lựa chọn cụm sân theo sở thích (Sân VIP Điều hòa, Sân Mái che, Máy bắn bóng Titan...). Học viện sẽ tự động giữ đúng sân bạn chọn trong suốt {sessionCount} buổi học!
                    </p>

                    <div className="row g-3">
                      {availableCourts.map((c) => {
                        const isSelected = formData.preferredCourtId === c.id;
                        return (
                          <div key={c.id} className="col-md-6">
                            <div
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, preferredCourtId: c.id }));
                              }}
                              className={`p-3 rounded-4 border h-100 transition-all ${
                                isSelected
                                  ? 'bg-success bg-opacity-10 border-success shadow-sm'
                                  : 'bg-white border-secondary-subtle hover-shadow-sm'
                              }`}
                              style={{
                                cursor: 'pointer',
                                borderWidth: isSelected ? '2px' : '1px'
                              }}
                            >
                              <div className="d-flex gap-3 align-items-start">
                                <img
                                  src={c.image}
                                  alt={c.name}
                                  className="rounded-3 object-fit-cover shadow-xs"
                                  style={{ width: '70px', height: '70px', flexShrink: 0 }}
                                />
                                <div className="flex-grow-1 overflow-hidden">
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <span className="badge bg-primary-subtle text-primary fw-bold" style={{ fontSize: '0.68rem' }}>
                                      {c.type}
                                    </span>
                                    {isSelected && (
                                      <span className="badge bg-success text-white d-flex align-items-center gap-1 shadow-xs" style={{ fontSize: '0.7rem' }}>
                                        <Check size={12} /> Đang chọn
                                      </span>
                                    )}
                                  </div>
                                  <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: '0.86rem' }} title={c.name}>
                                    {c.name}
                                  </h6>
                                  <div className="text-muted small text-truncate mb-2" style={{ fontSize: '0.73rem' }}>
                                    {c.surface}
                                  </div>
                                  <div className="d-flex flex-wrap gap-1">
                                    {c.amenities && c.amenities.slice(0, 2).map((a, i) => (
                                      <span key={i} className="badge bg-light text-secondary border" style={{ fontSize: '0.65rem' }}>
                                        {a}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 p-2 px-3 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                      <div className="small">
                        <span className="text-secondary">Sân tập đã chọn: </span>
                        <strong className="text-primary">🏟️ {selectedCourtObj.name}</strong>
                      </div>
                      <span className="badge bg-primary-subtle text-primary fw-semibold">Được giữ cố định toàn khóa</span>
                    </div>
                  </div>

                  {/* 6. Ghi chú */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small">
                      6. Ghi chú thêm (Nhu cầu mượn vợt, mục tiêu học tập, học nhóm...)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light align-items-start pt-2">
                        <FileText size={18} className="text-secondary" />
                      </span>
                      <textarea
                        name="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="VD: Mình muốn đăng ký mượn vợt tập của học viện và học thử vào sáng Thứ 7 tuần này..."
                        className={`form-control ${
                          touched.notes && errors.notes ? 'is-invalid' : ''
                        }`}
                      />
                    </div>
                    {touched.notes && errors.notes && (
                      <div className="text-danger small mt-1">{errors.notes}</div>
                    )}
                  </div>

                  {isAlreadyEnrolled && (
                    <div className="alert alert-warning d-flex align-items-center gap-2 small mb-3 rounded-3 border-0 shadow-xs">
                      <AlertCircle size={20} className="text-warning flex-shrink-0" />
                      <div>
                        <strong>Cảnh báo ghi danh trùng:</strong> Bạn (hoặc SĐT/Email này) hiện đã có hồ sơ đang tham gia khóa học này. Hệ thống sẽ chặn tạo trùng để bảo toàn lịch học và tiến độ đào tạo của bạn.
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isAlreadyEnrolled}
                    className={`btn btn-lg w-100 fw-extrabold py-3 shadow-sm ${
                      isAlreadyEnrolled ? 'btn-secondary opacity-50' : 'vp-btn-lime'
                    }`}
                  >
                    {isAlreadyEnrolled ? 'Đã Ghi Danh Khóa Học Này' : 'Xác Nhận Đăng Ký Khóa Học'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Selected Course Summary + Recent Enrollments */}
          <div className="col-lg-5">
            {selectedCourseObj && (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold small text-warning">THÔNG TIN KHÓA HỌC ĐANG CHỌN</span>
                  <span className="badge bg-success">{selectedCourseObj.categoryLabel}</span>
                </div>
                <img
                  src={selectedCourseObj.image}
                  alt={selectedCourseObj.title}
                  className="w-100 object-fit-cover"
                  style={{ height: '180px' }}
                />
                <div className="card-body p-4">
                  <h5 className="fw-extrabold text-dark mb-2">{selectedCourseObj.title}</h5>
                  <p className="text-secondary small mb-3">{selectedCourseObj.summary}</p>

                  <div className="p-3 bg-light rounded-3 small mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Thời lượng khóa học:</span>
                      <strong className="text-dark text-end">{selectedCourseObj.duration}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Huấn luyện viên:</span>
                      <strong className="text-success">{selectedCourseObj.coach}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Lịch học tiêu chuẩn:</span>
                      <strong className="text-dark text-end">{selectedCourseObj.schedule}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Khung giờ bạn chọn:</span>
                      <strong className="text-success text-end text-truncate ms-2" style={{ maxWidth: '220px' }}>
                        {formData.preferredSchedule}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <span className="fw-bold text-dark">Học phí trọn gói:</span>
                      <span className="fs-5 fw-extrabold text-danger">
                        {formatVND(selectedCourseObj.tuition)}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 bg-primary-subtle text-primary rounded-3 small mb-3 border border-primary-subtle d-flex align-items-center gap-2">
                    <ShieldCheck size={18} className="text-primary flex-shrink-0" />
                    <div style={{ fontSize: '0.74rem' }}>
                      <strong>Bao gồm tiền sân trọn gói:</strong> Học viện tự động giữ sân tại <strong>{selectedCourtObj.name}</strong> theo ca học bạn chọn. Không cần tự đặt sân!
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 small text-success fw-semibold">
                    <ShieldCheck size={18} />
                    <span>Cam kết hoàn 100% học phí sau buổi đầu nếu không hài lòng!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Enrollments Live List */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-warning" />
                <span>Danh sách học viên vừa đăng ký gần đây ({enrollments.length})</span>
              </h6>
              <div className="d-flex flex-column gap-2">
                {enrollments.slice(0, 4).map((enr) => (
                  <div
                    key={enr.id}
                    className="p-3 bg-light rounded-3 border-start border-4 border-success small"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark">{enr.studentName}</strong>
                      <span className="badge bg-success-subtle text-success">Đã ghi danh</span>
                    </div>
                    <div className="text-secondary text-truncate">{enr.courseTitle}</div>
                    <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                      🕒 {enr.createdAt} • Lịch: {enr.preferredSchedule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
