"use client";

import { useState, useEffect } from "react";
import { adminApi, AdminUser, Pagination } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState<Pagination | null>(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await adminApi.users.getAll({
				page,
				limit: 10,
				search,
			});
			if (response.success) {
				setUsers(response.data);
				setPagination(response.pagination);
			}
		} catch (error) {
			console.error("사용자 목록 조회 실패:", error);
			alert("사용자 목록을 불러오는데 실패했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [page]);

	const handleSearch = () => {
		setPage(1);
		fetchUsers();
	};

	const handleChangeRole = async (userId: number, newRole: string) => {
		if (!confirm(`이 사용자의 권한을 ${newRole === "admin" ? "관리자" : "일반 사용자"}로 변경하시겠습니까?`)) {
			return;
		}

		try {
			const response = await adminApi.users.updateRole(userId, newRole);
			if (response.success) {
				alert("권한이 변경되었습니다.");
				fetchUsers();
			}
		} catch (error) {
			console.error("권한 변경 실패:", error);
			alert("권한 변경에 실패했습니다.");
		}
	};

	const handleDelete = async (userId: number) => {
		if (!confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
			return;
		}

		try {
			const response = await adminApi.users.delete(userId);
			if (response.success) {
				alert("사용자가 삭제되었습니다.");
				fetchUsers();
			}
		} catch (error) {
			console.error("사용자 삭제 실패:", error);
			alert("사용자 삭제에 실패했습니다.");
		}
	};

	if (loading) {
		return <div className="text-center py-8">로딩 중...</div>;
	}

	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800 mb-6">사용자 관리</h1>

			{/* 검색 */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="flex gap-4">
					<input
						type="text"
						placeholder="이름 또는 이메일 검색..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSearch()}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<Button onClick={handleSearch} variant="primary">
						검색
					</Button>
				</div>
			</div>

			{/* 사용자 테이블 */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								이메일
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								이름
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								권한
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								가입일
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								작업
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{user.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{user.email}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{user.name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm">
									<span
										className={`px-2 py-1 rounded-full text-xs font-semibold ${
											user.role === "admin"
												? "bg-purple-100 text-purple-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{user.role === "admin" ? "관리자" : "일반"}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{new Date(user.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
									<button
										onClick={() =>
											handleChangeRole(
												user.id,
												user.role === "admin" ? "user" : "admin"
											)
										}
										className="text-blue-600 hover:text-blue-900"
									>
										{user.role === "admin" ? "일반으로" : "관리자로"}
									</button>
									<button
										onClick={() => handleDelete(user.id)}
										className="text-red-600 hover:text-red-900"
									>
										삭제
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* 페이지네이션 */}
			{pagination && (
				<div className="flex justify-center items-center mt-6 space-x-2">
					<Button
						onClick={() => setPage(page - 1)}
						disabled={page === 1}
						variant="secondary"
					>
						이전
					</Button>
					<span className="px-4 py-2">
						{page} / {pagination.totalPages}
					</span>
					<Button
						onClick={() => setPage(page + 1)}
						disabled={page >= pagination.totalPages}
						variant="secondary"
					>
						다음
					</Button>
				</div>
			)}
		</div>
	);
}
