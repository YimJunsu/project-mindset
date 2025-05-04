import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../context/apiService';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { logout } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    address: '',
    addressDetail: '',
    postCode: '',
  });

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getMyProfile();
      setUserData(res.data);
      setFormData({
        nickname: res.data.nickname || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        addressDetail: res.data.addressDetail || '',
        postCode: res.data.postCode || '',
      });
    } catch (err) {
      console.error(err);
      setError('사용자 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    if (isEditing && userData) {
      setFormData({
        nickname: userData.nickname || '',
        phone: userData.phone || '',
        address: userData.address || '',
        addressDetail: userData.addressDetail || '',
        postCode: userData.postCode || '',
      });
    }
    setIsEditing(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await userAPI.updateProfile(formData);
      setUserData(res.data);
      setIsEditing(false);
      alert('프로필이 업데이트되었습니다.');
    } catch (err) {
      console.error(err);
      setError('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;

    try {
      await userAPI.deleteAccount();
      logout();
      navigate('/');
      alert('계정이 삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('계정 삭제에 실패했습니다.');
    }
  };

  if (loading && !userData) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  if (error && !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-4 text-center">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          style={{ backgroundColor: getColor('primary') }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-32">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">마이페이지</h1>

      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-700">
          <img
            src={userData?.profileImage || '/default.png'}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/default.png' }}
          />
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-6">
          <Info label="이메일" value={userData.email} underline />
          <Info label="닉네임" value={userData.nickname} underline />
          <Info
            label="성별"
            value={userData.gender === 'M' ? '남성' : userData.gender === 'F' ? '여성' : '정보 없음'}
            underline
          />
          <Info label="전화번호" value={userData.phone || '-'} underline />
          <Info
            label="주소"
            value={`${userData.address} ${userData.addressDetail} (${userData.postCode})`}
            underline
          />

          <div className="flex space-x-4 pt-6">
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              style={{ backgroundColor: getColor('primary') }}
            >
              정보 수정
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              계정 탈퇴
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {[{ label: '이메일', name: 'email', value: userData.email, disabled: true },
            { label: '닉네임', name: 'nickname' },
            { label: '전화번호', name: 'phone' },
            { label: '주소', name: 'address' },
            { label: '상세 주소', name: 'addressDetail' },
            { label: '우편번호', name: 'postCode' }]
            .map(({ label, name, value, disabled }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={disabled ? value : formData[name]}
                  onChange={disabled ? undefined : handleChange}
                  disabled={disabled}
                  className={`mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 ${
                    disabled
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
              </div>
            ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              style={{ backgroundColor: getColor('primary') }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={toggleEditMode}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const Info = ({ label, value, underline }) => (
  <div className={`pb-3 ${underline ? 'border-b border-gray-300 dark:border-gray-700' : ''}`}>
    <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h2>
    <p className="mt-1 text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default MyPage;
