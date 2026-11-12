import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Calendar,
  ShoppingBag,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateCourseDates } from '../data/courts';

export default function UserProfileModal({
  isOpen,
  onClose,
  enrollments,
  courtBookings,
  onCancelCourtBooking,
  shopOrders
}) {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('learning');
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    level: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        level: currentUser.level || 'DUPR 2.5 - Beginner'
      });
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getEnrStats = (enr) => {
    let total = enr.totalSessions || 8;
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

  // Filter personal records for Student, or show all for Admin/Coach
  const myEnrollments =
    currentUser.role === 'student'
      ? enrollments.filter(
          (e) =>
            e.studentEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
            e.studentPhone === currentUser.phone ||
            e.studentName?.toLowerCase() === currentUser.name.toLowerCase()
        )
      : enrollments;

  const myCourtBookings =
    currentUser.role === 'student'
      ? courtBookings.filter(
          (c) =>
            c.customerEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
            c.customerPhone === currentUser.phone ||
            c.customerName?.toLowerCase() === currentUser.name.toLowerCase()
        )
      : courtBookings;

  const myShopOrders =
    currentUser.role === 'student'
      ? shopOrders.filter(
          (o) =>
            o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
            o.customerPhone === currentUser.phone ||
            o.customerName?.toLowerCase() === currentUser.name.toLowerCase()
        )
      : shopOrders;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.78)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
          <div className="modal-header bg-dark text-white border-0 p-4">
            <div className="d-flex align-items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="rounded-circle object-fit-cover border border-2 border-warning"
                width="60"
                height="60"
              />
              <div>
                <span className="badge bg-warning text-dark fw-bold mb-1">
                  🏆 {currentUser.level}
                </span>
                <h5 className="modal-title fw-extrabold mb-0">{currentUser.name}</h5>
                <small className="text-white-50">
                  {currentUser.email} • SĐT: {currentUser.phone}
                </small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} />
          </div>

          <div className="modal-body p-4">
            {/* Tabs */}
            <div className="nav nav-pills gap-2 mb-4 border-bottom pb-3">
              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${
                  activeTab === 'learning' ? 'vp-btn-lime shadow-sm' : 'btn-light border text-secondary'
                }`}
                onClick={() => setActiveTab('learning')}
              >
                <GraduationCap size={16} /> Tiến Độ & Khóa Học ({myEnrollments.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${
                  activeTab === 'courts' ? 'vp-btn-lime shadow-sm' : 'btn-light border text-secondary'
                }`}
                onClick={() => setActiveTab('courts')}
              >
                <Calendar size={16} /> Lịch Đặt Sân Tập ({myCourtBookings.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${
                  activeTab === 'orders' ? 'vp-btn-lime shadow-sm' : 'btn-light border text-secondary'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={16} /> Đơn Hàng Dụng Cụ ({myShopOrders.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 py-2 d-flex align-items-center gap-1 ${
                  activeTab === 'info' ? 'vp-btn-lime shadow-sm' : 'btn-light border text-secondary'
                }`}
                onClick={() => setActiveTab('info')}
              >
                <User size={16} /> Hồ Sơ Cá Nhân
              </button>
            </div>

            {/* Tab 1: Learning History & Coach Feedback */}
            {activeTab === 'learning' && (
              <div>
                <h6 className="fw-bold text-dark mb-3">
                  Hồ Sơ Học Tập, Điểm Danh Chuyên Cần & Nhận Xét Từ Huấn Luyện Viên
                </h6>
                {myEnrollments.length === 0 ? (
                  <p className="text-secondary small">
                    Bạn chưa có khóa học nào. Hãy đăng ký khóa học để bắt đầu lộ trình nâng hạng DUPR!
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {myEnrollments.map((enr) => {
                      const stats = getEnrStats(enr);
                      const datesInfo = calculateCourseDates(
                        enr.preferredSchedule,
                        enr.startDate || enr.createdAt,
                        stats.total
                      );
                      const startDateStr = enr.startDate || datesInfo.startDate;
                      const endDateStr = enr.expectedEndDate || datesInfo.expectedEndDate;
                      const isExpanded = expandedScheduleId === enr.id;

                      const sessionDates =
                        enr.sessionDates && enr.sessionDates.length >= stats.total
                          ? enr.sessionDates
                          : datesInfo.sessionDates;

                      return (
                        <div key={enr.id} className="p-3 bg-light rounded-4 border">
                          <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                            <span className="fw-extrabold text-success fs-6">{enr.courseTitle}</span>
                            <span
                              className={`badge ${
                                enr.status === 'completed'
                                  ? 'bg-primary'
                                  : enr.status === 'confirmed'
                                  ? 'bg-success'
                                  : 'bg-warning text-dark'
                              }`}
                            >
                              {enr.status === 'completed'
                                ? 'Đã tốt nghiệp'
                                : enr.status === 'confirmed'
                                ? 'Đang theo học'
                                : 'Chờ xác nhận'}
                            </span>
                          </div>

                          <div className="row g-2 small text-secondary mb-3">
                            <div className="col-sm-6">
                              <strong>Mã hồ sơ:</strong> #{enr.id} ({enr.studentName})
                            </div>
                            <div className="col-sm-6">
                              <strong>Ca học cố định:</strong> {enr.preferredSchedule}
                            </div>
                            <div className="col-sm-6">
                              <strong>📅 Ngày bắt đầu:</strong> <span className="fw-bold text-dark">{startDateStr}</span>
                            </div>
                            <div className="col-sm-6">
                              <strong>🏁 Kết thúc dự kiến:</strong> <span className="fw-bold text-success">{endDateStr}</span>
                            </div>
                            <div className="col-sm-6">
                              <strong>HLV phụ trách:</strong>{' '}
                              {enr.coachName && enr.coachName !== 'Chưa phân công' ? (
                                <span className="fw-bold text-primary">{enr.coachName}</span>
                              ) : (
                                <span className="badge bg-warning text-dark">Chưa phân công (Chờ xếp lớp)</span>
                              )}
                            </div>
                            <div className="col-sm-6">
                              <strong>Đánh giá DUPR:</strong>{' '}
                              <strong className="text-primary">
                                {enr.duprEvaluation || 'Sẽ kiểm tra ở buổi học đầu'}
                              </strong>
                            </div>
                          </div>

                          {/* Chi tiết tiến độ buổi học của học viên */}
                          <div className="bg-white p-3 rounded-3 border mb-3">
                            <div className="d-flex justify-content-between align-items-center small mb-1">
                              <span className="fw-bold text-dark">
                                Tiến độ đào tạo: {stats.attended}/{stats.total} buổi
                              </span>
                              <span className="badge bg-success-subtle text-success fw-bold">
                                {stats.percent}%
                              </span>
                            </div>
                            <div className="progress mb-2" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${stats.percent}%` }}
                              />
                            </div>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                ✓ Đã học: {stats.attended} buổi
                              </span>
                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                🕒 Còn lại: {stats.remaining} buổi
                              </span>
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                ✕ Đã nghỉ: {stats.absent} buổi
                              </span>
                            </div>

                            {/* Nút bấm Xem Chi Tiết Lịch Học Từng Buổi */}
                            <button
                              type="button"
                              onClick={() => setExpandedScheduleId(isExpanded ? null : enr.id)}
                              className="btn btn-sm btn-outline-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-1 mt-2"
                              style={{ fontSize: '0.78rem' }}
                            >
                              <Calendar size={14} />
                              <span>
                                {isExpanded
                                  ? 'Thu gọn lịch học chi tiết'
                                  : `Xem lịch học chi tiết từng ngày (${stats.total} buổi)`}
                              </span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {/* Danh Sách Chi Tiết Từng Buổi Học Với Ngày Bắt Đầu & Kết Thúc Rõ Ràng */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-top">
                                <div className="d-flex justify-content-between align-items-center mb-2 small">
                                  <strong className="text-dark">
                                    Lịch Trình Đào Tạo Thực Tế (Sân Huấn Luyện #3):
                                  </strong>
                                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                    {startDateStr} ➔ {endDateStr}
                                  </span>
                                </div>
                                <div className="table-responsive">
                                  <table className="table table-sm table-bordered align-middle mb-0" style={{ fontSize: '0.75rem' }}>
                                    <thead className="table-light">
                                      <tr>
                                        <th style={{ width: '60px' }}>Buổi</th>
                                        <th>Ngày học</th>
                                        <th>Khung giờ</th>
                                        <th>Sân tập</th>
                                        <th>Trạng thái</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sessionDates.map((dateStr, idx) => {
                                        let statusBadge = (
                                          <span className="badge bg-light text-muted border">
                                            🕒 Chưa diễn ra
                                          </span>
                                        );

                                        if (enr.sessionsList && enr.sessionsList[idx]) {
                                          if (enr.sessionsList[idx] === 'present') {
                                            statusBadge = <span className="badge bg-success">✓ Đã có mặt</span>;
                                          } else if (enr.sessionsList[idx] === 'absent') {
                                            statusBadge = <span className="badge bg-danger">✕ Đã vắng</span>;
                                          }
                                        } else {
                                          if (idx < stats.attended) {
                                            statusBadge = <span className="badge bg-success">✓ Đã có mặt</span>;
                                          } else if (idx < stats.attended + stats.absent) {
                                            statusBadge = <span className="badge bg-danger">✕ Đã vắng</span>;
                                          }
                                        }

                                        if (idx === stats.attended + stats.absent && stats.attended + stats.absent < stats.total) {
                                          statusBadge = (
                                            <span className="badge bg-primary text-white">
                                              ⚡ Buổi tiếp theo
                                            </span>
                                          );
                                        }

                                        // Format date to Vietnamese day of week
                                        let dayLabel = '';
                                        try {
                                          const dObj = new Date(dateStr);
                                          const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                                          dayLabel = days[dObj.getDay()];
                                        } catch {}

                                        return (
                                          <tr key={idx} className={idx === stats.attended + stats.absent ? 'table-warning-subtle' : ''}>
                                            <td className="fw-bold text-center">B{idx + 1}</td>
                                            <td>
                                              <strong>{dayLabel}</strong>, {dateStr}
                                            </td>
                                            <td className="text-secondary">{enr.preferredSchedule}</td>
                                            <td>
                                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                                🏟️ Sân Huấn Luyện #3
                                              </span>
                                            </td>
                                            <td>{statusBadge}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>

                          {enr.coachFeedback && (
                            <div className="p-2 bg-white rounded-3 border small text-dark">
                              <strong>📋 Nhận xét của HLV:</strong>{' '}
                              <span className="fst-italic">"{enr.coachFeedback}"</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Court Bookings */}
            {activeTab === 'courts' && (
              <div>
                <h6 className="fw-bold text-dark mb-3">Lịch Sử Đặt Sân Tập Theo Giờ</h6>
                {myCourtBookings.length === 0 ? (
                  <p className="text-secondary small">Bạn chưa có lịch đặt sân tập nào.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {myCourtBookings.map((cb) => (
                      <div key={cb.id} className="p-3 bg-light rounded-4 border">
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-1">
                          <strong className="text-dark">{cb.courtName}</strong>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`badge ${
                                cb.status === 'cancelled' ? 'bg-danger' : 'bg-success'
                              }`}
                            >
                              {cb.status === 'cancelled' ? 'Đã hủy' : `Mã sân #${cb.id}`}
                            </span>
                            {cb.status !== 'cancelled' && onCancelCourtBooking && (
                              <button
                                type="button"
                                onClick={() => onCancelCourtBooking(cb.id)}
                                className="btn btn-sm btn-outline-danger py-0 px-2"
                              >
                                Hủy lịch
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="small text-secondary">
                          📅 Ngày: <strong>{cb.date}</strong> • 🕒 Ca: <strong>{cb.time}</strong> •
                          Tổng phí: <strong className="text-danger">{formatVND(cb.totalPrice)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Pro Shop Orders */}
            {activeTab === 'orders' && (
              <div>
                <h6 className="fw-bold text-dark mb-3">Đơn Mua Dụng Cụ Pro Shop</h6>
                {myShopOrders.length === 0 ? (
                  <p className="text-secondary small">Bạn chưa có đơn hàng dụng cụ nào.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {myShopOrders.map((ord) => (
                      <div key={ord.id} className="p-3 bg-light rounded-4 border small">
                        <div className="d-flex justify-content-between mb-1">
                          <strong>Mã đơn #{ord.id}</strong>
                          <span className="badge bg-success">
                            {ord.status === 'delivered'
                              ? 'Đã giao thành công'
                              : ord.status === 'shipping'
                              ? 'Đang giao hàng'
                              : 'Đã xác nhận'}
                          </span>
                        </div>
                        <div>Người nhận: {ord.customerName} ({ord.customerPhone})</div>
                        <div>Địa chỉ nhận: {ord.address}</div>
                        <div className="mt-1">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="text-secondary">
                              • {it.product.name} (x{it.quantity})
                            </div>
                          ))}
                        </div>
                        <div className="fw-bold text-danger mt-2 pt-2 border-top">
                          Tổng thanh toán: {formatVND(ord.totalAmount)} ({ord.paymentMethod})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Update Personal Info */}
            {activeTab === 'info' && (
              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Địa chỉ liên hệ / Nhận dụng cụ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn vp-btn-lime fw-bold px-4">
                  Lưu Thay Đổi Hồ Sơ
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
