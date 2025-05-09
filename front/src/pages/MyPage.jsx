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
  const [isOAuthUser, setIsOAuthUser] = useState(false);

  const { logout } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    gender: 'N',
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
      
      // OAuth 사용자 여부 확인
      setIsOAuthUser(res.data.oauthProvider != null);
      
      setFormData({
        nickname: res.data.nickname || '',
        gender: res.data.gender || 'N',
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
        gender: userData.gender || 'N',
        phone: userData.phone || '',
        address: userData.address || '',
        addressDetail: userData.addressDetail || '',
        postCode: userData.postCode || '',
      });
    }
    setIsEditing(prev => !prev);
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setFormData(prev => ({
          ...prev,
          address: fullAddress,
          postCode: data.zonecode,
        }));
      },
    }).open();
  };

  // 프로필 업데이트 함수 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // FormData 객체 생성
      const form = new FormData();
      form.append('nickname', formData.nickname);
      form.append('gender', formData.gender);
      form.append('phone', formData.phone || '');
      form.append('address', formData.address || '');
      form.append('addressDetail', formData.addressDetail || '');
      form.append('postCode', formData.postCode || '');
      
      console.log('프로필 업데이트 요청 전송 직전');
      
      // 직접 axios 사용 방지
      const res = await userAPI.updateProfile(form);
      console.log('프로필 업데이트 응답:', res.data);
      setUserData(res.data);
      setIsEditing(false);
      alert('프로필이 업데이트되었습니다.');
    } catch (err) {
      console.error('프로필 업데이트 오류:', err);
      // 오류 메시지에 디버깅 정보 포함
      if (err.response) {
        setError(`프로필 업데이트에 실패했습니다. 상태: ${err.response.status}, 메시지: ${err.response.data.message || '알 수 없는 오류'}`);
      } else {
        setError('프로필 업데이트에 실패했습니다: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 계정 삭제 함수 수정
  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 계정을 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;

    try {
      console.log('계정 삭제 요청 시작');
      // API 호출 수정
      await userAPI.deleteAccount();
      console.log('계정 삭제 성공');
      logout();
      navigate('/');
      alert('계정이 삭제되었습니다.');
    } catch (err) {
      console.error('계정 삭제 오류:', err);
      alert('계정 삭제에 실패했습니다: ' + (err.response?.data?.message || err.message));
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

      {isOAuthUser && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
          <p className="font-medium">소셜 로그인으로 연결된 계정입니다.</p>
          <p className="text-sm mt-1">
            {userData?.oauthProvider === 'KAKAO' ? '카카오' : userData?.oauthProvider} 계정과 연결되어 있습니다.
          </p>
        </div>
      )}

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
            value={
              userData.gender === 'M' 
                ? '남성' 
                : userData.gender === 'F' 
                  ? '여성' 
                  : '선택 안함'
            }
            underline
          />
          <Info label="전화번호" value={userData.phone || '-'} underline />
          <Info
            label="주소"
            value={
              userData.address 
                ? `${userData.address} ${userData.addressDetail || ''} (${userData.postCode || ''})`
                : '-'
            }
            underline
          />
          {userData.oauthProvider && (
            <Info
              label="소셜 로그인"
              value={userData.oauthProvider === 'KAKAO' ? '카카오 계정' : userData.oauthProvider}
              underline
            />
          )}

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
          {/* 이메일 (수정 불가) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              이메일
            </label>
            <input
              type="text"
              value={userData.email}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              닉네임
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              성별
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === 'M'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-orange-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">남성</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={formData.gender === 'F'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-orange-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">여성</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="N"
                  checked={formData.gender === 'N'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-orange-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">선택 안함</span>
              </label>
            </div>
          </div>
          
          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              전화번호
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          {/* 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              주소
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                readOnly
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="mt-1 px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                주소 검색
              </button>
            </div>
          </div>
          
          {/* 상세 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              상세 주소
            </label>
            <input
              type="text"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          {/* 우편번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              우편번호
            </label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3"
            />
          </div>

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