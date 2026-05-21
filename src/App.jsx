import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    jobTitle: "",
    salary: "",
  });

  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    averageSalary: 0,
  });

  const fetchEmployees = async () => {
    const response = await axios.get(
      "http://localhost:5000/employees"
    );

    setEmployees(response.data);
  };

  const fetchSummary = async () => {
    const response = await axios.get(
      "http://localhost:5000/summary"
    );

    setSummary(response.data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchSummary();
  }, []);

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const addEmployee = async event => {
    event.preventDefault();

    await axios.post(
      "http://localhost:5000/employees",
      formData
    );

    setFormData({
      fullName: "",
      country: "",
      jobTitle: "",
      salary: "",
    });

    fetchEmployees();
    fetchSummary();
  };

  const deleteEmployee = async id => {
    await axios.delete(
      `http://localhost:5000/employees/${id}`
    );
    fetchEmployees();
    fetchSummary();
  };

  return (
    <div className="container">
      <h1>Salary Management System</h1>

      <div className="summary">
        <div className="card">
          Employees: {summary.totalEmployees}
        </div>

        <div className="card">
          Total Salary: ₹{summary.totalSalary}
        </div>

        <div className="card">
          Avg Salary: ₹
          {Math.round(summary.averageSalary)}
        </div>
      </div>

      <form onSubmit={addEmployee}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />

        <input
          name="jobTitle"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={handleChange}
        />

        <input
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <button>Add Employee</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.fullName}</td>
              <td>{employee.country}</td>
              <td>{employee.jobTitle}</td>
              <td>₹{employee.salary}</td>

              <td>
                <button
                  onClick={() =>
                    deleteEmployee(employee.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;