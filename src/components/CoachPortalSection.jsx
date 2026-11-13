import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Award,
  CheckCircle2,
  Edit3,
  Clock,
  Sparkles,
  PlusCircle,
  Search,
  AlertCircle,
  X,
  Star,
  Check,
  Phone,
  Mail,
  CalendarCheck,
  Grid,
  List,
  History,
  CalendarDays,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  TIME_SLOTS,
  mapScheduleToSlotId,
  calculateCourseDates,
  getLocalDateString
} from '../data/courts';

const DAYS_OF_WEEK = [
  { key: 't2', label: 'Thứ 2', short: 'T2', fullDay: 'Thứ Hai' },
  { key: 't3', label: 'Thứ 3', short: 'T3', fullDay: 'Thứ Ba' },
  { key: 't4', label: 'Thứ 4', short: 'T4', fullDay: 'Thứ Tư' },
  { key: 't5', label: 'Thứ 5', short: 'T5', fullDay: 'Thứ Năm' },
  { key: 't6', label: 'Thứ 6', short: 'T6', fullDay: 'Thứ Sáu' },
  { key: 't7', label: 'Thứ 7', short: 'T7', fullDay: 'Thứ Bảy' },
  { key: 'cn', label: 'Chủ Nhật', short: 'CN', fullDay: 'Chủ Nhật' }
];

const DAY_INDEX_MAP = ['cn', 't2', 't3', 't4', 't5', 't6', 't7'];

const parseScheduleSlots = (scheduleStr) => {
  if (!scheduleStr) {
    return [{ dayKey: 't2', dayLabel: 'Thứ 2', time: '18:30 - 20:30', full: 'Lịch thỏa thuận' }];
  }
  const overallTimeMatch = scheduleStr.match(/(\d{1,2}[:h]\d{2}\s*-\s*\d{1,2}[:h]\d{2})/i);
  const fallbackTime = overallTimeMatch ? overallTimeMatch[1] : 'Theo thỏa thuận';

  const lower = scheduleStr.toLowerCase();
  if (lower.includes('tất cả các ngày') || lower.includes('t2 - cn') || lower.includes('thứ 2 - chủ nhật')) {
    return ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'].map((k, idx) => ({
      dayKey: k,
      dayLabel: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'][idx],
      time: fallbackTime,
      full: scheduleStr
    }));
  }

  const parts = scheduleStr.split(/[&,]/);
  const results = [];
  const dayDefs = [
    { key: 't2', label: 'Thứ 2', match: /(thứ 2|thứ hai|t2|monday)/i },
    { key: 't3', label: 'Thứ 3', match: /(thứ 3|thứ ba|t3|tuesday)/i },
    { key: 't4', label: 'Thứ 4', match: /(thứ 4|thứ tư|t4|wednesday)/i },
    { key: 't5', label: 'Thứ 5', match: /(thứ 5|thứ năm|t5|thursday)/i },
    { key: 't6', label: 'Thứ 6', match: /(thứ 6|thứ sáu|t6|friday)/i },
    { key: 't7', label: 'Thứ 7', match: /(thứ 7|thứ bảy|t7|saturday)/i },
    { key: 'cn', label: 'Chủ Nhật', match: /(chủ nhật|chu nhat|cn|sunday)/i }
  ];

  parts.forEach((p) => {
    const pTimeMatch = p.match(/(\d{1,2}[:h]\d{2}\s*-\s*\d{1,2}[:h]\d{2})/i);
    const pTime = pTimeMatch ? pTimeMatch[1] : fallbackTime;
    dayDefs.forEach((d) => {
      if (d.match.test(p)) {
        results.push({ dayKey: d.key, dayLabel: d.label, time: pTime, full: scheduleStr });
      }
    });
  });

  if (results.length === 0) {
    dayDefs.forEach((d) => {
      if (d.match.test(scheduleStr)) {
        results.push({ dayKey: d.key, dayLabel: d.label, time: fallbackTime, full: scheduleStr });
      }
    });
  }

  if (results.length === 0) {
    results.push({ dayKey: 't2', dayLabel: 'Thứ 2', time: fallbackTime, full: scheduleStr });
  }

  return results;
};

export default function CoachPortalSection({
  courses,
  onUpdateCourse,
  enrollments,
  onUpdateEnrollment,
  courtBookings
}) {
  const { currentUser, login } = useAuth();
  const [activeTab, setActiveTab] = useState('teaching-schedule');
  const [studentScope, setStudentScope] = useState('my-students'); // 'my-students' | 'all'
  const [syllabusScope, setSyllabusScope] = useState('all'); // 'all' | 'my-courses'
  const [searchStudent, setSearchStudent] = useState('');

  // State cho Tab Lịch Đứng Lớp Giảng Dạy (Thời khóa biểu dạng FAP University Schedule)
  const [scheduleScope, setScheduleScope] = useState('my-schedule'); // 'my-schedule' | 'all'
  const [scheduleViewMode, setScheduleViewMode] = useState('matrix'); // 'matrix' (thời khóa biểu FAP) | 'agenda' (danh sách) | 'timeline' (buổi học)
  const [timeHorizonFilter, setTimeHorizonFilter] = useState('all'); // 'all' | 'upcoming' (tương lai) | 'today' (hôm nay) | 'past' (quá khứ)
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [scheduleSearch, setScheduleSearch] = useState('');

  // Helper tính thứ 2 của tuần
  const getMondayDateStr = (dateInput) => {
    const d = new Date(dateInput);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    const yyyy = mon.getFullYear();
    const mm = String(mon.getMonth() + 1).padStart(2, '0');
    const dd = String(mon.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const currentMondayStr = useMemo(() => getMondayDateStr('2026-11-13'), []);
  const [selectedWeekMonday, setSelectedWeekMonday] = useState(currentMondayStr);

  // State cho Form Chấm Điểm & Quản Lý Tiến Độ Học Tập
  const [gradingModalEnr, setGradingModalEnr] = useState(null);
  const [sessionStates, setSessionStates] = useState([]);
  const [todayAttendanceChoice, setTodayAttendanceChoice] = useState('present'); // 'present' | 'absent'
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [gradingForm, setGradingForm] = useState({
    totalSessions: 8,
    attendedSessions: 0,
    absentSessions: 0,
    duprRating: 2.5,
    duprNote: '',
    coachFeedback: '',
    dinkSkill: 4,
    dropSkill: 3,
    serveSkill: 4,
    footworkSkill: 3,
    status: 'confirmed'
  });
  const [gradingErrors, setGradingErrors] = useState({});

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [syllabusForm, setSyllabusForm] = useState({
    schedule: '',
    summary: '',
    syllabusText: ''
  });

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper check: Kiểm tra quyền sở hữu giữa HLV đang đăng nhập và HLV phụ trách lớp/khóa học
  const isCoachOwner = (coachName, courseId) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // Admin có toàn quyền

    let effectiveCoach = coachName;
    if (!effectiveCoach || typeof effectiveCoach !== 'string' || effectiveCoach === 'Chưa phân công' || effectiveCoach.trim() === '') {
      if (courseId) {
        const found = courses.find((c) => c.id === courseId);
        if (found?.coach) {
          effectiveCoach = found.coach;
        }
      }
    }

    if (!effectiveCoach || typeof effectiveCoach !== 'string') return false;
    const targetClean = effectiveCoach.toLowerCase().replace(/^hlv\s+/i, '').trim();
    if (!targetClean || targetClean === 'chưa phân công' || targetClean === 'chưa có' || targetClean === 'null' || targetClean === 'undefined') {
      return false;
    }
    const currentClean = (currentUser.name || '').toLowerCase().replace(/^hlv\s+/i, '').trim();
    if (!currentClean) return false;
    return currentClean === targetClean || currentClean.includes(targetClean) || targetClean.includes(currentClean);
  };

  // Trích xuất và tính toán thông tin tiến độ: Đã học bao nhiêu buổi, còn bao nhiêu buổi, đã nghỉ bao nhiêu buổi
  const getSessionStats = (enr) => {
    let total = enr.totalSessions;
    if (!total) {
      const c = courses.find((crs) => crs.id === enr.courseId);
      const match = c?.duration?.match(/(\d+)\s*buổi/i);
      total = match ? parseInt(match[1], 10) : 8;
    }
    let attended = enr.attendedSessions;
    if (attended === undefined || attended === null) {
      const match = enr.attendance?.match(/^(\d+)/);
      attended = match ? parseInt(match[1], 10) : 0;
    }
    let absent = enr.absentSessions !== undefined && enr.absentSessions !== null ? Number(enr.absentSessions) : 0;
    let remaining = enr.remainingSessions !== undefined ? Number(enr.remainingSessions) : Math.max(0, total - attended);
    const percent = Math.min(100, Math.round((attended / total) * 100));

    return { total, attended, absent, remaining, percent };
  };

  const myCourses = courses.filter((c) => isCoachOwner(c.coach));
  const myEnrollments = enrollments.filter((e) => isCoachOwner(e.coachName, e.courseId));

  // Trích xuất toàn bộ ca dạy từ các hồ sơ đăng ký của học viên
  const allTeachingSessions = useMemo(() => {
    const sessions = [];
    enrollments.forEach((enr) => {
      const isOwner = isCoachOwner(enr.coachName, enr.courseId);
      const parsedSlots = parseScheduleSlots(enr.preferredSchedule);
      const stats = getSessionStats(enr);
      parsedSlots.forEach((slot, idx) => {
        sessions.push({
          uniqueId: `${enr.id}-${slot.dayKey}-${idx}`,
          enrollmentId: enr.id,
          enrollment: enr,
          studentName: enr.studentName,
          studentPhone: enr.studentPhone,
          studentEmail: enr.studentEmail,
          courseId: enr.courseId,
          courseTitle: enr.courseTitle,
          coachName: enr.coachName,
          isOwner,
          dayKey: slot.dayKey,
          dayLabel: slot.dayLabel,
          time: slot.time,
          fullSchedule: enr.preferredSchedule,
          experienceLevel: enr.experienceLevel,
          notes: enr.notes,
          status: enr.status || 'confirmed',
          stats
        });
      });
    });
    return sessions;
  }, [enrollments, currentUser, courses]);

  const myTeachingSessions = useMemo(() => {
    return allTeachingSessions.filter((s) => s.isOwner);
  }, [allTeachingSessions]);

  const todayDateStr = getLocalDateString();

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  // Trích xuất toàn bộ các buổi học cụ thể (Timeline Sessions) theo Ngày - Tháng - Năm (hỗ trợ xem Quá khứ & Tương lai)
  const allTimelineSessions = useMemo(() => {
    const list = [];
    enrollments.forEach((enr) => {
      const isOwner = isCoachOwner(enr.coachName, enr.courseId);
      const stats = getSessionStats(enr);
      const total = stats.total || 8;
      const { sessionDates } = calculateCourseDates(enr.preferredSchedule, enr.startDate, total);
      const parsedSlots = parseScheduleSlots(enr.preferredSchedule);

      sessionDates.forEach((dateStr, idx) => {
        const dateObj = new Date(dateStr);
        const dayIdx = dateObj.getDay();
        const dayLabel = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayIdx];
        const dayKey = DAY_INDEX_MAP[dayIdx];
        const matchedSlot = parsedSlots.find((s) => s.dayKey === dayKey) || parsedSlots[0] || { time: '18:30 - 20:30' };

        let timeStatus = 'future';
        if (dateStr < todayDateStr) {
          timeStatus = 'past';
        } else if (dateStr === todayDateStr) {
          timeStatus = 'today';
        }

        // Trạng thái điểm danh (Present / Absent / Chưa có trạng thái):
        // 1. Tương lai (dateStr > todayDateStr): TUYỆT ĐỐI KHÔNG ĐỂ TRẠNG THÁI (null) - đến ngày học mới điểm danh
        // 2. Hôm nay (dateStr === todayDateStr): Chỉ hiển thị nếu HLV đã bấm điểm danh lưu trong sessionsList
        // 3. Quá khứ (dateStr < todayDateStr): Hiển thị Present (nếu có mặt) hoặc Absent (nếu vắng)
        let sessionAttendanceStatus = null;
        if (dateStr < todayDateStr) {
          if (Array.isArray(enr.sessionsList) && enr.sessionsList[idx]) {
            const recorded = enr.sessionsList[idx];
            if (recorded === 'present') sessionAttendanceStatus = 'present';
            else if (recorded === 'absent') sessionAttendanceStatus = 'absent';
          } else {
            if (idx < (enr.attendedSessions || 0)) {
              sessionAttendanceStatus = 'present';
            } else {
              sessionAttendanceStatus = 'absent';
            }
          }
        } else if (dateStr === todayDateStr) {
          if (Array.isArray(enr.sessionsList) && enr.sessionsList[idx]) {
            const recorded = enr.sessionsList[idx];
            if (recorded === 'present') sessionAttendanceStatus = 'present';
            else if (recorded === 'absent') sessionAttendanceStatus = 'absent';
          }
        } else {
          sessionAttendanceStatus = null;
        }

        const isAttended = sessionAttendanceStatus === 'present';

        // Lấy tên sân tập thực tế do học viên chọn hoặc phân bổ (không fix cứng)
        const courtName =
          enr.courtName ||
          (enr.courtId === 'court-1'
            ? 'Sân Trung Tâm Championship #1 (Indoor Pro)'
            : enr.courtId === 'court-2'
            ? 'Sân Indoor Tiêu Chuẩn #2 (Air-Conditioned)'
            : enr.courtId === 'court-4'
            ? 'Sân Mái Che Khí Động Học #4 (Covered Roof)'
            : enr.courtId === 'court-5'
            ? 'Sân Mái Che Kỹ Thuật #5 (Máy Bắn Bóng Titan)'
            : enr.courtId === 'court-6'
            ? 'Sân Giao Lưu Cộng Đồng #6 (Outdoor Breezy)'
            : 'Sân Indoor Huấn Luyện #3 (Air-Conditioned)');

        const courtShortName =
          enr.courtId === 'court-1'
            ? 'Sân Championship #1'
            : enr.courtId === 'court-2'
            ? 'Sân Tiêu Chuẩn #2'
            : enr.courtId === 'court-4'
            ? 'Sân Mái Che #4'
            : enr.courtId === 'court-5'
            ? 'Sân Kỹ Thuật #5'
            : enr.courtId === 'court-6'
            ? 'Sân Giao Lưu #6'
            : 'Sân Huấn Luyện #3';

        const slotId = mapScheduleToSlotId(matchedSlot.time || enr.preferredSchedule);
        let courseCode = (enr.courseId || '').replace('course-', '').toUpperCase();
        if (enr.courseId === 'course-101') courseCode = 'BAS101';
        if (enr.courseId === 'course-102') courseCode = 'ADV102';
        if (enr.courseId === 'course-103') courseCode = 'VIP103';
        if (enr.courseId === 'course-104') courseCode = 'KID104';
        if (enr.courseId === 'course-105') courseCode = 'TOU105';
        if (enr.courseId === 'course-106') courseCode = 'WEE106';
        if (enr.courseId === 'course-107') courseCode = 'LAD107';
        if (enr.courseId === 'course-108') courseCode = 'COR108';

        const courseShortTitle = (enr.courseTitle || '').split('(')[0].trim();
        const timeFormatted = matchedSlot.time.replace(/[:]/g, 'h').replace(/\s*-\s*/, '-');

        list.push({
          uniqueId: `timeline-${enr.id}-${dateStr}-${idx}`,
          sessionIndex: idx + 1,
          totalSessions: total,
          date: dateStr,
          dateFormatted: formatDisplayDate(dateStr),
          dayLabel,
          dayKey,
          time: matchedSlot.time,
          timeFormatted,
          slotId,
          courtId: enr.courtId || 'court-3',
          courtName,
          courtShortName,
          courseId: enr.courseId,
          courseCode,
          courseTitle: enr.courseTitle,
          courseShortTitle,
          coachName: enr.coachName,
          enrollmentId: enr.id,
          studentName: enr.studentName,
          studentPhone: enr.studentPhone,
          studentEmail: enr.studentEmail,
          isOwner,
          timeStatus,
          isAttended,
          sessionAttendanceStatus,
          experienceLevel: enr.experienceLevel,
          notes: enr.notes,
          enrollmentStatus: enr.status,
          enrollment: enr
        });
      });
    });

    return list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [enrollments, currentUser, courses, todayDateStr]);

  const myTimelineSessions = useMemo(() => {
    return allTimelineSessions.filter((s) => s.isOwner);
  }, [allTimelineSessions]);

  const timelineSource = scheduleScope === 'my-schedule' ? myTimelineSessions : allTimelineSessions;

  // Tuần lễ cho Thời khóa biểu ma trận FAP (Tương lai & Quá khứ)
  const weekOptions = useMemo(() => {
    const today = new Date('2026-11-13');
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const currentMon = new Date(today);
    currentMon.setDate(today.getDate() + diffToMonday);

    const list = [];
    for (let offset = -4; offset <= 6; offset++) {
      const mon = new Date(currentMon);
      mon.setDate(currentMon.getDate() + offset * 7);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);

      const yyyy = mon.getFullYear();
      const mm = String(mon.getMonth() + 1).padStart(2, '0');
      const dd = String(mon.getDate()).padStart(2, '0');
      const monStr = `${yyyy}-${mm}-${dd}`;
      const formatD = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

      list.push({
        mondayStr: monStr,
        label: `${formatD(mon)} Đến ${formatD(sun)}`,
        offset,
        isCurrent: offset === 0,
        isPast: offset < 0,
        isFuture: offset > 0
      });
    }
    return list;
  }, []);

  const currentWeekDays = useMemo(() => {
    const monday = new Date(selectedWeekMonday);
    const days = [];
    const dayLabelsEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayLabelsVn = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    for (let i = 0; i < 7; i++) {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + i);
      const yyyy = cur.getFullYear();
      const mm = String(cur.getMonth() + 1).padStart(2, '0');
      const dd = String(cur.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const isToday = dateStr === todayDateStr;

      days.push({
        dateStr,
        dayIndex: cur.getDay(),
        enLabel: dayLabelsEn[i],
        vnLabel: dayLabelsVn[i],
        displayHeader: `${dayLabelsEn[i]} (${dd}/${mm})`,
        displayDate: `${dd}/${mm}`,
        isToday
      });
    }
    return days;
  }, [selectedWeekMonday, todayDateStr]);

  const weekSessions = useMemo(() => {
    const datesSet = new Set(currentWeekDays.map((d) => d.dateStr));
    return timelineSource.filter((s) => datesSet.has(s.date));
  }, [timelineSource, currentWeekDays]);

  const handlePrevWeek = () => {
    const d = new Date(selectedWeekMonday);
    d.setDate(d.getDate() - 7);
    setSelectedWeekMonday(getMondayDateStr(d));
  };

  const handleNextWeek = () => {
    const d = new Date(selectedWeekMonday);
    d.setDate(d.getDate() + 7);
    setSelectedWeekMonday(getMondayDateStr(d));
  };

  const handleJumpToCurrentWeek = () => {
    setSelectedWeekMonday(currentMondayStr);
  };

  const countPast = useMemo(() => timelineSource.filter((s) => s.timeStatus === 'past').length, [timelineSource]);
  const countToday = useMemo(() => timelineSource.filter((s) => s.timeStatus === 'today').length, [timelineSource]);
  const countUpcoming = useMemo(() => timelineSource.filter((s) => s.timeStatus === 'future' || s.timeStatus === 'today').length, [timelineSource]);
  const countTotal = timelineSource.length;

  const displayedTimelineSessions = useMemo(() => {
    return timelineSource.filter((s) => {
      if (timeHorizonFilter === 'upcoming' && s.timeStatus !== 'future' && s.timeStatus !== 'today') return false;
      if (timeHorizonFilter === 'past' && s.timeStatus !== 'past') return false;
      if (timeHorizonFilter === 'today' && s.timeStatus !== 'today') return false;
      if (selectedDayFilter !== 'all' && s.dayKey !== selectedDayFilter) return false;
      if (scheduleSearch) {
        const q = scheduleSearch.toLowerCase().trim();
        const matchName = s.studentName.toLowerCase().includes(q);
        const matchPhone = s.studentPhone.includes(q);
        const matchCourse = s.courseTitle.toLowerCase().includes(q);
        const matchDate = s.date.includes(q) || s.dateFormatted.includes(q);
        if (!matchName && !matchPhone && !matchCourse && !matchDate) return false;
      }
      return true;
    });
  }, [timelineSource, timeHorizonFilter, selectedDayFilter, scheduleSearch]);

  const todayDayKey = DAY_INDEX_MAP[new Date().getDay()];
  const todayDayLabel = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][new Date().getDay()];
  const todayMySessions = useMemo(() => {
    return myTeachingSessions.filter((s) => s.dayKey === todayDayKey);
  }, [myTeachingSessions, todayDayKey]);

  const displayedSessions = useMemo(() => {
    const source = scheduleScope === 'my-schedule' ? myTeachingSessions : allTeachingSessions;
    return source.filter((s) => {
      if (selectedDayFilter !== 'all' && s.dayKey !== selectedDayFilter) return false;
      if (scheduleSearch) {
        const q = scheduleSearch.toLowerCase().trim();
        const matchName = s.studentName.toLowerCase().includes(q);
        const matchPhone = s.studentPhone.includes(q);
        const matchCourse = s.courseTitle.toLowerCase().includes(q);
        const matchTime = s.time.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCourse && !matchTime) return false;
      }
      return true;
    });
  }, [scheduleScope, myTeachingSessions, allTeachingSessions, selectedDayFilter, scheduleSearch]);

  const filteredEnrollments = enrollments
    .filter((e) => {
      if (studentScope === 'my-students') {
        return isCoachOwner(e.coachName, e.courseId);
      }
      return true;
    })
    .filter(
      (e) =>
        e.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
        e.courseTitle.toLowerCase().includes(searchStudent.toLowerCase()) ||
        e.studentPhone.includes(searchStudent)
    );

  const displayedCourses = courses.filter((c) => {
    if (syllabusScope === 'my-courses') {
      return isCoachOwner(c.coach);
    }
    return true;
  });

  const openGradingModal = (enr) => {
    if (!enr) return;
    if (!isCoachOwner(enr.coachName, enr.courseId)) {
      alert('Bạn không được phân công phụ trách học viên này! Chỉ Huấn luyện viên được phân công chính thức mới có quyền điểm danh.');
      return;
    }
    const stats = getSessionStats(enr);
    const total = Math.max(1, stats.total || 8);
    let parsedDupr = 2.5;
    if (enr.duprRating) {
      parsedDupr = Number(enr.duprRating);
    } else if (enr.duprEvaluation) {
      const match = enr.duprEvaluation.match(/DUPR\s*([0-9.]+)/i);
      if (match) parsedDupr = parseFloat(match[1]);
    }

    // Khởi tạo danh sách trạng thái từng buổi học (present | absent | pending)
    let initialSessions = [];
    if (Array.isArray(enr.sessionsList) && enr.sessionsList.length === total) {
      initialSessions = [...enr.sessionsList];
    } else {
      const att = Math.min(total, stats.attended || 0);
      const abs = Math.min(total - att, stats.absent || 0);
      for (let i = 0; i < total; i++) {
        if (i < att) {
          initialSessions.push('present');
        } else if (i < att + abs) {
          initialSessions.push('absent');
        } else {
          initialSessions.push('pending');
        }
      }
    }

    // Chỉ điểm danh buổi hiện tại: tìm buổi 'pending' đầu tiên trong khóa học
    const curIdx = initialSessions.findIndex((s) => s === 'pending');

    setGradingModalEnr(enr);
    setSessionStates(initialSessions);
    setCurrentSessionIndex(curIdx);
    setTodayAttendanceChoice('present');
    setGradingErrors({});
    setGradingForm({
      totalSessions: total,
      duprRating: parsedDupr || 2.5,
      coachFeedback:
        enr.coachFeedback ||
        (curIdx !== -1
          ? `Buổi ${curIdx + 1}: Học viên có mặt đầy đủ, hoàn thành tốt giáo án bài tập.`
          : 'Học viên đã hoàn thành xuất sắc toàn bộ khóa học.'),
      status: enr.status || 'confirmed'
    });
  };

  // Huấn luyện viên chỉ tích chọn Có mặt (Present) hoặc Vắng mặt (Absent) cho buổi hiện tại
  const handleSelectTodayChoice = (choice) => {
    setTodayAttendanceChoice(choice);
  };

  const handleSaveGrading = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!gradingModalEnr) return;

    const total = Math.max(1, sessionStates.length || Number(gradingForm.totalSessions) || 8);
    const updatedSessions = [...sessionStates];

    // Chỉ cập nhật trạng thái cho buổi hiện tại duy nhất hôm nay
    if (currentSessionIndex >= 0 && currentSessionIndex < total) {
      updatedSessions[currentSessionIndex] = todayAttendanceChoice;
    }

    const attended = updatedSessions.filter((s) => s === 'present').length;
    const absent = updatedSessions.filter((s) => s === 'absent').length;
    const remaining = Math.max(0, total - (attended + absent));
    const duprNum = parseFloat(gradingForm.duprRating) || 2.5;
    const dupr = duprNum.toFixed(2);

    let duprLevelLabel = 'Beginner 2.0 - 2.99';
    if (duprNum >= 4.0) duprLevelLabel = 'Advanced / Thi đấu 4.0+';
    else if (duprNum >= 3.5) duprLevelLabel = 'Intermediate Vững 3.5+';
    else if (duprNum >= 3.0) duprLevelLabel = 'Intermediate Sơ Khởi 3.0+';

    const duprEvaluation = `DUPR ${dupr} (${duprLevelLabel})`;

    let newStatus = gradingForm.status || 'confirmed';
    if (attended + absent >= total && newStatus === 'confirmed') {
      newStatus = 'completed';
    }

    const feedback =
      (gradingForm.coachFeedback || '').trim() ||
      (currentSessionIndex !== -1
        ? (todayAttendanceChoice === 'present'
            ? `Buổi ${currentSessionIndex + 1}: Học viên có mặt đầy đủ, tiếp thu tốt kỹ thuật và giáo án.`
            : `Buổi ${currentSessionIndex + 1}: Học viên xin phép vắng mặt, học viện sẽ hỗ trợ sắp xếp lịch học bù.`)
        : 'Học viên hoàn thành khóa học.');

    const updatedData = {
      totalSessions: total,
      attendedSessions: attended,
      absentSessions: absent,
      remainingSessions: remaining,
      sessionsList: updatedSessions,
      attendance: `${attended}/${total} buổi (Còn ${remaining}, Nghỉ ${absent})`,
      duprRating: parseFloat(dupr),
      duprEvaluation,
      coachFeedback: feedback,
      status: newStatus
    };

    onUpdateEnrollment(gradingModalEnr.id, updatedData);
    setGradingModalEnr(null);
  };

  const startEditSyllabus = (course) => {
    if (!isCoachOwner(course.coach)) {
      alert('Bạn chỉ có quyền chỉnh sửa giáo trình của khóa học do chính mình phụ trách!');
      return;
    }
    setEditingCourseId(course.id);
    setSyllabusForm({
      schedule: course.schedule,
      summary: course.summary,
      syllabusText: (course.syllabus || []).join('\n')
    });
  };

  const saveSyllabus = (courseId) => {
    const courseToEdit = courses.find((c) => c.id === courseId);
    if (!isCoachOwner(courseToEdit?.coach)) {
      alert('Bạn chỉ có quyền chỉnh sửa giáo trình của khóa học do chính mình phụ trách!');
      return;
    }
    const updatedSyllabus = syllabusForm.syllabusText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdateCourse(courseId, {
      schedule: syllabusForm.schedule,
      summary: syllabusForm.summary,
      syllabus: updatedSyllabus
    });
    setEditingCourseId(null);
  };

  // Item 11: Direct Guard preventing non-coach access
  if (currentUser?.role !== 'coach' && currentUser?.role !== 'admin') {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="card p-5 shadow-sm rounded-4 border-0 text-center" style={{ maxWidth: '480px' }}>
          <div className="bg-warning-subtle text-warning rounded-circle p-3 d-inline-flex mb-3 mx-auto">
            <GraduationCap size={48} />
          </div>
          <h4 className="fw-bold text-dark mb-2">Không Gian Huấn Luyện Viên</h4>
          <p className="text-secondary small mb-4">
            Trang này chỉ dành riêng cho Huấn luyện viên (Coach) của Học viện. Vui lòng đăng nhập tài khoản HLV để vào lớp dạy.
          </p>
          <a href="#home" className="btn btn-dark rounded-pill fw-bold px-4">
            Về Trang Chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container">
        {/* Coach Dedicated Banner */}
        <div
          className="rounded-4 p-4 p-lg-5 mb-4 text-white shadow-sm"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' }}
        >
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <span className="badge bg-info text-dark fw-bold px-3 py-2 rounded-pill mb-2">
                KÊNH CHUYÊN MÔN HUẤN LUYỆN VIÊN • COACH WORKSPACE
              </span>
              <h2 className="fw-extrabold mb-1">
                Xin chào, {currentUser?.name || 'Huấn Luyện Viên'}!
              </h2>
              <p className="text-white-75 mb-0 small">
                Quản lý lớp dạy, điểm danh chuyên cần, chấm điểm xếp hạng DUPR và cập nhật giáo trình đào tạo cho học viên.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="d-inline-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4">
                <Award size={34} className="text-warning" />
                <div className="text-start">
                  <div className="fw-bold">{currentUser?.level || 'PPR Certified Pro'}</div>
                  <small className="text-white-50">Chứng nhận Đào tạo Quốc tế</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Switcher across 4 Coaches for easy testing */}
        <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2 small">
            <span className="badge bg-primary text-white">Chuyển đổi HLV test</span>
            <span className="text-secondary">Đang đăng nhập:</span>
            <strong className="text-dark">{currentUser?.name}</strong>
            <span className="text-muted">({currentUser?.email})</span>
          </div>
          <div className="d-flex flex-wrap gap-1">
            {[
              { email: 'coach@pickleball.edu.vn', name: 'HLV Nam (Nâng cao)' },
              { email: 'sarah.coach@pickleball.edu.vn', name: 'HLV Sarah (1 Kèm 1)' },
              { email: 'quan.coach@pickleball.edu.vn', name: 'HLV Quân (Cơ bản)' },
              { email: 'thao.coach@pickleball.edu.vn', name: 'HLV Thảo (Trẻ em)' }
            ].map((c) => (
              <button
                key={c.email}
                type="button"
                onClick={() => login(c.email, 'Coach@123')}
                className={`btn btn-sm py-1 px-2 fw-semibold ${
                  currentUser?.email === c.email
                    ? 'btn-dark shadow-sm'
                    : 'btn-outline-secondary'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state hint banner if this coach currently has 0 assigned enrollments */}
        {myEnrollments.length === 0 && (
          <div className="alert alert-info rounded-4 p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-xs">
            <div className="d-flex align-items-center gap-2 small">
              <AlertCircle size={20} className="text-info flex-shrink-0" />
              <div>
                <strong>Gợi ý tra cứu học viên:</strong> <strong>{currentUser?.name?.startsWith('HLV ') ? currentUser?.name : `HLV ${currentUser?.name}`}</strong> hiện chưa có học viên nào trong lớp mình phụ trách.
                {currentUser?.email === 'coach@pickleball.edu.vn' && (
                  <span> Khóa học <strong>Huấn Luyện 1 Kèm 1</strong> do <strong>HLV Sarah Jenkins</strong> phụ trách.</span>
                )}
              </div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('students');
                  setStudentScope('all');
                }}
                className="btn btn-sm btn-primary fw-bold"
              >
                Xem tất cả {enrollments.length} học viên toàn trường
              </button>
              {currentUser?.email !== 'sarah.coach@pickleball.edu.vn' && (
                <button
                  type="button"
                  onClick={() => login('sarah.coach@pickleball.edu.vn', 'Coach@123')}
                  className="btn btn-sm btn-outline-dark fw-bold"
                >
                  Chuyển sang HLV Sarah Jenkins
                </button>
              )}
            </div>
          </div>
        )}

        {/* Coach KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="text-primary small fw-bold">HỌC VIÊN LỚP CỦA BẠN</div>
              <div className="fs-3 fw-extrabold text-dark">{myEnrollments.length} học viên</div>
              <small className="text-secondary">Trên tổng {enrollments.length} HV toàn học viện</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="text-success small fw-bold">KHÓA HỌC PHỤ TRÁCH</div>
              <div className="fs-3 fw-extrabold text-dark">{myCourses.length} khóa học</div>
              <small className="text-secondary">Trên tổng {courses.length} khóa đào tạo</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="text-danger small fw-bold">LỊCH DẠY TƯƠNG LAI & QUÁ KHỨ</div>
              <div className="fs-3 fw-extrabold text-danger">{myTimelineSessions.length} buổi</div>
              <small className="text-secondary">
                🔮 {myTimelineSessions.filter((s) => s.timeStatus === 'future' || s.timeStatus === 'today').length} tương lai • 📜 {myTimelineSessions.filter((s) => s.timeStatus === 'past').length} quá khứ
              </small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="text-info small fw-bold">SÂN TẬP & MÁY BẮN BÓNG</div>
              <div className="fs-3 fw-extrabold text-dark">{courtBookings.length} ca sân</div>
              <small className="text-secondary">Lịch hoạt động trên cụm sân</small>
            </div>
          </div>
        </div>

        {/* Coach Navigation Tabs */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('teaching-schedule')}
            className={`btn fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'teaching-schedule' ? 'btn-primary shadow-sm' : 'btn-white bg-white border'
            }`}
          >
            <Calendar size={18} />
            <span>Lịch Đứng Lớp ({myTimelineSessions.length} buổi • Tương lai & Quá khứ)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`btn fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'students' ? 'btn-primary shadow-sm' : 'btn-white bg-white border'
            }`}
          >
            <Users size={18} />
            <span>Sổ Điểm Danh & Chấm Trình Độ DUPR ({enrollments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('syllabus')}
            className={`btn fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'syllabus' ? 'btn-primary shadow-sm' : 'btn-white bg-white border'
            }`}
          >
            <BookOpen size={18} />
            <span>Giáo Trình & Lịch Giảng Dạy ({courses.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`btn fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 ${
              activeTab === 'schedule' ? 'btn-primary shadow-sm' : 'btn-white bg-white border'
            }`}
          >
            <Clock size={18} />
            <span>Lịch Sử Dụng Sân Tập ({courtBookings.length})</span>
          </button>
        </div>

        {/* TAB 0: COACH TEACHING TIMETABLE & CLASS SCHEDULE */}
        {activeTab === 'teaching-schedule' && (
          <div>
            {/* Today's Alert Banner */}
            {todayMySessions.length > 0 ? (
              <div
                className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white"
                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
              >
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">
                      ⚡ HÔM NAY ({todayDayLabel.toUpperCase()}) • CÓ {todayMySessions.length} CA DẠY CẦN ĐỨNG LỚP
                    </span>
                    <h5 className="fw-extrabold mb-1">
                      Lịch Đứng Lớp Hôm Nay Của HLV {currentUser?.name || ''}
                    </h5>
                    <p className="small mb-0 text-white-75">
                      Vui lòng có mặt tại sân trước 10 phút để đón học viên, kiểm tra vợt tập và máy bắn bóng nếu có đăng ký.
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {todayMySessions.map((s) => (
                      <div
                        key={s.uniqueId}
                        className="bg-white bg-opacity-20 backdrop-blur rounded-3 p-2 px-3 d-flex align-items-center gap-2"
                      >
                        <Clock size={16} className="text-warning" />
                        <div className="small">
                          <strong>{s.time}</strong> • {s.studentName}
                        </div>
                        <button
                          type="button"
                          onClick={() => openGradingModal(s.enrollment)}
                          className="btn btn-sm btn-light py-0 px-2 fw-bold ms-1"
                          style={{ fontSize: '0.72rem' }}
                        >
                          Điểm danh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white border-start border-4 border-info">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-info-subtle text-info rounded-circle">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark">
                      Hôm nay ({todayDayLabel}) bạn không có ca đứng lớp cố định
                    </div>
                    <small className="text-secondary">
                      Hãy kiểm tra thời khóa biểu các ngày tiếp theo trong tuần hoặc chuẩn bị giáo án cho các buổi dạy sắp tới.
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Controls & Week Navigation Bar (FAP University Timetable Style) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pb-3 border-bottom">
                {/* Week Navigator */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevWeek}
                    className="btn btn-sm btn-outline-dark fw-bold d-flex align-items-center gap-1 shadow-xs"
                    title="Xem tuần trước trong quá khứ"
                  >
                    <ChevronLeft size={16} />
                    <span>Tuần Trước</span>
                  </button>

                  <select
                    className="form-select form-select-sm fw-bold border-primary shadow-xs"
                    style={{ width: 'auto', minWidth: '240px' }}
                    value={selectedWeekMonday}
                    onChange={(e) => setSelectedWeekMonday(e.target.value)}
                  >
                    {weekOptions.map((w) => (
                      <option key={w.mondayStr} value={w.mondayStr}>
                        Tuần: {w.label} {w.isCurrent ? '⭐ (Hiện tại)' : w.isPast ? '(Quá khứ)' : '(Tương lai)'}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleNextWeek}
                    className="btn btn-sm btn-outline-dark fw-bold d-flex align-items-center gap-1 shadow-xs"
                    title="Xem tuần sau trong tương lai"
                  >
                    <span>Tuần Sau</span>
                    <ChevronRight size={16} />
                  </button>

                  {selectedWeekMonday !== currentMondayStr && (
                    <button
                      type="button"
                      onClick={handleJumpToCurrentWeek}
                      className="btn btn-sm btn-warning text-dark fw-bold d-flex align-items-center gap-1 shadow-xs"
                      title="Quay lại tuần này có ngày hôm nay"
                    >
                      <span>⚡ Trở về Tuần Này</span>
                    </button>
                  )}
                </div>

                {/* Scope & View Mode Toggle */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      onClick={() => setScheduleScope('my-schedule')}
                      className={`btn fw-bold ${
                        scheduleScope === 'my-schedule' ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                    >
                      Lịch của tôi ({weekSessions.filter((s) => s.isOwner).length} ca)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleScope('all')}
                      className={`btn fw-bold ${
                        scheduleScope === 'all' ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                    >
                      Toàn trường ({weekSessions.length} ca)
                    </button>
                  </div>

                  <div className="input-group input-group-sm" style={{ width: '180px' }}>
                    <span className="input-group-text bg-light">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm lớp, học viên..."
                      value={scheduleSearch}
                      onChange={(e) => setScheduleSearch(e.target.value)}
                    />
                  </div>

                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      onClick={() => setScheduleViewMode('matrix')}
                      className={`btn d-flex align-items-center gap-1 fw-bold ${
                        scheduleViewMode === 'matrix' ? 'btn-dark' : 'btn-outline-dark'
                      }`}
                      title="Thời khóa biểu dạng bảng ma trận slot theo thứ (FAP)"
                    >
                      <Grid size={15} />
                      <span className="d-none d-md-inline">Thời Khóa Biểu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleViewMode('agenda')}
                      className={`btn d-flex align-items-center gap-1 fw-bold ${
                        scheduleViewMode === 'agenda' ? 'btn-dark' : 'btn-outline-dark'
                      }`}
                      title="Bảng danh sách chi tiết"
                    >
                      <List size={15} />
                      <span className="d-none d-md-inline">Danh Sách</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleViewMode('timeline')}
                      className={`btn d-flex align-items-center gap-1 fw-bold ${
                        scheduleViewMode === 'timeline' ? 'btn-dark' : 'btn-outline-dark'
                      }`}
                      title="Dòng thời gian buổi học"
                    >
                      <CalendarDays size={15} />
                      <span className="d-none d-md-inline">Dòng Thời Gian</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Note & Legend */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 small">
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <span className="fw-bold text-dark d-flex align-items-center gap-1">
                    <span>📌 Chú thích:</span>
                  </span>
                  <span className="d-inline-flex align-items-center gap-1">
                    <span className="badge bg-success bg-opacity-25 text-success border border-success-subtle fw-bold">
                      Fri (13/11)
                    </span>
                    <span className="text-muted">Cột Hôm nay</span>
                  </span>
                  <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold">
                    <CheckCircle2 size={14} className="text-success" />
                    <span>Present (Có mặt)</span>
                  </span>
                  <span className="d-inline-flex align-items-center gap-1 text-danger fw-semibold">
                    <X size={14} className="text-danger" />
                    <span>Absent (Vắng)</span>
                  </span>
                  <span className="d-inline-flex align-items-center gap-1 text-muted">
                    <span className="border rounded px-1 text-secondary bg-light" style={{ fontSize: '0.7rem' }}>Không badge</span>
                    <span>Chưa học (Đến ngày mới điểm danh)</span>
                  </span>
                  <span className="d-inline-flex align-items-center gap-1 text-secondary">
                    <span>📍 Sân tập học viên chọn (Không fix cứng)</span>
                  </span>
                </div>

                <div className="text-secondary">
                  Tuần từ <strong>{currentWeekDays[0]?.displayDate}</strong> đến <strong>{currentWeekDays[6]?.displayDate}</strong>
                </div>
              </div>
            </div>

            {/* VIEW 1: WEEKLY TIMETABLE MATRIX (THỜI KHÓA BIỂU DẠNG BẢNG MA TRẬN FAP NHƯ TRONG ẢNH) */}
            {scheduleViewMode === 'matrix' && (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
                <div className="table-responsive">
                  <table
                    className="table table-bordered mb-0 align-middle"
                    style={{ minWidth: '980px', borderColor: '#e2e8f0' }}
                  >
                    <thead>
                      <tr className="text-center">
                        <th
                          style={{
                            width: '85px',
                            verticalAlign: 'middle',
                            backgroundColor: '#f8fafc',
                            color: '#1e293b'
                          }}
                          className="fw-bold py-3 border"
                        >
                          Slot
                        </th>
                        {currentWeekDays.map((day) => (
                          <th
                            key={day.dateStr}
                            style={{
                              width: '13%',
                              verticalAlign: 'middle',
                              backgroundColor: day.isToday ? '#d1fae5' : '#f8fafc',
                              color: day.isToday ? '#065f46' : '#1e293b'
                            }}
                            className={`py-3 fw-bold border ${day.isToday ? 'border-success' : ''}`}
                          >
                            <div className="fs-6 fw-extrabold">{day.displayHeader}</div>
                            <small className="opacity-75">{day.vnLabel} {day.isToday ? '⚡' : ''}</small>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map((slot, sIdx) => {
                        return (
                          <tr key={slot.id} className="text-center align-top">
                            {/* Column 1: Slot Number & Time */}
                            <td
                              style={{
                                verticalAlign: 'middle',
                                backgroundColor: '#f8fafc',
                                width: '85px'
                              }}
                              className="fw-bold border"
                            >
                              <div className="fs-5 text-dark fw-extrabold">{sIdx + 1}</div>
                              <div className="text-muted fw-normal" style={{ fontSize: '0.68rem', lineHeight: '1.2' }}>
                                {slot.time.replace(/\s+/g, '')}
                              </div>
                            </td>

                            {/* 7 Columns: Mon to Sun */}
                            {currentWeekDays.map((day) => {
                              let cellSessions = weekSessions.filter(
                                (s) => s.date === day.dateStr && s.slotId === slot.id
                              );

                              if (scheduleSearch) {
                                const q = scheduleSearch.toLowerCase().trim();
                                cellSessions = cellSessions.filter(
                                  (s) =>
                                    s.studentName.toLowerCase().includes(q) ||
                                    s.courseTitle.toLowerCase().includes(q) ||
                                    s.courseCode.toLowerCase().includes(q)
                                );
                              }

                              return (
                                <td
                                  key={`${slot.id}-${day.dateStr}`}
                                  style={{
                                    backgroundColor: day.isToday ? '#f0fdf4' : '#ffffff',
                                    verticalAlign: 'top',
                                    padding: '6px',
                                    minHeight: '130px'
                                  }}
                                  className={`border ${day.isToday ? 'border-success-subtle' : ''}`}
                                >
                                  {cellSessions.length === 0 ? (
                                    <div
                                      className="text-muted text-center py-4 fw-light opacity-50"
                                      style={{ fontSize: '1.2rem', userSelect: 'none' }}
                                    >
                                      -
                                    </div>
                                  ) : (
                                    <div className="d-flex flex-column gap-2">
                                      {cellSessions.map((s) => (
                                        <div
                                          key={s.uniqueId}
                                          className={`p-2 rounded-3 border text-start shadow-xs h-100 d-flex flex-column justify-content-between ${
                                            s.isOwner
                                              ? 'bg-white border-primary-subtle'
                                              : 'bg-light bg-opacity-75 border-secondary-subtle'
                                          }`}
                                          style={{ minHeight: '125px' }}
                                        >
                                          <div>
                                            {/* Course Code & Title: 📖 VIP103 - 1 Kèm 1 */}
                                            <div
                                              className="fw-bold text-primary mb-1 d-flex align-items-center justify-content-between"
                                              style={{ fontSize: '0.78rem' }}
                                            >
                                              <span className="text-truncate" title={s.courseTitle}>
                                                📖 {s.courseCode} - {s.courseShortTitle}
                                              </span>
                                            </div>

                                            {/* Attendance Status: Chỉ hiển thị Present hoặc Absent khi đã điểm danh. Buổi chưa học hoặc chưa điểm danh => HOÀN TOÀN KHÔNG ĐỂ TRẠNG THÁI */}
                                            {s.sessionAttendanceStatus === 'present' && (
                                              <div className="mb-1">
                                                <span
                                                  className="text-success fw-bold d-inline-flex align-items-center gap-1"
                                                  style={{ fontSize: '0.72rem' }}
                                                >
                                                  <CheckCircle2 size={13} className="text-success" />
                                                  <span>Present</span>
                                                </span>
                                              </div>
                                            )}
                                            {s.sessionAttendanceStatus === 'absent' && (
                                              <div className="mb-1">
                                                <span
                                                  className="text-danger fw-bold d-inline-flex align-items-center gap-1"
                                                  style={{ fontSize: '0.72rem' }}
                                                >
                                                  <X size={13} className="text-danger" />
                                                  <span>Absent</span>
                                                </span>
                                              </div>
                                            )}

                                            {/* Time: 09h00-10h30 - Offline */}
                                            <div
                                              className="fw-bold mb-1"
                                              style={{ fontSize: '0.72rem', color: '#b45309' }}
                                            >
                                              ⏰ {s.timeFormatted} - Offline
                                            </div>

                                            {/* Court: Dynamic Court chosen by student */}
                                            <div className="text-secondary mb-1 text-truncate" style={{ fontSize: '0.72rem' }} title={s.courtName}>
                                              📍 {s.courtShortName || s.courtName}
                                            </div>

                                            {/* Student Name */}
                                            <div
                                              className="small fw-semibold text-dark text-truncate"
                                              style={{ fontSize: '0.72rem' }}
                                            >
                                              👤 {s.studentName}
                                            </div>
                                            {!s.isOwner && (
                                              <div
                                                className="text-muted text-truncate"
                                                style={{ fontSize: '0.68rem' }}
                                              >
                                                HLV: {s.coachName}
                                              </div>
                                            )}
                                          </div>

                                          {/* Attendance Button if Coach is Owner */}
                                          {s.isOwner ? (
                                            s.timeStatus === 'future' ? (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  alert(
                                                    `Buổi học số ${s.sessionIndex} diễn ra vào ${s.dayLabel} (${s.dateFormatted}).\n\nChỉ đến ngày diễn ra buổi học, Huấn luyện viên mới được phép điểm danh!`
                                                  )
                                                }
                                                className="btn btn-sm btn-light border py-0 px-2 text-muted mt-2 w-100 d-flex align-items-center justify-content-center gap-1 shadow-xs"
                                                style={{ fontSize: '0.68rem' }}
                                                title="Buổi học chưa diễn ra - Đến ngày này mới được điểm danh"
                                              >
                                                <Clock size={11} className="text-muted" />
                                                <span>Chưa đến ngày</span>
                                              </button>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => openGradingModal(s.enrollment)}
                                                className="btn btn-sm btn-outline-primary py-0 px-2 fw-bold mt-2 w-100 d-flex align-items-center justify-content-center gap-1 shadow-xs"
                                                style={{ fontSize: '0.68rem' }}
                                              >
                                                <Edit3 size={11} />
                                                <span>{s.timeStatus === 'today' ? 'Điểm danh hôm nay' : 'Cập nhật điểm danh'}</span>
                                              </button>
                                            )
                                          ) : (
                                            <div
                                              className="text-muted text-center py-1 mt-1 border-top"
                                              style={{ fontSize: '0.65rem' }}
                                            >
                                              🔒 HLV khác
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 1: TIMELINE VIEW (QUÁ KHỨ & TƯƠNG LAI - BUỔI HỌC CỤ THỂ) */}
            {scheduleViewMode === 'timeline' && (
              <div className="mb-4">
                {displayedTimelineSessions.length === 0 ? (
                  <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                    <div className="text-muted fs-1 mb-2">📅</div>
                    <h6 className="fw-bold text-dark mb-1">Không tìm thấy buổi học nào</h6>
                    <p className="text-secondary small mb-3">
                      Không có buổi học nào khớp với bộ lọc &quot;{timeHorizonFilter === 'upcoming' ? 'Tương lai / Sắp tới' : timeHorizonFilter === 'past' ? 'Quá khứ / Lịch sử' : timeHorizonFilter}&quot;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeHorizonFilter('all');
                        setSelectedDayFilter('all');
                        setScheduleSearch('');
                      }}
                      className="btn btn-sm btn-outline-primary mx-auto"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {displayedTimelineSessions.map((s) => {
                      const isToday = s.timeStatus === 'today';
                      const isFuture = s.timeStatus === 'future';
                      const isPast = s.timeStatus === 'past';

                      return (
                        <div key={s.uniqueId} className="col-lg-6">
                          <div
                            className={`card h-100 rounded-4 border-0 shadow-sm overflow-hidden ${
                              isToday
                                ? 'border-start border-4 border-warning bg-warning bg-opacity-10'
                                : isFuture
                                ? 'border-start border-4 border-primary bg-white'
                                : 'border-start border-4 border-secondary bg-light bg-opacity-50'
                            }`}
                          >
                            {/* Card Header with Date, Time Horizon Badge, Session Index */}
                            <div className="p-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2 bg-white">
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-extrabold text-dark fs-6">
                                  📅 {s.dayLabel}, {s.dateFormatted}
                                </span>
                                {isToday && (
                                  <span className="badge bg-warning text-dark fw-bold px-2 py-1 shadow-xs">
                                    ⚡ Hôm nay
                                  </span>
                                )}
                                {isFuture && (
                                  <span className="badge bg-primary text-white fw-bold px-2 py-1 shadow-xs">
                                    🔮 Sắp tới (Tương lai)
                                  </span>
                                )}
                                {isPast && (
                                  <span className="badge bg-secondary text-white fw-bold px-2 py-1">
                                    📜 Quá khứ / Lịch sử
                                  </span>
                                )}
                              </div>
                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold">
                                Buổi {s.sessionIndex}/{s.totalSessions}
                              </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-1">
                                    <span>🎓</span>
                                    <span>{s.courseTitle}</span>
                                  </h6>
                                  <div className="d-flex flex-wrap gap-1 align-items-center mt-1">
                                    <span className="badge bg-primary fw-bold">
                                      🕒 {s.time}
                                    </span>
                                    <span className="badge bg-light text-primary border border-primary-subtle">
                                      🏟️ {s.courtName}
                                    </span>
                                    {s.isOwner ? (
                                      <span className="badge bg-success-subtle text-success fw-bold">
                                        ⭐ Lớp của bạn
                                      </span>
                                    ) : (
                                      <span className="badge bg-light text-secondary border">
                                        HLV: {s.coachName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="p-2 bg-light rounded-3 mb-2 small">
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-secondary">Học viên:</span>
                                  <strong className="text-dark">👤 {s.studentName}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-secondary">Liên hệ:</span>
                                  <span>
                                    <a href={`tel:${s.studentPhone}`} className="text-decoration-none fw-semibold">
                                      📞 {s.studentPhone}
                                    </a>
                                  </span>
                                </div>
                                {s.notes && (
                                  <div className="text-muted fst-italic mt-1 border-top pt-1">
                                    💬 &quot;{s.notes}&quot;
                                  </div>
                                )}
                              </div>

                              {/* Footer Action */}
                              <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                                <div>
                                  {s.isAttended ? (
                                    <span className="badge bg-success-subtle text-success fw-bold">
                                      ✅ Đã điểm danh ({s.enrollment.attendedSessions || 0}/{s.totalSessions} buổi)
                                    </span>
                                  ) : isPast ? (
                                    <span className="badge bg-light text-secondary border">
                                      📜 Buổi học trong quá khứ
                                    </span>
                                  ) : isToday ? (
                                    <span className="badge bg-warning text-dark fw-bold">
                                      ⚡ Diễn ra hôm nay
                                    </span>
                                  ) : (
                                    <span className="badge bg-primary-subtle text-primary">
                                      ⏳ Lịch dạy sắp tới
                                    </span>
                                  )}
                                </div>

                                {s.isOwner ? (
                                  <button
                                    type="button"
                                    onClick={() => openGradingModal(s.enrollment)}
                                    className="btn btn-sm btn-outline-primary fw-bold d-flex align-items-center gap-1"
                                    style={{ fontSize: '0.78rem' }}
                                  >
                                    <Edit3 size={13} />
                                    <span>Điểm danh & DUPR</span>
                                  </button>
                                ) : (
                                  <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem' }}>
                                    🔒 HLV khác phụ trách
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: WEEKLY TIMETABLE GRID */}
            {scheduleViewMode === 'grid' && (
              <div className="weekly-schedule-container overflow-x-auto pb-2 mb-4">
                <div className="row g-2 flex-nowrap flex-xl-wrap" style={{ minWidth: '920px' }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isToday = day.key === todayDayKey;
                    const daySessions = displayedSessions.filter((s) => s.dayKey === day.key);
                    return (
                      <div key={day.key} className="col-xl" style={{ flex: '1 0 0%', minWidth: '150px' }}>
                        <div
                          className={`card h-100 rounded-4 border ${
                            isToday
                              ? 'border-primary shadow-sm bg-primary-subtle bg-opacity-10'
                              : 'bg-white'
                          }`}
                        >
                          {/* Day Header */}
                          <div
                            className={`p-2 rounded-top-4 border-bottom text-center ${
                              isToday ? 'bg-primary text-white' : 'bg-light text-dark'
                            }`}
                          >
                            <div className="fw-bold small">{day.label}</div>
                            <div className="d-flex align-items-center justify-content-center gap-1 mt-1">
                              {isToday && (
                                <span className="badge bg-warning text-dark px-1" style={{ fontSize: '0.6rem' }}>
                                  HÔM NAY
                                </span>
                              )}
                              <span
                                className={`badge ${
                                  isToday ? 'bg-white text-primary' : 'bg-secondary text-white'
                                }`}
                                style={{ fontSize: '0.62rem' }}
                              >
                                {daySessions.length} ca
                              </span>
                            </div>
                          </div>

                          {/* Sessions in day */}
                          <div className="p-2 d-flex flex-column gap-2 flex-grow-1">
                            {daySessions.length === 0 ? (
                              <div className="text-center py-4 text-muted small my-auto">
                                <div className="opacity-50 fs-5 mb-1">☕</div>
                                Trống lịch
                              </div>
                            ) : (
                              daySessions.map((s) => (
                                <div
                                  key={s.uniqueId}
                                  className="p-2 bg-white rounded-3 border shadow-xs"
                                  style={{ borderLeft: '3px solid #0284c7' }}
                                >
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <span
                                      className="badge bg-primary-subtle text-primary fw-bold"
                                      style={{ fontSize: '0.68rem' }}
                                    >
                                      ⏰ {s.time}
                                    </span>
                                    <span
                                      className="badge bg-success-subtle text-success"
                                      style={{ fontSize: '0.6rem' }}
                                    >
                                      {s.stats.attended}/{s.stats.total} buổi
                                    </span>
                                  </div>

                                  <div
                                    className="fw-bold text-dark small text-truncate"
                                    title={s.courseTitle}
                                    style={{ fontSize: '0.78rem' }}
                                  >
                                    🎓 {s.courseTitle}
                                  </div>

                                  <div
                                    className="badge bg-light text-primary border border-primary-subtle my-1 w-100 text-truncate text-start"
                                    style={{ fontSize: '0.66rem' }}
                                    title={s.courtName}
                                  >
                                    🏟️ {s.courtName}
                                  </div>

                                  <div className="small text-secondary mt-1">
                                    <strong className="text-dark">{s.studentName}</strong>
                                  </div>
                                  <div className="small">
                                    <a
                                      href={`tel:${s.studentPhone}`}
                                      className="text-secondary text-decoration-none"
                                      style={{ fontSize: '0.72rem' }}
                                    >
                                      📞 {s.studentPhone}
                                    </a>
                                  </div>

                                  {s.notes && (
                                    <div
                                      className="p-1 bg-light rounded mt-1 text-muted text-truncate"
                                      title={s.notes}
                                      style={{ fontSize: '0.68rem', fontStyle: 'italic' }}
                                    >
                                      "{s.notes}"
                                    </div>
                                  )}

                                  {!s.isOwner && (
                                    <div className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                                      HLV: {s.coachName || 'Chưa phân công'}
                                    </div>
                                  )}

                                  {s.isOwner ? (
                                    <button
                                      type="button"
                                      onClick={() => openGradingModal(s.enrollment)}
                                      className="btn btn-sm btn-outline-primary w-100 fw-bold py-1 mt-2 d-flex align-items-center justify-content-center gap-1"
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      <Edit3 size={11} />
                                      <span>Điểm danh</span>
                                    </button>
                                  ) : (
                                    <div
                                      className="badge bg-light text-secondary border w-100 py-1 mt-2 text-center d-block"
                                      style={{ fontSize: '0.65rem' }}
                                    >
                                      🔒 {s.coachName ? 'HLV khác phụ trách' : 'Chưa phân công HLV'}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 3: AGENDA LIST VIEW (BẢNG DANH SÁCH CHI TIẾT THEO NGÀY CỤ THỂ) */}
            {scheduleViewMode === 'agenda' && (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '170px' }}>Ngày & Thứ</th>
                        <th style={{ width: '150px' }}>Giờ & Sân Tập</th>
                        <th>Khóa Học & HLV</th>
                        <th>Học Viên Tham Gia</th>
                        <th>Buổi Học</th>
                        <th>Thời Điểm</th>
                        <th style={{ width: '160px' }}>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedTimelineSessions.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            Không tìm thấy buổi học nào phù hợp với bộ lọc thời gian.
                          </td>
                        </tr>
                      ) : (
                        displayedTimelineSessions.map((s) => {
                          const isToday = s.timeStatus === 'today';
                          const isFuture = s.timeStatus === 'future';
                          const isPast = s.timeStatus === 'past';

                          return (
                            <tr key={s.uniqueId} className={isToday ? 'table-warning' : isFuture ? 'table-light' : ''}>
                              <td>
                                <div className="fw-bold text-dark">
                                  📅 {s.dayLabel}
                                </div>
                                <div className="text-primary fw-semibold" style={{ fontSize: '0.8rem' }}>
                                  {s.dateFormatted}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-primary text-white fw-bold">
                                  ⏰ {s.time}
                                </span>
                                <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                  🏟️ Sân số 3
                                </div>
                              </td>
                              <td>
                                <div className="fw-bold text-dark">{s.courseTitle}</div>
                                <div className="d-flex align-items-center gap-1 flex-wrap mt-1">
                                  {s.isOwner ? (
                                    <span className="badge bg-success-subtle text-success">
                                      ⭐ Lớp của bạn
                                    </span>
                                  ) : (
                                    <span className="badge bg-light text-secondary border">
                                      HLV: {s.coachName}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="fw-bold text-dark">{s.studentName}</div>
                                <div className="mt-1">
                                  <a
                                    href={`tel:${s.studentPhone}`}
                                    className="text-primary text-decoration-none fw-semibold"
                                  >
                                    📞 {s.studentPhone}
                                  </a>
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                  ✉️ {s.studentEmail}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold">
                                  Buổi {s.sessionIndex}/{s.totalSessions}
                                </span>
                                <div className="mt-1">
                                  {s.isAttended ? (
                                    <span className="badge bg-success text-white" style={{ fontSize: '0.65rem' }}>
                                      ✅ Đã điểm danh
                                    </span>
                                  ) : isPast ? (
                                    <span className="badge bg-secondary text-white" style={{ fontSize: '0.65rem' }}>
                                      📜 Đã diễn ra
                                    </span>
                                  ) : (
                                    <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>
                                      ⏳ Chưa diễn ra
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                {isToday && (
                                  <span className="badge bg-warning text-dark fw-bold px-2 py-1">
                                    ⚡ Hôm nay
                                  </span>
                                )}
                                {isFuture && (
                                  <span className="badge bg-primary text-white fw-bold px-2 py-1">
                                    🔮 Tương lai
                                  </span>
                                )}
                                {isPast && (
                                  <span className="badge bg-secondary text-white fw-bold px-2 py-1">
                                    📜 Quá khứ
                                  </span>
                                )}
                              </td>
                              <td>
                                {s.isOwner ? (
                                  <button
                                    type="button"
                                    onClick={() => openGradingModal(s.enrollment)}
                                    className="btn btn-sm btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                                  >
                                    <Edit3 size={14} />
                                    <span>Điểm danh & DUPR</span>
                                  </button>
                                ) : (
                                  <span
                                    className="badge bg-light text-secondary border px-2 py-2 d-block text-center"
                                    style={{ fontSize: '0.72rem' }}
                                  >
                                    🔒 HLV khác phụ trách
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: STUDENT ATTENDANCE & DUPR GRADING */}
        {activeTab === 'students' && (
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="row g-3 align-items-center justify-content-between mb-3">
              <div className="col-md-6">
                <h5 className="fw-extrabold text-dark mb-1">
                  Bảng Đánh Giá Kỹ Thuật & Điểm Danh Học Viên
                </h5>
                <small className="text-secondary">
                  Cập nhật tiến độ từng buổi học, chấm điểm DUPR và gửi nhận xét trực tiếp vào hồ sơ học viên
                </small>
              </div>
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light">
                    <Search size={15} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm tên học viên, SĐT hoặc lớp học..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Scope Filter Buttons */}
            <div className="d-flex flex-wrap gap-2 mb-3 pb-2 border-bottom">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                  studentScope === 'my-students'
                    ? 'btn-primary shadow-sm'
                    : 'btn-light border text-secondary'
                }`}
                onClick={() => setStudentScope('my-students')}
              >
                Học viên lớp của bạn ({myEnrollments.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                  studentScope === 'all'
                    ? 'btn-primary shadow-sm'
                    : 'btn-light border text-secondary'
                }`}
                onClick={() => setStudentScope('all')}
              >
                Tất cả học viên học viện ({enrollments.length})
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle small">
                <thead className="table-primary">
                  <tr>
                    <th>Mã HV</th>
                    <th>Thông Tin Học Viên</th>
                    <th>Lớp Đăng Ký & Ca Học</th>
                    <th style={{ minWidth: '220px' }}>Tiến Độ Học Tập</th>
                    <th style={{ minWidth: '170px' }}>Đánh Giá DUPR & Kỹ Năng</th>
                    <th style={{ minWidth: '200px' }}>Nhận Xét Của HLV</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollments.map((enr) => {
                    const stats = getSessionStats(enr);
                    const isOwner = isCoachOwner(enr.coachName, enr.courseId);
                    return (
                      <tr key={enr.id}>
                        <td className="fw-bold">{enr.id}</td>
                        <td>
                          <div className="fw-bold text-dark">{enr.studentName}</div>
                          <div className="text-secondary">{enr.studentPhone}</div>
                          <span className="badge bg-light text-secondary border mt-1">
                            {enr.experienceLevel}
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-primary">{enr.courseTitle}</div>
                          <div className="text-secondary">🕒 {enr.preferredSchedule}</div>
                          <small className="text-muted d-block mt-1">
                            HLV: <strong>{enr.coachName || 'Chưa phân công'}</strong>
                          </small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="small fw-bold text-dark">
                              Tiến độ: {stats.attended}/{stats.total} buổi
                            </span>
                            <span className="badge bg-success-subtle text-success fw-bold">
                              {stats.percent}%
                            </span>
                          </div>
                          <div className="progress mb-2" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${stats.percent}%` }}
                            />
                          </div>
                          <div className="d-flex flex-wrap gap-1">
                            <span className="badge bg-success-subtle text-success border border-success-subtle" title="Đã học">
                              ✓ Đã học: {stats.attended}
                            </span>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle" title="Còn lại">
                              🕒 Còn: {stats.remaining}
                            </span>
                            {stats.absent > 0 ? (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle" title="Đã nghỉ">
                                ✕ Nghỉ: {stats.absent}
                              </span>
                            ) : (
                              <span className="badge bg-light text-secondary border" title="Nghỉ: 0">
                                Nghỉ: 0
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="fw-extrabold text-success small mb-1">
                            ⭐ {enr.duprEvaluation || 'Chưa có điểm DUPR'}
                          </div>
                          {enr.skills ? (
                            <div className="d-flex flex-column gap-1 text-secondary" style={{ fontSize: '0.72rem' }}>
                              <span>• Dink/Kitchen: <strong>{enr.skills.dink}/5 ⭐</strong></span>
                              <span>• 3rd Drop/Reset: <strong>{enr.skills.drop}/5 ⭐</strong></span>
                              <span>• Giao/Trả bóng: <strong>{enr.skills.serve}/5 ⭐</strong></span>
                              <span>• Footwork/Đôi: <strong>{enr.skills.footwork}/5 ⭐</strong></span>
                            </div>
                          ) : (
                            <small className="text-muted fst-italic">Chưa chấm kỹ năng</small>
                          )}
                        </td>
                        <td>
                          {enr.coachFeedback ? (
                            <div className="fst-italic text-dark small" style={{ maxWidth: '240px' }}>
                              "{enr.coachFeedback}"
                            </div>
                          ) : (
                            <small className="text-muted fst-italic">Chưa có nhận xét</small>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              enr.status === 'completed'
                                ? 'bg-primary'
                                : enr.status === 'confirmed'
                                ? 'bg-success'
                                : enr.status === 'paused'
                                ? 'bg-secondary'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {enr.status === 'completed'
                              ? 'Đã tốt nghiệp'
                              : enr.status === 'confirmed'
                              ? 'Đang theo học'
                              : enr.status === 'paused'
                              ? 'Tạm bảo lưu'
                              : 'Chờ xếp lớp'}
                          </span>
                        </td>
                        <td>
                          {isOwner ? (
                            <button
                              type="button"
                              onClick={() => openGradingModal(enr)}
                              className="btn btn-sm btn-primary fw-bold d-flex align-items-center gap-1 shadow-sm text-nowrap"
                            >
                              <Edit3 size={14} /> Chấm điểm & Tiến độ
                            </button>
                          ) : (
                            <span className="badge bg-light text-secondary border text-nowrap">
                              🔒 Chỉ xem
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEnrollments.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="text-secondary mb-2">
                          <Users size={36} className="opacity-50" />
                        </div>
                        <h6 className="fw-bold text-dark">Chưa có học viên nào trong danh mục này</h6>
                        <p className="text-muted small mb-3">
                          {studentScope === 'my-students'
                            ? `HLV ${currentUser?.name} hiện chưa có học viên nào thuộc lớp do mình trực tiếp phụ trách.`
                            : 'Không tìm thấy hồ sơ học viên phù hợp với từ khóa.'}
                        </p>
                        {studentScope === 'my-students' && (
                          <button
                            type="button"
                            onClick={() => setStudentScope('all')}
                            className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3"
                          >
                            Xem tất cả {enrollments.length} học viên toàn học viện →
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SYLLABUS & COURSE TEACHING SCHEDULE */}
        {activeTab === 'syllabus' && (
          <div>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <h5 className="fw-extrabold text-dark mb-1">
                  Giáo Trình Đào Tạo & Kế Hoạch Giảng Dạy
                </h5>
                <small className="text-secondary">
                  HLV chỉ có quyền chỉnh sửa giáo trình cho các khóa học do chính mình trực tiếp phụ trách.
                </small>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                    syllabusScope === 'all'
                      ? 'btn-primary shadow-sm'
                      : 'btn-light border text-secondary'
                  }`}
                  onClick={() => setSyllabusScope('all')}
                >
                  Tất cả khóa học ({courses.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${
                    syllabusScope === 'my-courses'
                      ? 'btn-primary shadow-sm'
                      : 'btn-light border text-secondary'
                  }`}
                  onClick={() => setSyllabusScope('my-courses')}
                >
                  Khóa của bạn ({myCourses.length})
                </button>
              </div>
            </div>

            <div className="row g-4">
              {displayedCourses.map((course) => {
                const isEditCourse = editingCourseId === course.id;
                const isOwner = isCoachOwner(course.coach);
                return (
                  <div className="col-lg-6" key={course.id}>
                    <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isOwner ? 'border-start border-4 border-primary' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="badge bg-primary-subtle text-primary fw-bold">
                              {course.categoryLabel}
                            </span>
                            {isOwner ? (
                              <span className="badge bg-success-subtle text-success fw-bold">
                                ✓ Lớp của bạn
                              </span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary">
                                Lớp HLV khác
                              </span>
                            )}
                          </div>
                          <h5 className="fw-extrabold text-dark mb-1">{course.title}</h5>
                          <div className="small text-success fw-semibold">
                            Phụ trách: {course.coach} • Sĩ số: {course.enrolledCount}/{course.maxStudents} HV
                          </div>
                        </div>
                        {!isEditCourse && (
                          isOwner ? (
                            <button
                              type="button"
                              onClick={() => startEditSyllabus(course)}
                              className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            >
                              <Edit3 size={14} /> Sửa Giáo Trình
                            </button>
                          ) : (
                            <span className="badge bg-light text-secondary border px-2 py-1">
                              🔒 Chỉ xem
                            </span>
                          )
                        )}
                      </div>

                    {isEditCourse ? (
                      <div className="bg-light p-3 rounded-3 border mt-2">
                        <div className="mb-2">
                          <label className="form-label small fw-bold mb-1">Lịch giảng dạy</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={syllabusForm.schedule}
                            onChange={(e) =>
                              setSyllabusForm({ ...syllabusForm, schedule: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small fw-bold mb-1">Tóm tắt chuyên môn</label>
                          <textarea
                            rows="2"
                            className="form-control form-control-sm"
                            value={syllabusForm.summary}
                            onChange={(e) =>
                              setSyllabusForm({ ...syllabusForm, summary: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold mb-1">
                            Đề cương từng buổi học (Mỗi dòng 1 giai đoạn)
                          </label>
                          <textarea
                            rows="4"
                            className="form-control form-control-sm"
                            value={syllabusForm.syllabusText}
                            onChange={(e) =>
                              setSyllabusForm({ ...syllabusForm, syllabusText: e.target.value })
                            }
                          />
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveSyllabus(course.id)}
                            className="btn btn-sm btn-success fw-bold px-3"
                          >
                            Lưu Giáo Trình
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCourseId(null)}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-secondary small mb-2">{course.summary}</p>
                        <div className="small mb-2">
                          <strong>📅 Lịch đứng lớp:</strong> {course.schedule}
                        </div>
                        <div className="bg-light rounded-3 p-3 small">
                          <div className="fw-bold text-dark mb-1">Giáo trình huấn luyện:</div>
                          {(course.syllabus || []).map((step, i) => (
                            <div key={i} className="text-secondary mb-1">
                              • {step}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

        {/* TAB 3: COURT SCHEDULE VIEW FOR COACHES */}
        {activeTab === 'schedule' && (
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-extrabold text-dark mb-3">
              Lịch Hoạt Động Các Sân Tập & Thuê Máy Bắn Bóng
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>Mã Ca</th>
                    <th>Sân Tập</th>
                    <th>Ngày & Giờ</th>
                    <th>Học Viên / Người Đặt</th>
                    <th>Thiết Bị Hỗ TrỢ Huấn Luyện</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {courtBookings.map((cb) => (
                    <tr key={cb.id}>
                      <td className="fw-bold">{cb.id}</td>
                      <td className="fw-bold text-dark">{cb.courtName}</td>
                      <td>
                        <strong>{cb.date}</strong> ({cb.time})
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{cb.customerName}</div>
                        <div className="text-secondary small">{cb.customerPhone}</div>
                        {cb.linkedCourseTitle && (
                          <div className="mt-1 d-flex align-items-center gap-1 flex-wrap">
                            <span
                              className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '0.72rem' }}
                            >
                              🎓 {cb.linkedCourseTitle}
                            </span>
                            {cb.linkedCoachName && (
                              <span
                                className={`badge ${
                                  isCoachOwner(cb.linkedCoachName)
                                    ? 'bg-warning text-dark fw-bold'
                                    : 'bg-light text-secondary border'
                                }`}
                                style={{ fontSize: '0.68rem' }}
                              >
                                {isCoachOwner(cb.linkedCoachName) ? '⭐ Lớp của bạn' : `HLV: ${cb.linkedCoachName}`}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {cb.rentPaddleCount > 0 ? `Thuê ${cb.rentPaddleCount} vợt Carbon` : 'Tự trang bị vợt'}
                        {cb.rentBallMachine ? ' • Có sử dụng Máy bắn bóng Titan Pro' : ''}
                      </td>
                      <td>
                        <span className="badge bg-success">Đã xếp lịch</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL ĐIỂM DANH HỌC VIÊN TỐI GIẢN & CHUẨN XÁC */}
      {gradingModalEnr && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 1060, overflowY: 'auto' }}
          onClick={() => setGradingModalEnr(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered my-3 my-md-4"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px' }}
          >
            <div
              className="modal-content border-0 rounded-4 shadow-lg overflow-hidden d-flex flex-column"
              style={{ maxHeight: '90vh' }}
            >
              {/* Header Gọn Gàng */}
              <div className="modal-header bg-dark text-white p-3 px-4 flex-shrink-0">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.7rem' }}>
                      ĐIỂM DANH HỌC VIÊN
                    </span>
                    <span className="badge bg-secondary text-white" style={{ fontSize: '0.7rem' }}>
                      Ca: {gradingModalEnr.preferredSchedule || 'Theo thỏa thuận'}
                    </span>
                  </div>
                  <h5 className="modal-title fw-extrabold mb-0 fs-6">
                    {gradingModalEnr.studentName}
                  </h5>
                  <small className="text-white-50" style={{ fontSize: '0.78rem' }}>
                    {gradingModalEnr.courseTitle}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setGradingModalEnr(null)}
                />
              </div>

              <form onSubmit={handleSaveGrading} noValidate className="d-flex flex-column overflow-hidden flex-grow-1">
                <div className="modal-body p-3 p-md-4" style={{ overflowY: 'auto' }}>
                  {/* PHẦN 1: ĐIỂM DANH BUỔI HỌC HÔM NAY (CHỈ ĐIỂM DANH BUỔI NÀY) */}
                  {currentSessionIndex !== -1 ? (
                    <div className="mb-4">
                      <div className="text-center mb-3">
                        <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-bold mb-2">
                          ⚡ ĐIỂM DANH BUỔI HỌC HÔM NAY
                        </div>
                        <h4 className="fw-extrabold text-dark mb-1">
                          Buổi {currentSessionIndex + 1} <span className="text-muted fw-normal fs-6">/ {sessionStates.length} buổi</span>
                        </h4>
                        <p className="text-secondary small mb-0">
                          Chỉ điểm danh buổi hiện tại. Vui lòng tích chọn trạng thái của học viên hôm nay:
                        </p>
                      </div>

                      {/* 2 NÚT CHỌN LỚN: CÓ MẶT (PRESENT) HOẶC VẮNG MẶT (ABSENT) */}
                      <div className="row g-2">
                        <div className="col-6">
                          <button
                            type="button"
                            onClick={() => handleSelectTodayChoice('present')}
                            className={`btn w-100 p-3 rounded-4 text-start border transition-all h-100 ${
                              todayAttendanceChoice === 'present'
                                ? 'btn-success text-white border-success shadow'
                                : 'btn-light border-secondary-subtle text-dark hover-shadow-sm'
                            }`}
                            style={{
                              borderWidth: todayAttendanceChoice === 'present' ? '2px' : '1px'
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className={`p-2 rounded-circle ${todayAttendanceChoice === 'present' ? 'bg-white text-success' : 'bg-success text-white'}`}>
                                <Check size={20} className="fw-bold" />
                              </span>
                              {todayAttendanceChoice === 'present' && (
                                <span className="badge bg-white text-success fw-bold">Đang chọn</span>
                              )}
                            </div>
                            <div className="fw-extrabold fs-6 mb-0">CÓ MẶT</div>
                            <small className={`d-block ${todayAttendanceChoice === 'present' ? 'text-white-75' : 'text-muted'}`} style={{ fontSize: '0.72rem' }}>
                              Tham gia tập hôm nay
                            </small>
                          </button>
                        </div>

                        <div className="col-6">
                          <button
                            type="button"
                            onClick={() => handleSelectTodayChoice('absent')}
                            className={`btn w-100 p-3 rounded-4 text-start border transition-all h-100 ${
                              todayAttendanceChoice === 'absent'
                                ? 'btn-danger text-white border-danger shadow'
                                : 'btn-light border-secondary-subtle text-dark hover-shadow-sm'
                            }`}
                            style={{
                              borderWidth: todayAttendanceChoice === 'absent' ? '2px' : '1px'
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className={`p-2 rounded-circle ${todayAttendanceChoice === 'absent' ? 'bg-white text-danger' : 'bg-danger text-white'}`}>
                                <X size={20} className="fw-bold" />
                              </span>
                              {todayAttendanceChoice === 'absent' && (
                                <span className="badge bg-white text-danger fw-bold">Đang chọn</span>
                              )}
                            </div>
                            <div className="fw-extrabold fs-6 mb-0">VẮNG MẶT</div>
                            <small className={`d-block ${todayAttendanceChoice === 'absent' ? 'text-white-75' : 'text-muted'}`} style={{ fontSize: '0.72rem' }}>
                              Nghỉ có phép / vắng
                            </small>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-success rounded-4 p-3 mb-4 text-center">
                      <CheckCircle2 size={32} className="text-success mb-2" />
                      <h6 className="fw-bold mb-1">Khóa Học Đã Hoàn Thành Toàn Bộ!</h6>
                      <small className="text-muted">
                        Học viên đã hoàn thành tất cả {sessionStates.length}/{sessionStates.length} buổi học. Tất cả các buổi đã được khóa cố định.
                      </small>
                    </div>
                  )}

                  {/* PHẦN 2: LỘ TRÌNH KHÓA HỌC (CHẾ ĐỘ XEM - KHÓA QUÁ KHỨ & TƯƠNG LAI) */}
                  <div className="p-3 bg-light rounded-4 border mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold small text-dark">
                        Tiến độ khóa học ({sessionStates.length} buổi):
                      </span>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        🔒 Quá khứ & Tương lai được khóa
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {sessionStates.map((status, idx) => {
                        const isPast = currentSessionIndex !== -1 ? idx < currentSessionIndex : true;
                        const isCurrent = idx === currentSessionIndex;

                        let bgClass = 'bg-light text-muted border';
                        let label = `B${idx + 1}`;
                        let title = `Buổi ${idx + 1}: Chưa đến ngày (Khóa)`;

                        if (isPast) {
                          if (status === 'present') {
                            bgClass = 'bg-success text-white';
                            label = `B${idx + 1} ✓`;
                            title = `Buổi ${idx + 1}: Đã có mặt (Đã qua - Khóa)`;
                          } else {
                            bgClass = 'bg-danger text-white';
                            label = `B${idx + 1} ✕`;
                            title = `Buổi ${idx + 1}: Đã vắng (Đã qua - Khóa)`;
                          }
                        } else if (isCurrent) {
                          bgClass = todayAttendanceChoice === 'present' ? 'bg-success text-white border-2 border-dark' : 'bg-danger text-white border-2 border-dark';
                          label = `B${idx + 1} ★`;
                          title = `Buổi ${idx + 1}: Đang điểm danh hôm nay`;
                        }

                        return (
                          <div
                            key={idx}
                            title={title}
                            className={`badge px-2 py-2 d-inline-flex align-items-center gap-1 ${bgClass} ${
                              isCurrent ? 'shadow-sm' : 'opacity-85'
                            }`}
                            style={{
                              fontSize: '0.75rem',
                              cursor: 'default',
                              border: isCurrent ? '2px solid #0f172a' : undefined
                            }}
                          >
                            <span>{label}</span>
                            {isCurrent && <span style={{ fontSize: '0.65rem' }}>[Hôm nay]</span>}
                            {!isCurrent && <span className="opacity-50" style={{ fontSize: '0.65rem' }}>🔒</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-muted small pt-1 border-top" style={{ fontSize: '0.75rem' }}>
                      <span>
                        Đã học: <strong className="text-success">{sessionStates.filter((s, i) => (currentSessionIndex !== -1 ? i < currentSessionIndex : true) && s === 'present').length + (currentSessionIndex !== -1 && todayAttendanceChoice === 'present' ? 1 : 0)}</strong> buổi
                      </span>
                      <span>
                        Vắng: <strong className="text-danger">{sessionStates.filter((s, i) => (currentSessionIndex !== -1 ? i < currentSessionIndex : true) && s === 'absent').length + (currentSessionIndex !== -1 && todayAttendanceChoice === 'absent' ? 1 : 0)}</strong> buổi
                      </span>
                      <span>
                        Còn lại: <strong className="text-primary">{Math.max(0, sessionStates.length - (currentSessionIndex !== -1 ? currentSessionIndex + 1 : sessionStates.length))}</strong> buổi
                      </span>
                    </div>
                  </div>

                  {/* PHẦN 3: ĐÁNH GIÁ & GHI CHÚ NHANH (TỐI GIẢN) */}
                  <div className="p-3 bg-light rounded-4 border">
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-sm-5">
                        <label className="form-label small fw-bold text-dark mb-1">
                          Điểm DUPR (2.0 - 6.0):
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          min="2.0"
                          max="6.0"
                          className="form-control form-control-sm"
                          value={gradingForm.duprRating}
                          onChange={(e) => setGradingForm({ ...gradingForm, duprRating: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-7">
                        <label className="form-label small fw-bold text-dark mb-1">
                          Trạng thái khóa học:
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={gradingForm.status}
                          onChange={(e) => setGradingForm({ ...gradingForm, status: e.target.value })}
                        >
                          <option value="confirmed">Đang theo học (Confirmed)</option>
                          <option value="completed">Đã tốt nghiệp (Completed)</option>
                          <option value="paused">Bảo lưu khóa học (Paused)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label small fw-bold text-dark mb-1">
                        Nhận xét nhanh của HLV:
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={gradingForm.coachFeedback}
                        onChange={(e) => setGradingForm({ ...gradingForm, coachFeedback: e.target.value })}
                        placeholder="VD: Học viên tiếp thu bài tốt, bộ chân Split-step ổn định..."
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Gọn Gàng */}
                <div className="modal-footer bg-light p-3 border-top d-flex justify-content-between flex-shrink-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3 py-2 fw-bold"
                    onClick={() => setGradingModalEnr(null)}
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-4 py-2 fw-extrabold shadow-sm d-flex align-items-center gap-2"
                  >
                    <Check size={18} />
                    <span>
                      {currentSessionIndex !== -1
                        ? `Lưu Điểm Danh Buổi ${currentSessionIndex + 1}`
                        : 'Lưu Thông Tin'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
