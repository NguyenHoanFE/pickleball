export const INITIAL_COURTS = [
  {
    id: 'court-1',
    name: 'Sân Trung Tâm Championship #1 (Indoor Pro)',
    type: 'Indoor VIP (Có điều hòa)',
    surface: 'Thảm Acrylic 9 lớp chuẩn PPA Tour (Chống lóa, giảm chấn khớp gối)',
    pricePerHour: 280000,
    peakPricePerHour: 350000,
    lighting: 'Hệ thống đèn LED chống chói 1000 Lux chuẩn truyền hình',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
    amenities: ['Điều hòa trung tâm', 'Camera AI quay highlight', 'Khán đài 60 chỗ', 'Ghế nghỉ VIP'],
    status: 'available'
  },
  {
    id: 'court-2',
    name: 'Sân Indoor Tiêu Chuẩn #2 (Air-Conditioned)',
    type: 'Indoor VIP (Có điều hòa)',
    surface: 'Thảm Acrylic 9 lớp chuẩn USA Pickleball',
    pricePerHour: 260000,
    peakPricePerHour: 320000,
    lighting: 'Đèn LED chống chói 800 Lux',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
    amenities: ['Điều hòa mát lạnh', 'Bảng điểm lật tay', 'Khu vực khởi động rộng', 'Tủ Locker miễn phí'],
    status: 'available'
  },
  {
    id: 'court-3',
    name: 'Sân Indoor Huấn Luyện #3 (Air-Conditioned)',
    type: 'Indoor VIP (Có điều hòa)',
    surface: 'Thảm Acrylic 9 lớp chuẩn USA Pickleball',
    pricePerHour: 260000,
    peakPricePerHour: 320000,
    lighting: 'Đèn LED chống chói 800 Lux',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    amenities: ['Điều hòa mát lạnh', 'Gương chỉnh động tác', 'Rổ bóng tập 100 quả', 'Phòng tắm nước nóng'],
    status: 'available'
  },
  {
    id: 'court-4',
    name: 'Sân Mái Che Khí Động Học #4 (Covered Roof)',
    type: 'Sân Mái Che Cao Cấp',
    surface: 'Sơn phủ Laykold Cushion Plus 7 lớp đàn hồi cao',
    pricePerHour: 190000,
    peakPricePerHour: 240000,
    lighting: 'Đèn LED chiếu sáng 750 Lux',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80',
    amenities: ['Mái che chống mưa nắng 100%', 'Quạt công nghiệp làm mát', 'Nước uống miễn phí'],
    status: 'available'
  },
  {
    id: 'court-5',
    name: 'Sân Mái Che Kỹ Thuật #5 (Máy Bắn Bóng Titan)',
    type: 'Sân Tập Kỹ Thuật & Thi Đấu',
    surface: 'Sơn phủ Laykold Cushion Plus 7 lớp',
    pricePerHour: 210000,
    peakPricePerHour: 260000,
    lighting: 'Đèn LED chiếu sáng 750 Lux',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    amenities: ['Hỗ trợ thuê máy bắn bóng Titan', 'Rổ 100 bóng tập', 'Mái che thoáng mát'],
    status: 'available'
  },
  {
    id: 'court-6',
    name: 'Sân Giao Lưu Cộng Đồng #6 (Outdoor Breezy)',
    type: 'Sân Mái Che Tiêu Chuẩn',
    surface: 'Sơn phủ Acrylic 7 lớp tiêu chuẩn USAPA',
    pricePerHour: 170000,
    peakPricePerHour: 220000,
    lighting: 'Đèn LED chống lóa 700 Lux',
    image: 'https://images.unsplash.com/photo-1560012057-4372e14c5085?w=800&auto=format&fit=crop&q=80',
    amenities: ['Không gian thoáng đãng', 'Khu vực Cafe & Lounge sát sân', 'Bãi đỗ xe ô tô miễn phí'],
    status: 'available'
  }
];

export const TIME_SLOTS = [
  { id: 'slot-1', time: '06:00 - 07:30', label: 'Ca Sáng Sớm', isPeak: false },
  { id: 'slot-2', time: '07:30 - 09:00', label: 'Ca Sáng', isPeak: false },
  { id: 'slot-3', time: '09:00 - 10:30', label: 'Ca Sáng Muộn', isPeak: false },
  { id: 'slot-4', time: '14:30 - 16:00', label: 'Ca Chiều', isPeak: false },
  { id: 'slot-5', time: '16:00 - 17:30', label: 'Ca Chiều Mát', isPeak: false },
  { id: 'slot-6', time: '17:30 - 19:00', label: 'Giờ Vàng (Peak)', isPeak: true },
  { id: 'slot-7', time: '19:00 - 20:30', label: 'Giờ Vàng (Peak)', isPeak: true },
  { id: 'slot-8', time: '20:30 - 22:00', label: 'Ca Tối', isPeak: true }
];

export const getLocalDateString = (d = new Date()) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const mapScheduleToSlotId = (scheduleStr) => {
  if (!scheduleStr) return 'slot-7';
  const lower = scheduleStr.toLowerCase();
  if (lower.includes('06:00') || lower.includes('06:30')) return 'slot-1';
  if (lower.includes('07:30')) return 'slot-2';
  if (lower.includes('09:00') || lower.includes('09:30')) return 'slot-3';
  if (lower.includes('14:00') || lower.includes('14:30') || lower.includes('15:00')) return 'slot-4';
  if (lower.includes('16:00')) return 'slot-5';
  if (lower.includes('17:30') || lower.includes('18:00') || lower.includes('18:30')) return 'slot-6';
  if (lower.includes('19:00') || lower.includes('19:30') || lower.includes('20:00')) return 'slot-7';
  if (lower.includes('20:30')) return 'slot-8';
  return 'slot-7';
};

const DAY_DEFS = [
  { key: 'cn', index: 0, match: /(chủ nhật|chu nhat|cn|sunday)/i },
  { key: 't2', index: 1, match: /(thứ 2|thứ hai|t2|monday)/i },
  { key: 't3', index: 2, match: /(thứ 3|thứ ba|t3|tuesday)/i },
  { key: 't4', index: 3, match: /(thứ 4|thứ tư|t4|wednesday)/i },
  { key: 't5', index: 4, match: /(thứ 5|thứ năm|t5|thursday)/i },
  { key: 't6', index: 5, match: /(thứ 6|thứ sáu|t6|friday)/i },
  { key: 't7', index: 6, match: /(thứ 7|thứ bảy|t7|saturday)/i }
];

// Phân công HLV chuẩn theo chuyên môn từng khối lớp
export const getAssignedCoachForCourse = (course) => {
  if (!course) return 'HLV Vũ Minh Quân';
  const title = (course.title || '').toLowerCase();
  const category = (course.category || '').toLowerCase();
  const id = (course.id || '').toLowerCase();

  // 1. Khối Thiếu nhi (Kids Junior Camp 6-15 tuổi) & Phái đẹp/Fitness
  if (
    id === 'course-104' ||
    category === 'kids' ||
    title.includes('thiếu nhi') ||
    title.includes('trẻ em') ||
    title.includes('junior') ||
    id === 'course-107' ||
    title.includes('phái đẹp') ||
    title.includes('ladies')
  ) {
    return 'HLV Lê Phương Thảo';
  }

  // 2. Huấn luyện 1 Kèm 1 (VIP Private) & Khóa Cấp tốc Cuối tuần
  if (
    id === 'course-103' ||
    category === 'private' ||
    title.includes('1 kèm 1') ||
    title.includes('private') ||
    id === 'course-106' ||
    title.includes('cấp tốc cuối tuần') ||
    title.includes('weekend')
  ) {
    return 'HLV Sarah Jenkins';
  }

  // 3. Khối Nâng cao & Chiến thuật (Intermediate/Advanced 3.5+, Tournament, Doanh nghiệp)
  if (
    id === 'course-102' ||
    id === 'course-105' ||
    id === 'course-108' ||
    category === 'advanced' ||
    category === 'tournament' ||
    title.includes('nâng cao') ||
    title.includes('chiến thuật') ||
    title.includes('giải đấu') ||
    title.includes('doanh nghiệp')
  ) {
    return 'HLV Nguyễn Hoàng Nam';
  }

  // 4. Khối Cơ bản (Beginner Foundation 2.0 - 3.0)
  return 'HLV Vũ Minh Quân';
};

// Phân tích và kiểm tra trùng giờ giữa 2 khung thời gian
export const parseTimeRangeMinutes = (timeStr) => {
  if (!timeStr) return { start: 0, end: 0 };
  const match = timeStr.match(/(\d{1,2})[:h](\d{2})\s*-\s*(\d{1,2})[:h](\d{2})/i);
  if (!match) return { start: 0, end: 0 };
  const start = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  const end = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
  return { start, end };
};

export const isTimeOverlapping = (timeStr1, timeStr2) => {
  const t1 = parseTimeRangeMinutes(timeStr1);
  const t2 = parseTimeRangeMinutes(timeStr2);
  if (t1.start === 0 && t1.end === 0) return false;
  if (t2.start === 0 && t2.end === 0) return false;
  return Math.max(t1.start, t2.start) < Math.min(t1.end, t2.end);
};

// Kiểm tra xung đột lịch học của HLV và Sân tập trên toàn bộ lộ trình buổi học
export const checkScheduleSlotConflict = ({
  coachName,
  scheduleStr,
  startDate,
  sessionCount = 8,
  enrollments = [],
  courtBookings = [],
  ignoreEnrollmentId = null,
  courtId = null
}) => {
  if (!scheduleStr || !coachName) {
    return { hasConflict: false, conflictingDates: [], reason: '' };
  }

  const { sessionDates } = calculateCourseDates(scheduleStr, startDate, sessionCount);
  const coachClean = coachName.toLowerCase().replace(/^hlv\s+/i, '').trim();

  const conflictingDates = [];
  let coachConflictCount = 0;
  let courtConflictCount = 0;

  sessionDates.forEach((dateStr) => {
    // 1. Kiểm tra xem HLV có bị trùng ca dạy trên ngày này không
    const hasCoachConflictOnDate = courtBookings.some((b) => {
      if (b.status === 'cancelled') return false;
      if (ignoreEnrollmentId && b.enrollmentId === ignoreEnrollmentId) return false;
      if (b.date !== dateStr) return false;
      const bCoachClean = (b.linkedCoachName || '').toLowerCase().replace(/^hlv\s+/i, '').trim();
      const isSameCoach = bCoachClean && (bCoachClean === coachClean || bCoachClean.includes(coachClean) || coachClean.includes(bCoachClean));
      if (!isSameCoach) return false;
      return isTimeOverlapping(scheduleStr, b.time);
    });

    // 2. Kiểm tra sân tập: nếu học viên đã chọn sân mong muốn cụ thể, kiểm tra chính xác sân đó
    let isSelectedCourtBusy = false;
    if (courtId) {
      isSelectedCourtBusy = courtBookings.some((b) => {
        if (b.status === 'cancelled') return false;
        if (ignoreEnrollmentId && b.enrollmentId === ignoreEnrollmentId) return false;
        return b.date === dateStr && b.courtId === courtId && isTimeOverlapping(scheduleStr, b.time);
      });
    } else {
      // Mặc định kiểm tra cụm sân huấn luyện chính
      const isCourt3Busy = courtBookings.some((b) => {
        return b.status !== 'cancelled' && b.date === dateStr && b.courtId === 'court-3' && isTimeOverlapping(scheduleStr, b.time);
      });
      const isCourt2Busy = courtBookings.some((b) => {
        return b.status !== 'cancelled' && b.date === dateStr && b.courtId === 'court-2' && isTimeOverlapping(scheduleStr, b.time);
      });
      isSelectedCourtBusy = isCourt3Busy && isCourt2Busy;
    }

    if (hasCoachConflictOnDate) {
      coachConflictCount++;
      conflictingDates.push(dateStr);
    } else if (isSelectedCourtBusy) {
      courtConflictCount++;
      conflictingDates.push(dateStr);
    }
  });

  const hasConflict = conflictingDates.length > 0;
  let reason = '';
  if (coachConflictCount > 0) {
    reason = `HLV ${coachName} đã có ca dạy khác trùng giờ vào ${coachConflictCount} buổi học trên lịch này.`;
  } else if (courtConflictCount > 0) {
    reason = courtId
      ? `Sân bạn chọn đã có người đặt trước trùng giờ vào ${courtConflictCount} buổi học trên lộ trình này. Bạn có thể chọn sân khác hoặc đổi ca.`
      : `Cụm sân huấn luyện đã có lớp khác đặt kín vào ${courtConflictCount} buổi học trên lịch này.`;
  }

  return {
    hasConflict,
    hasCoachConflict: coachConflictCount > 0,
    hasCourtConflict: courtConflictCount > 0,
    conflictingDates,
    reason
  };
};

export const findScheduleDayIndices = (scheduleStr) => {
  if (!scheduleStr) return [1, 4];
  const matched = [];
  DAY_DEFS.forEach((d) => {
    if (d.match.test(scheduleStr)) matched.push(d.index);
  });
  return matched.length > 0 ? matched : [1, 4];
};

// Tính toán ngày bắt đầu và ngày kết thúc dự kiến theo khung giờ học và ngày khởi hành thực tế
export const calculateCourseDates = (scheduleStr, startDateInput, sessionCount = 8) => {
  const dayIndices = findScheduleDayIndices(scheduleStr);
  let start = new Date();
  if (startDateInput) {
    if (typeof startDateInput === 'string' && startDateInput.includes('/')) {
      const parts = startDateInput.split(' ')[0].split('/');
      if (parts.length === 3) {
        start = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    } else {
      const parsed = new Date(startDateInput);
      if (!isNaN(parsed.getTime())) start = parsed;
    }
  }

  const sessionDates = [];
  for (let i = 0; i < 120 && sessionDates.length < sessionCount; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    if (dayIndices.includes(cur.getDay())) {
      const year = cur.getFullYear();
      const month = String(cur.getMonth() + 1).padStart(2, '0');
      const day = String(cur.getDate()).padStart(2, '0');
      sessionDates.push(`${year}-${month}-${day}`);
    }
  }

  const startDate = sessionDates.length > 0 ? sessionDates[0] : getLocalDateString();
  const expectedEndDate = sessionDates.length > 0 ? sessionDates[sessionDates.length - 1] : startDate;

  return {
    startDate,
    expectedEndDate,
    sessionDates
  };
};

export const generateTrainingBookingsForEnrollment = (
  enrollment,
  courtsList = INITIAL_COURTS,
  slotsList = TIME_SLOTS,
  sessionCount = 8
) => {
  if (!enrollment || !enrollment.preferredSchedule) return [];
  const targetSlotId = mapScheduleToSlotId(enrollment.preferredSchedule);
  const targetSlot = slotsList.find((s) => s.id === targetSlotId) || slotsList[6];

  // Học viên tự do chọn sân mong muốn, không fix cứng; nếu không chọn sẽ ưu tiên Sân #3
  const selectedCourtId = enrollment.courtId || enrollment.preferredCourtId;
  const targetCourt =
    (selectedCourtId && courtsList.find((c) => c.id === selectedCourtId)) ||
    courtsList.find((c) => c.id === 'court-3') ||
    courtsList.find((c) => c.id === 'court-2') ||
    courtsList[0];

  const totalSessions = enrollment.totalSessions || sessionCount;
  const courseDates = (enrollment.sessionDates && enrollment.sessionDates.length >= totalSessions)
    ? {
        startDate: enrollment.startDate || enrollment.sessionDates[0],
        expectedEndDate: enrollment.expectedEndDate || enrollment.sessionDates[enrollment.sessionDates.length - 1],
        sessionDates: enrollment.sessionDates
      }
    : calculateCourseDates(enrollment.preferredSchedule, enrollment.startDate || enrollment.createdAt, totalSessions);

  const bookings = courseDates.sessionDates.map((dateStr, idx) => ({
    id: `TRAIN-${enrollment.id}-${dateStr}`,
    courtId: targetCourt.id,
    courtName: targetCourt.name,
    date: dateStr,
    slotId: targetSlot.id,
    time: targetSlot.time,
    customerName: `Lớp: ${enrollment.studentName}${enrollment.coachName ? ` (HLV ${enrollment.coachName})` : ''}`,
    customerPhone: enrollment.studentPhone,
    customerEmail: enrollment.studentEmail,
    rentPaddleCount: 0,
    rentBallMachine: false,
    totalPrice: 0,
    status: 'confirmed',
    bookingType: 'training_class',
    linkedCourseId: enrollment.courseId,
    linkedCourseTitle: enrollment.courseTitle,
    linkedCoachName: enrollment.coachName || 'Chưa phân công',
    enrollmentId: enrollment.id,
    sessionNumber: idx + 1,
    isStudentPrivilege: true,
    notes: `Lớp đào tạo chính khóa • Buổi ${idx + 1}/${courseDates.sessionDates.length} • Sân chuyên dụng`,
    createdAt: enrollment.createdAt || new Date().toLocaleDateString('vi-VN'),
    isDemo: enrollment.isDemo || false
  }));

  return bookings;
};

const todayDate = getLocalDateString();

export const INITIAL_COURT_BOOKINGS = [
  {
    id: 'CB-1001',
    courtId: 'court-1',
    courtName: 'Sân Trung Tâm Championship #1 (Indoor Pro)',
    date: todayDate,
    slotId: 'slot-6',
    time: '17:30 - 19:00',
    customerName: 'Lê Minh Anh',
    customerPhone: '0987654321',
    customerEmail: 'student@pickleball.edu.vn',
    rentPaddleCount: 2,
    rentBallMachine: false,
    totalPrice: 625000,
    status: 'confirmed',
    createdAt: '09/11/2026 14:20',
    isDemo: true
  },
  {
    id: 'CB-1002',
    courtId: 'court-2',
    courtName: 'Sân Indoor Tiêu Chuẩn #2 (Air-Conditioned)',
    date: todayDate,
    slotId: 'slot-7',
    time: '19:00 - 20:30',
    customerName: 'Phạm Gia Huy',
    customerPhone: '0933445566',
    customerEmail: 'huy.pham@gmail.com',
    rentPaddleCount: 0,
    rentBallMachine: true,
    totalPrice: 630000,
    status: 'confirmed',
    createdAt: '09/11/2026 18:05',
    isDemo: true
  },
  {
    id: 'CB-1003',
    courtId: 'court-4',
    courtName: 'Sân Mái Che Khí Động Học #4 (Covered Roof)',
    date: todayDate,
    slotId: 'slot-2',
    time: '07:30 - 09:00',
    customerName: 'Nguyễn Minh Đức',
    customerPhone: '0908112233',
    customerEmail: 'duc.nguyen@doanhnghiep.vn',
    rentPaddleCount: 4,
    rentBallMachine: false,
    totalPrice: 485000,
    status: 'confirmed',
    createdAt: '10/11/2026 06:45',
    isDemo: true
  },
  {
    id: 'CB-1004',
    courtId: 'court-5',
    courtName: 'Sân Mái Che Kỹ Thuật #5 (Máy Bắn Bóng Titan)',
    date: todayDate,
    slotId: 'slot-5',
    time: '16:00 - 17:30',
    customerName: 'Trần Thanh Tâm',
    customerPhone: '0977889900',
    customerEmail: 'tam.tran@techcorp.vn',
    rentPaddleCount: 1,
    rentBallMachine: true,
    totalPrice: 515000,
    status: 'confirmed',
    createdAt: '10/11/2026 10:15',
    isDemo: true
  },
  {
    id: `TRAIN-ENR-2002-${todayDate}`,
    courtId: 'court-3',
    courtName: 'Sân Indoor Huấn Luyện #3 (Air-Conditioned)',
    date: todayDate,
    slotId: 'slot-7',
    time: '19:00 - 20:30',
    customerName: 'Lớp Đào Tạo: Phạm Gia Huy (HLV Nguyễn Hoàng Nam)',
    customerPhone: '0933445566',
    customerEmail: 'huy.pham@gmail.com',
    rentPaddleCount: 0,
    rentBallMachine: false,
    totalPrice: 0,
    status: 'confirmed',
    bookingType: 'training_class',
    linkedCourseId: 'course-102',
    linkedCourseTitle: 'Làm Chủ Chiến Thuật & Kỹ Thuật Nâng Cao',
    linkedCoachName: 'HLV Nguyễn Hoàng Nam',
    enrollmentId: 'ENR-2002',
    isStudentPrivilege: true,
    notes: 'Lớp đào tạo chính khóa • Hệ thống tự động xếp sân & giữ chỗ',
    createdAt: '03/11/2026 15:45',
    isDemo: true
  }
];
