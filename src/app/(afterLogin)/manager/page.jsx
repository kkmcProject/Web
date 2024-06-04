"use client";

import React, { useState } from 'react';

const TableComponent = () => {
  const initialUsers = [
    { id: 1, name: '하태성', position: '관리자', role: 'Admin', team: '1반' },
    { id: 2, name: '이도현', position: '작업반', role: 'User', team: '2반' },
    { id: 3, name: '홍성빈', position: '일용직', role: 'User', team: '3반' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoles, setEditedRoles] = useState(initialUsers.map(user => ({ id: user.id, role: user.role })));

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRoleChange = (userId, event) => {
    const newRole = event.target.value;
    setEditedRoles(editedRoles.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleSaveClick = () => {
    setUsers(users.map(user => {
      const editedUser = editedRoles.find(edited => edited.id === user.id);
      return editedUser ? { ...user, role: editedUser.role } : user;
    }));
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="container mx-auto">
        <table className="min-w-full bg-white border border-gray-400 table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/12 py-2 px-4 border border-gray-400 text-center">아이디</th>
              <th className="w-2/12 py-2 px-4 border border-gray-400 text-center">이름</th>
              <th className="w-2/12 py-2 px-4 border border-gray-400 text-center">직급</th>
              <th className="w-3/12 py-2 px-4 border border-gray-400 text-center">Role</th>
              <th className="w-2/12 py-2 px-4 border border-gray-400 text-center">작업반</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border border-gray-400 text-center">{user.id}</td>
                <td className="py-2 px-4 border border-gray-400 text-center">{user.name}</td>
                <td className="py-2 px-4 border border-gray-400 text-center">{user.position}</td>
                <td className="py-2 px-4 border border-gray-400 text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedRoles.find(edited => edited.id === user.id).role}
                      onChange={(event) => handleRoleChange(user.id, event)}
                      className="w-full px-2 py-1 border rounded text-center"
                      style={{ maxWidth: '100px', height: '2rem' }}
                    />
                  ) : (
                    <span>{user.role}</span>
                  )}
                </td>
                <td className="py-2 px-4 border border-gray-400 text-center">{user.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={handleEditClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            정보 수정
          </button>
          <button 
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
