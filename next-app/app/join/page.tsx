"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();

  // ✅ API 주소를 로그인 페이지와 동일하게 설정
  const API_BASE_URL = "http://192.168.0.12:5000"; 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // ✅ 서버(app.py)가 기대하는 키값(uid, upw, name)으로 데이터를 준비합니다.
    const payload = {
      uid: formData.get("uid"),
      upw: formData.get("upw"), // 🚨 input name을 upw로 바꿀 예정입니다.
      name: formData.get("name")
    };

    try {
      const res = await fetch(`${API_BASE_URL}/join`, { // ✅ IP 주소 수정
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // ✅ 정리된 payload 전송
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("회원가입이 완료되었습니다!");
        router.push('/login');
      } else {
        alert(result.message || "가입 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("통신 에러:", err);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold text-success">회원가입</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">아이디</label>
                  <input type="text" name="uid" className="form-control" placeholder="아이디" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">비밀번호</label>
                  {/* ✅ name을 password에서 upw로 수정 (Flask와 일치) */}
                  <input type="password" name="upw" className="form-control" placeholder="비밀번호" required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">이름</label>
                  <input type="text" name="name" className="form-control" placeholder="실명" required />
                </div>
                <button type="submit" className="btn btn-success w-100 py-2 fw-bold">
                  가입하기
                </button>
              </form>
              {/* ... 하단 로그인 링크 생략 ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}