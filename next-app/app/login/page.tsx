"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 1. API 주소를 변수로 관리 (layout.tsx와 맞춰주세요)
  const API_BASE_URL = "http://192.168.0.12:5000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const uid = formData.get("uid");
    const upw = formData.get("upw");

    setIsLoading(true);

    try {
      // ✅ 2. API_BASE_URL 변수 사용
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, upw }),
        credentials: "include", 
      });

      // 서버 응답이 200번대가 아닐 경우 에러 처리 (Flask의 401 응답 등)
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "아이디 또는 비밀번호가 틀렸습니다.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        // ✅ 3. 이름이 없을 경우를 대비한 기본값 처리
        const welcomeName = result.user_name || "회원";
        alert(`${welcomeName}님 환영합니다!`);
        window.location.href = "/"; 
      }
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
      alert("서버 연결에 실패했습니다. 네트워크 상태를 확인하세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold text-primary">로그인</h3>
              
              {/* 7. action 속성은 절대 넣지 마세요. 오직 onSubmit만 사용합니다. */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">아이디</label>
                  <input 
                    type="text" 
                    name="uid" 
                    className="form-control" 
                    placeholder="아이디를 입력하세요"
                    required 
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">비밀번호</label>
                  <input 
                    type="password" 
                    name="upw" 
                    className="form-control" 
                    placeholder="비밀번호를 입력하세요"
                    required 
                    disabled={isLoading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : null}
                  {isLoading ? "로그인 처리 중..." : "로그인"}
                </button>
              </form>

              <div className="mt-3 text-center">
                <a href="/join" className="text-decoration-none small text-muted">
                  아직 회원이 아니신가요? <span className="text-primary fw-bold">회원가입</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}