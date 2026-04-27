"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{ isLoggedIn: boolean; user_name: string } | null>(null);

  const API_BASE_URL = "http://192.168.0.12:5000";

  const checkAuth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/check-auth`, {
      method: "GET", // 명시적으로 GET 지정
      credentials: "include", // 세션 쿠키 포함
      headers: {
        "Accept": "application/json",
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log("인증 확인 결과:", data); // 👈 브라우저 F12 콘솔에서 확인용
      setAuth(data);
    } else {
      // 서버가 401 등을 보냈을 때
      setAuth({ isLoggedIn: false, user_name: "" });
    }
  } catch (e) {
    console.error("인증 서버 연결 실패:", e);
    setAuth({ isLoggedIn: false, user_name: "" }); // 에러 나면 로그인 안 된 걸로 처리해서 "확인 중" 문구 제거
  }
};

  useEffect(() => {
  // 1. 페이지 로드 시 인증 확인
  checkAuth();

  const handlePageShow = (event: PageTransitionEvent) => {
    // 최신 브라우저의 탐색 타입 확인 (navigation timing API)
    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    
    // event.persisted: 브라우저 캐시(Bfcache)에서 복구된 경우
    // navigationEntry?.type === "back_forward": 뒤로가기/앞으로가기인 경우
    if (event.persisted || navigationEntry?.type === "back_forward") {
      console.log("뒤로가기/캐시 복구 감지: 인증 재확인");
      checkAuth();
    }
  };

  window.addEventListener("pageshow", handlePageShow);
  
  return () => {
    window.removeEventListener("pageshow", handlePageShow);
  };
}, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("로그아웃 하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/logout`, { credentials: "include" });
      if (res.ok) {
        alert("로그아웃 되었습니다.");
        window.location.href = "/"; 
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <html lang="ko">
      <head>
        <title>MBC 시스템</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </head>

      <body style={{ paddingTop: "80px" }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm" style={{ backgroundColor: '#1a1a1a !important' }}>
          <div className="container">
            <a className="navbar-brand fw-bold" href="/" style={{ color: '#ffffff !important' }}>
              MBC 시스템
            </a>
            
            <button 
              className="navbar-toggler border-secondary" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link fw-semibold" href="/board" style={{ color: '#ffffff !important' }}>
                    자유게시판
                  </a>
                </li>
              </ul>

              <ul className="navbar-nav ms-auto align-items-center">
                {auth === null ? (
                  <li className="nav-item text-secondary small">인증 확인 중...</li>
                ) : auth.isLoggedIn ? (
                  <>
                    <li className="nav-item">
                      {/* ✅ 사용자 이름을 클릭하면 수정 페이지로 이동하는 링크로 변경 */}
                      <a 
                        href="/mypage" 
                        className="nav-link fw-bold me-3 user-modify-link" 
                        style={{ 
                          color: '#ffffff !important', 
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        title="내 정보 수정"
                      >
                        👤 {auth.user_name || "사용자"}님
                      </a>
                    </li>
                    <li className="nav-item">
                      <button 
                        className="btn btn-outline-light btn-sm fw-bold px-3" 
                        onClick={handleLogout}
                        style={{ borderRadius: '20px' }}
                      >
                        로그아웃
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <a className="nav-link fw-semibold me-3" href="/login" style={{ color: '#ffffff !important' }}>
                        로그인
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="btn btn-primary btn-sm fw-bold px-4" href="/join" style={{ borderRadius: '20px' }}>
                        회원가입
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <main className="container">{children}</main>

        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
          strategy="afterInteractive" 
        />

        {/* ✅ 마우스 호버 시 살짝 투명해지는 효과 추가 */}
        <style jsx>{`
          .user-modify-link:hover {
            opacity: 0.7;
            text-decoration: underline !important;
          }
        `}</style>
      </body>
    </html>
  );
}