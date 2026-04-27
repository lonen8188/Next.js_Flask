"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BoardDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loginUserId, setLoginUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://192.168.0.12:5000";

  useEffect(() => {
    const initPage = async () => {
      try {
        // 1. 게시글 정보 가져오기
        const postRes = await fetch(`${API_BASE_URL}/api/board/${id}`);
        const postData = await postRes.json();
        
        if (postData.success) {
          setPost(postData.post);
        }

        // 2. 로그인 유저 정보 가져오기 (세션 확인)
        const authRes = await fetch(`${API_BASE_URL}/check-auth`, { credentials: "include" });
        const authData = await authRes.json();

        // Flask에서 보낸 isLoggedIn과 user_id 확인
        if (authData.isLoggedIn) {
          setLoginUserId(authData.user_id ? Number(authData.user_id) : null);
        }
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) initPage();
  }, [id]);

  // 삭제 로직 추가
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/board/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();

      if (data.success) {
        alert("삭제되었습니다.");
        router.push("/board");
      } else {
        alert(data.message || "삭제 실패");
      }
    } catch (err) {
      console.error("삭제 중 오류:", err);
      alert("서버 통신 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="container mt-5 text-center">로딩 중...</div>;
  if (!post) return <div className="container mt-5 text-center">게시글을 찾을 수 없습니다.</div>;

  // 본인 확인 (로그인 유저 ID와 게시글 작성자 ID 비교)
  const isAuthor = loginUserId !== null && post.author_id !== undefined && Number(loginUserId) === Number(post.author_id);

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom">
          <h3 className="fw-bold mb-1">{post.title}</h3>
          <div className="text-secondary small d-flex justify-content-between">
            <span>작성자: <strong>{post.author}</strong></span>
            <span>작성일: {post.created_at}</span>
          </div>
        </div>
        
        <div className="card-body py-5" style={{ minHeight: "300px", whiteSpace: "pre-wrap" }}>
          {post.content}
        </div>

        <div className="card-footer bg-light d-flex justify-content-between py-3">
          <button className="btn btn-outline-secondary" onClick={() => router.push("/board")}>
            목록으로
          </button>
          
          {isAuthor && (
            <div className="gap-2 d-flex">
              <button 
                className="btn btn-warning text-white" 
                onClick={() => router.push(`/board/edit/${post.id}`)}
              >
                수정
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}