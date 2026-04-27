"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MemberEditPage() {
  const router = useRouter();
  
  // 사용자의 실시간 상태 관리를 위한 state
  const [user, setUser] = useState({
    uid: "",
    name: "",
  });
  const [loading, setLoading] = useState(true);

  // 1. 페이지 로드 시 기존 사용자 정보 가져오기 (Flask GET /member/edit)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://192.168.0.12:5000/member/edit', {
          method: 'GET',
          // 세션/쿠키를 사용하는 경우 인증 정보 포함 설정이 필요할 수 있습니다.
          credentials: 'include' 
        });
        const result = await res.json();

        if (res.ok && result.success) {
          setUser(result.user); // Flask에서 보낸 {uid, name} 설정
        } else {
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          router.push('/login');
        }
      } catch (err) {
        console.error("데이터 로딩 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // 2. 정보 수정 요청 (Flask POST /member/edit)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('http://192.168.0.12:5000/member/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("회원 정보가 성공적으로 수정되었습니다!");
        router.push('/'); // 수정 완료 후 마이페이지로 이동
      } else {
        alert(result.message || "수정 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("수정 요청 에러:", err);
      alert("서버와 통신할 수 없습니다. Flask 서버 상태를 확인하세요.");
    }
  };

  if (loading) return <div className="text-center mt-5">로딩 중...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0 font-weight-bold">내 정보 수정</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* 아이디 표시 (수정 불가) */}
                <div className="mb-4">
                  <label className="form-label text-secondary small font-weight-bold">아이디</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    value={user.uid}
                    disabled
                  />
                  <div className="form-text text-muted">아이디는 변경할 수 없습니다.</div>
                </div>

                {/* 이름 입력 */}
                <div className="mb-4">
                  <label className="form-label font-weight-bold">이름</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control border-primary-subtle"
                    defaultValue={user.name}
                    required
                  />
                </div>

                {/* 비밀번호 입력 */}
                <div className="mb-4">
                  <label className="form-label font-weight-bold">새 비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control border-primary-subtle"
                    placeholder="비밀번호 변경 시에만 입력"
                  />
                  <small className="text-danger mt-1 d-block">
                    * 비워두면 기존 비밀번호가 유지됩니다.
                  </small>
                </div>

                <div className="d-grid gap-2 mt-5">
                  <button type="submit" className="btn btn-primary py-2 font-weight-bold shadow-sm">
                    정보 업데이트
                  </button>
                  <button 
                    type="button" 
                    onClick={() => router.back()} 
                    className="btn btn-outline-secondary py-2"
                  >
                    취소하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}