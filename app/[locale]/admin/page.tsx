'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Users,
  Shield,
  UserX,
  Trash2,
  RefreshCw,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';

type Locale = 'ko' | 'mn' | 'ru' | 'vi';
type UserRole = 'student' | 'teacher' | 'admin' | 'parent';
type UserStatus = 'active' | 'suspended';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  locale: Locale;
  image: string | null;
  createdAt: string;
};

const titles: Record<Locale, string> = {
  ko: '관리자 패널',
  mn: 'Админ хэсэг',
  ru: 'Панель администратора',
  vi: 'Bảng điều khiển',
};

const labels: Record<Locale, Record<string, string>> = {
  ko: {
    userManagement: '회원 관리',
    name: '이름',
    email: '이메일',
    role: '역할',
    status: '상태',
    joinDate: '가입일',
    actions: '작업',
    student: '학생',
    teacher: '교사',
    admin: '관리자',
    parent: '학부모',
    active: '활성',
    suspended: '정지',
    suspend: '정지',
    activate: '활성화',
    delete: '삭제',
    confirmDelete: '정말 삭제하시겠습니까?',
    confirmSuspend: '정말 정지하시겠습니까?',
    search: '검색...',
    noUsers: '사용자가 없습니다',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    refresh: '새로고침',
    totalUsers: '총 사용자',
    cannotModifySelf: '자신의 계정은 수정할 수 없습니다',
  },
  mn: {
    userManagement: 'Хэрэглэгч удирдах',
    name: 'Нэр',
    email: 'И-мэйл',
    role: 'Дүр',
    status: 'Төлөв',
    joinDate: 'Бүртгүүлсэн',
    actions: 'Үйлдэл',
    student: 'Оюутан',
    teacher: 'Багш',
    admin: 'Админ',
    parent: 'Эцэг эх',
    active: 'Идэвхтэй',
    suspended: 'Түр зогсоосон',
    suspend: 'Түр зогсоох',
    activate: 'Идэвхжүүлэх',
    delete: 'Устгах',
    confirmDelete: 'Устгахдаа итгэлтэй байна уу?',
    confirmSuspend: 'Түр зогсоохдоо итгэлтэй байна уу?',
    search: 'Хайх...',
    noUsers: 'Хэрэглэгч байхгүй',
    loading: 'Ачаалж байна...',
    error: 'Алдаа гарлаа',
    refresh: 'Шинэчлэх',
    totalUsers: 'Нийт хэрэглэгч',
    cannotModifySelf: 'Өөрийн бүртгэлийг өөрчлөх боломжгүй',
  },
  ru: {
    userManagement: 'Управление пользователями',
    name: 'Имя',
    email: 'Email',
    role: 'Роль',
    status: 'Статус',
    joinDate: 'Дата регистрации',
    actions: 'Действия',
    student: 'Ученик',
    teacher: 'Учитель',
    admin: 'Администратор',
    parent: 'Родитель',
    active: 'Активен',
    suspended: 'Заблокирован',
    suspend: 'Заблокировать',
    activate: 'Активировать',
    delete: 'Удалить',
    confirmDelete: 'Вы уверены, что хотите удалить?',
    confirmSuspend: 'Вы уверены, что хотите заблокировать?',
    search: 'Поиск...',
    noUsers: 'Нет пользователей',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    refresh: 'Обновить',
    totalUsers: 'Всего пользователей',
    cannotModifySelf: 'Нельзя изменить свой аккаунт',
  },
  vi: {
    userManagement: 'Quản lý người dùng',
    name: 'Tên',
    email: 'Email',
    role: 'Vai trò',
    status: 'Trạng thái',
    joinDate: 'Ngày tham gia',
    actions: 'Thao tác',
    student: 'Học sinh',
    teacher: 'Giáo viên',
    admin: 'Quản trị viên',
    parent: 'Phụ huynh',
    active: 'Hoạt động',
    suspended: 'Đình chỉ',
    suspend: 'Đình chỉ',
    activate: 'Kích hoạt',
    delete: 'Xóa',
    confirmDelete: 'Bạn có chắc chắn muốn xóa?',
    confirmSuspend: 'Bạn có chắc chắn muốn đình chỉ?',
    search: 'Tìm kiếm...',
    noUsers: 'Không có người dùng',
    loading: 'Đang tải...',
    error: 'Đã xảy ra lỗi',
    refresh: 'Làm mới',
    totalUsers: 'Tổng người dùng',
    cannotModifySelf: 'Không thể sửa đổi tài khoản của bạn',
  },
};

const roleColors: Record<UserRole, string> = {
  student: 'bg-blue-100 text-blue-800',
  teacher: 'bg-green-100 text-green-800',
  admin: 'bg-purple-100 text-purple-800',
  parent: 'bg-orange-100 text-orange-800',
};

const statusColors: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  suspended: 'bg-red-100 text-red-800',
};

export default function AdminPage() {
  const { locale } = useParams();
  const currentLocale = (locale as Locale) || 'ko';
  const { data: session } = useSession();
  const t = labels[currentLocale];

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === session?.user?.id) {
      alert(t.cannotModifySelf);
      return;
    }

    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error('Failed to update role');
      }

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error('Error updating role:', err);
      alert(t.error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: UserStatus) => {
    if (userId === session?.user?.id) {
      alert(t.cannotModifySelf);
      return;
    }

    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirmMessage = newStatus === 'suspended' ? t.confirmSuspend : '';

    if (newStatus === 'suspended' && !confirm(confirmMessage)) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert(t.error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === session?.user?.id) {
      alert(t.cannotModifySelf);
      return;
    }

    if (!confirm(t.confirmDelete)) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(t.error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLocale === 'ko' ? 'ko-KR' :
      currentLocale === 'vi' ? 'vi-VN' :
      currentLocale === 'ru' ? 'ru-RU' : 'mn-MN'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-sand-100 to-oat-100">
      <Header title={titles[currentLocale]} showBack />

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* Stats Card */}
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-oat-900">
                  {t.userManagement}
                </h2>
                <p className="text-sm text-oat-500">
                  {t.totalUsers}: {users.length}
                </p>
              </div>
            </div>
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t.refresh}
            </GlassButton>
          </div>
        </GlassCard>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-oat-400" />
            <GlassInput
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <GlassCard className="mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </GlassCard>
        )}

        {/* Loading State */}
        {isLoading ? (
          <GlassCard>
            <div className="text-center py-8 text-oat-500">
              {t.loading}
            </div>
          </GlassCard>
        ) : filteredUsers.length === 0 ? (
          <GlassCard>
            <div className="text-center py-8 text-oat-500">
              {t.noUsers}
            </div>
          </GlassCard>
        ) : (
          /* Users Table */
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-oat-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-oat-700">
                      {t.name}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-oat-700">
                      {t.email}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-oat-700">
                      {t.role}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-oat-700">
                      {t.status}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-oat-700">
                      {t.joinDate}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-oat-700">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const isSelf = user.id === session?.user?.id;
                    const isUpdating = updatingUserId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-oat-100 hover:bg-oat-50/50 ${
                          isSelf ? 'bg-purple-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt=""
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-oat-200 flex items-center justify-center">
                                <span className="text-sm text-oat-600">
                                  {(user.name || user.email)[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-oat-900">
                              {user.name || '-'}
                            </span>
                            {isSelf && (
                              <span className="text-xs text-purple-600 font-medium">
                                (You)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-oat-700">{user.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value as UserRole)
                            }
                            disabled={isSelf || isUpdating}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              roleColors[user.role]
                            } border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <option value="student">{t.student}</option>
                            <option value="teacher">{t.teacher}</option>
                            <option value="admin">{t.admin}</option>
                            <option value="parent">{t.parent}</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              statusColors[user.status]
                            }`}
                          >
                            {t[user.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-oat-600">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusToggle(user.id, user.status)}
                              disabled={isSelf || isUpdating}
                              className={`p-2 rounded-lg transition-colors ${
                                isSelf || isUpdating
                                  ? 'text-oat-300 cursor-not-allowed'
                                  : user.status === 'active'
                                  ? 'text-orange-500 hover:bg-orange-100'
                                  : 'text-green-500 hover:bg-green-100'
                              }`}
                              title={user.status === 'active' ? t.suspend : t.activate}
                            >
                              {user.status === 'active' ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={isSelf || isUpdating}
                              className={`p-2 rounded-lg transition-colors ${
                                isSelf || isUpdating
                                  ? 'text-oat-300 cursor-not-allowed'
                                  : 'text-red-500 hover:bg-red-100'
                              }`}
                              title={t.delete}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
