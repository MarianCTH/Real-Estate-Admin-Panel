"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

const initialTableData = [
  {
    id: 1,
    user: {
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      name: "Mark Johnson",
      role: "Software Engineer",
    },
    projectName: "E-commerce App",
    budget: "10K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      name: "Emily Davis",
      role: "Project Manager",
    },
    projectName: "Marketing Campaign",
    budget: "5K",
    status: "Completed",
  },
  {
    id: 4,
    user: {
      name: "John Smith",
      role: "UI/UX Designer",
    },
    projectName: "Mobile App Redesign",
    budget: "8.5K",
    status: "Active",
  },
];

export default function UsersTable() {
  const [users, setUsers] = useState(initialTableData);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    projectName: "",
    status: "Active",
    budget: "",
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState({ projectName: "", budget: "" });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({ budget: "" });
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
      setSuccessMessage("User successfully deleted."); // Display message on delete
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "budget" && isNaN(value)) {
      setErrors({ ...errors, budget: "Budget must be a number" });
    } else {
      setErrors({ ...errors, budget: "" });
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.budget) return;
  
    const newId = Date.now(); // Use the current timestamp for a unique ID
  
    if (editingId !== null) {
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? {
                ...user,
                user: { name: formData.name, role: formData.role },
                projectName: formData.projectName,
                status: formData.status,
                budget: formData.budget,
              }
            : user
        )
      );
      setEditingId(null);
      setSuccessMessage("User successfully updated.");
    } else {
      const newUser = {
        id: newId, // Use the unique timestamp as the ID
        user: {
          name: formData.name,
          role: formData.role,
        },
        projectName: formData.projectName,
        status: formData.status,
        budget: formData.budget,
      };
      setUsers([...users, newUser]);
      setSuccessMessage("User successfully added.");
    }
    setFormData({ name: "", role: "", projectName: "", status: "Active", budget: "" });
  };
  

  const handleEdit = (user) => {
    setFormData({
      name: user.user.name,
      role: user.user.role,
      projectName: user.projectName,
      status: user.status,
      budget: user.budget,
    });
    setEditingId(user.id);
  };

  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) => {
      return sortOrder === "asc"
        ? a.user.name.localeCompare(b.user.name)
        : b.user.name.localeCompare(a.user.name);
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      {successMessage && <div className="p-4 bg-green-200 text-green-800 mb-4">{successMessage}</div>} {/* Display success message */}

      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white shadow rounded">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <Input type="text" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
          <Input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} required />
          <Input type="text" name="budget" placeholder="Budget" value={formData.budget} onChange={handleChange} required />
          {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
        </div>
        <Button type="submit" className="mt-4 w-full">{editingId ? "Update User" : "Add User"}</Button>
      </form>

      <Button onClick={handleSort} className="mb-4">Sort by Name ({sortOrder})</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Project Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Budget</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.user.name} ({user.user.role})</TableCell>
              <TableCell>{user.projectName}</TableCell>
              <TableCell><Badge>{user.status}</Badge></TableCell>
              <TableCell>{user.budget}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <Button onClick={() => handleDelete(user.id)} className="ml-2 bg-red-500">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
