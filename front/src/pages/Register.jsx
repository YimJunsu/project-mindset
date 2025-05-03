import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    gender: '',
    phone: '',
    address: '',
    addressDetail: '',
    postCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { signup } = useAuth();
  const { getColor } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = '유효한 이메일 형식이 아닙니다.';
    if (!formData.password) errors.password = '비밀번호를 입력해주세요.';
    else if (formData.password.length < 5) errors.password = '비밀번호는 최소 5자 이상이어야 합니다.';
    else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(formData.password)) errors.password = '영문자, 숫자, 특수문자를 포함해야 합니다.';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!formData.nickname) errors.nickname = '닉네임을 입력해주세요.';
    if (!formData.gender) errors.gender = '성별을 선택해주세요.';
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) errors.phone = '전화번호는 10~11자리 숫자만 입력 가능합니다.';
    if (!formData.address) errors.address = '주소를 입력해주세요.';
    if (!formData.addressDetail) errors.addressDetail = '상세 주소를 입력해주세요.';
    if (!formData.postCode || !/^\d{5}$/.test(formData.postCode)) errors.postCode = '우편번호는 5자리 숫자여야 합니다.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
          postCode: data.zonecode,
        }));
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate('/');
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">회원가입</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">마인드SET에 가입하고 자기개발을 시작하세요</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              이메일 *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              비밀번호 *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              비밀번호 확인 *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              닉네임 *
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.nickname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.nickname && <p className="mt-1 text-sm text-red-500">{formErrors.nickname}</p>}
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              성별 *
            </label>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === 'M'}
                  onChange={handleChange}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-500 border-gray-300"
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
                  className="focus:ring-orange-500 h-4 w-4 text-orange-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">여성</span>
              </label>
            </div>
            {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
          </div>

          {/* 전화번호 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              전화번호
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="숫자만 입력 (예: 01012345678)"
              className={`mt-1 block w-full rounded-md border ${formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
          </div>

          {/* 주소 검색 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              주소 *
            </label>
            <div className="flex gap-2">
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                readOnly
                className={`mt-1 block w-full rounded-md border ${formErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3`}
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="mt-1 px-4 py-2 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
              >
                주소 검색
              </button>
            </div>
            {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
          </div>

          {/* 상세 주소 */}
          <div>
            <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              상세 주소 *
            </label>
            <input
              id="addressDetail"
              name="addressDetail"
              type="text"
              value={formData.addressDetail}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.addressDetail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.addressDetail && <p className="mt-1 text-sm text-red-500">{formErrors.addressDetail}</p>}
          </div>

          {/* 우편번호 */}
          <div>
            <label htmlFor="postCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              우편번호 *
            </label>
            <input
              id="postCode"
              name="postCode"
              type="text"
              value={formData.postCode}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${formErrors.postCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            />
            {formErrors.postCode && <p className="mt-1 text-sm text-red-500">{formErrors.postCode}</p>}
          </div>

          {/* 회원가입 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              style={{ backgroundColor: loading ? '#ccc' : getColor('primary') }}
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-orange-500 hover:text-orange-600" style={{ color: getColor('primary') }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
