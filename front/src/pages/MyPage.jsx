import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI, getImageUrl } from '../context/apiService';
import workoutPostAPI from '../context/WorkoutPostApi';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  
  // 프로필 이미지 관련 상태 추가
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // 게시글 목록 관련 상태 추가
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [lastPostId, setLastPostId] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const { logout } = useAuth();
  const { getColor, darkMode } = useTheme();
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
      
      // 사용자 정보를 불러온 후 내가 작성한 게시글 목록도 불러옴
      if (res.data.userId) {
        loadMyPosts(res.data.userId);
      }
    } catch (err) {
      console.error(err);
      setError('사용자 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 내가 쓴 게시글 목록 불러오기
  const loadMyPosts = async (userId, reset = true) => {
    try {
      setPostsLoading(true);
      const currentLastPostId = reset ? null : lastPostId;
      
      if (!hasMorePosts && !reset) {
        return;
      }
      
      const res = await workoutPostAPI.getUserWorkoutPosts(
        userId, 
        currentLastPostId, 
        5
      );
      
      const newPosts = res.data.posts;
      
      setMyPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setLastPostId(res.data.lastPostId);
      setHasMorePosts(res.data.hasNext);
    } catch (err) {
      console.error('내가 쓴 게시글 불러오기 실패:', err);
    } finally {
      setPostsLoading(false);
    }
  };
  
  // 더 불러오기 버튼 클릭 핸들러
  const handleLoadMorePosts = () => {
    if (userData && userData.userId) {
      loadMyPosts(userData.userId, false);
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
      // 편집 모드 종료 시 파일 선택 및 미리보기 초기화
      setSelectedFile(null);
      setPreviewImage(null);
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

  // 파일 선택 핸들러 추가
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // 미리보기 이미지 설정
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // handleUploadProfileImage 메서드 수정
  const handleUploadProfileImage = async () => {
    if (!selectedFile) {
      alert('이미지 파일을 선택해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('프로필 이미지 업로드 시작:', selectedFile);
      
      const response = await userAPI.uploadProfileImage(selectedFile);
      console.log('프로필 이미지 업로드 응답:', response.data);
      
      const updatedProfileImage = response.data.profileImage;
      console.log('업데이트된 프로필 이미지 경로:', updatedProfileImage);
      
      // 사용자 데이터 업데이트
      setUserData(prev => {
        const newData = {
          ...prev,
          profileImage: updatedProfileImage
        };
        console.log('업데이트된 사용자 데이터:', newData);
        return newData;
      });
      
      // 상태 초기화
      setPreviewImage(null);
      setSelectedFile(null);
      
      alert('프로필 이미지가 업데이트되었습니다.');
      await loadUser();
    } catch (err) {
      console.error('프로필 이미지 업로드 오류:', err);
      alert('프로필 이미지 업로드에 실패했습니다: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleSelectFileClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // FormData 객체 생성 (파일 업로드를 위해)
      const form = new FormData();
      form.append('nickname', formData.nickname);
      form.append('gender', formData.gender);
      form.append('phone', formData.phone || '');
      form.append('address', formData.address || '');
      form.append('addressDetail', formData.addressDetail || '');
      form.append('postCode', formData.postCode || '');
      
      const res = await userAPI.updateProfile(form);
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

  // 게시글 상세보기로 이동
  const handleViewPostDetail = (postId) => {
    navigate(`/workout/post/${postId}`);
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
    <div className="max-w-4xl mx-auto p-6 mt-24 bg-white dark:bg-gray-800 rounded-lg shadow-md my-12">

      {isOAuthUser && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
          <p className="font-medium">소셜 로그인으로 연결된 계정입니다.</p>
          <p className="text-sm mt-1">
            {userData?.oauthProvider === 'KAKAO' ? '카카오' : userData?.oauthProvider} 계정과 연결되어 있습니다.
          </p>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-700 relative">
        {previewImage ? (
            <img
              src={previewImage}
              alt="프로필 이미지 미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={getImageUrl(userData?.profileImage)}  // getProfileImageUrl 대신 getImageUrl 사용
              alt="프로필 이미지"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/default.png' }}
            />
          )}
          
          {/* 일반 회원인 경우에만 프로필 이미지 변경 버튼 표시 */}
          {!isOAuthUser && isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={handleSelectFileClick}
                className="px-2 py-1 bg-white text-sm text-gray-800 rounded hover:bg-gray-100"
              >
                사진 변경
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 선택된 파일이 있고, 일반 회원인 경우 업로드 버튼 표시 */}
      {selectedFile && !isOAuthUser && isEditing && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleUploadProfileImage}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            프로필 이미지 업로드
          </button>
        </div>
      )}

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
      
      {/* 내가 쓴 게시글 섹션 추가 */}
      <div className="mt-12 border-t pt-8 border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          내가 작성한 운동 인증 게시글
        </h2>
        
        {postsLoading && myPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4">게시글을 불러오는 중...</p>
          </div>
        ) : myPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">작성한 게시글이 없습니다.</p>
            <Link 
              to="/workout/post/create" 
              className="inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              style={{ backgroundColor: getColor('primary') }}
            >
              새 게시글 작성하기
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      조회수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      좋아요
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      작성일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {myPosts.map((post) => (
                    <tr 
                      key={post.workoutPost.postId} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                      onClick={() => handleViewPostDetail(post.workoutPost.postId)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100">
                          {post.workoutPost.workoutCategory || '기타'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.workoutPost.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {post.workoutPost.viewCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {post.workoutPost.likeCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.workoutPost.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {hasMorePosts && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMorePosts}
                  className={`px-4 py-2 rounded-lg ${
                    postsLoading 
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                  disabled={postsLoading}
                  style={{ backgroundColor: postsLoading ? undefined : getColor('primary') }}
                >
                  {postsLoading ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
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