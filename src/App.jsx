import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./index.css";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const INITIAL_FORM = {
  fullName: "",
  country: "",
  jobTitle: "",
  salary: "",
};
const MAX_DISPLAY = 100;

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    averageSalary: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [employeesResponse, summaryResponse] = await Promise.all([
        axios.get(`${API_BASE}/employees`),
        axios.get(`${API_BASE}/summary`),
      ]);

      setEmployees(Array.isArray(employeesResponse.data) ? employeesResponse.data : []);
      setSummary(
        summaryResponse.data || {
          totalEmployees: 0,
          totalSalary: 0,
          averageSalary: 0,
        }
      );
    } catch (err) {
      console.error("Failed to load employee data:", err);
      setError("Unable to load employee data. Please make sure the backend is running.");
      setEmployees([]);
      setSummary({ totalEmployees: 0, totalSalary: 0, averageSalary: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || !formData.country.trim() || !formData.jobTitle.trim()) {
      return "Full name, country, and job title are required.";
    }

    const salary = Number(formData.salary);
    if (!Number.isFinite(salary) || salary <= 0) {
      return "Salary must be a positive number.";
    }

    return "";
  };

  const addEmployee = async event => {
    event.preventDefault();
    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await axios.post(`${API_BASE}/employees`, {
        ...formData,
        salary: Number(formData.salary),
      });
      setFormData(INITIAL_FORM);
      await fetchData();
    } catch (err) {
      console.error("Failed to add employee:", err);
      setError("Unable to add employee. Please check backend connectivity.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEmployee = async id => {
    const confirmed = window.confirm("Delete this employee?");
    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await axios.delete(`${API_BASE}/employees/${id}`);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete employee:", err);
      setError("Unable to delete employee. Please check backend connectivity.");
    }
  };

  const filteredEmployees = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return employees;
    }

    return employees.filter(employee => {
      const target = `${employee.fullName} ${employee.country} ${employee.jobTitle}`.toLowerCase();
      return target.includes(search);
    });
  }, [employees, query]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = MAX_DISPLAY;
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));

  useEffect(() => {
    // reset to first page when the filtered set changes
    setCurrentPage(1);
  }, [query, employees]);

  const visibleEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showLimitMessage = filteredEmployees.length > pageSize;

  const formatAmount = amount =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="app-shell">
      <header className="app-hero">
        <div className="hero-copy">
          <p className="eyebrow">Salary Management</p>
          <h1>Employee Payroll Dashboard</h1>
          <p className="hero-text">
            Manage employee salaries, team size, and compensation trends in one place.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="summary-grid">
          <article className="summary-card">
            <span className="summary-label">Employees</span>
            <strong>{formatAmount(summary.totalEmployees)}</strong>
          </article>

          <article className="summary-card">
            <span className="summary-label">Total Salary</span>
            <strong>{formatAmount(summary.totalSalary)}</strong>
          </article>

          <article className="summary-card">
            <span className="summary-label">Avg Salary</span>
            <strong>{formatAmount(Math.round(summary.averageSalary))}</strong>
          </article>
        </section>

        {error && <div className="status-banner">{error}</div>}

        <section className="panel panel-form">
          <div className="panel-heading">
            <div>
              <h2>Add a new employee</h2>
              <p>Quickly add employees and refresh the dashboard instantly.</p>
            </div>
          </div>

          <form className="employee-form" onSubmit={addEmployee}>
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
              inputMode="numeric"
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Employee"}
            </button>
          </form>
        </section>

        <section className="panel panel-table">
          <div className="table-toolbar">
            <div>
              <h2>Employee list</h2>
              <p className="table-subtitle">
                {loading
                  ? "Loading employee records..."
                  : filteredEmployees.length === 0
                  ? "No employees found."
                  : `Showing ${visibleEmployees.length} of ${filteredEmployees.length} records.`}
              </p>
            </div>

            <input
              className="search-input"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search name, country or role"
            />
          </div>

          {loading ? (
            <div className="empty-state">Loading employee records...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">No employees match your search.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Job Title</th>
                    <th>Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td>{employee.fullName}</td>
                      <td>{employee.country}</td>
                      <td>{employee.jobTitle}</td>
                      <td>{formatAmount(employee.salary)}</td>
                      <td>
                        <button
                          className="delete-button"
                          type="button"
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination-wrap">
            <div className="pagination">
              <button
                className="page-button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                ←
              </button>

              {(() => {
                const pages = [];
                const start = Math.max(1, currentPage - 3);
                const end = Math.min(totalPages, currentPage + 3);

                for (let p = start; p <= end; p++) {
                  pages.push(
                    <button
                      key={p}
                      className={`page-button ${p === currentPage ? 'page-current' : ''}`}
                      onClick={() => setCurrentPage(p)}
                      aria-current={p === currentPage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                className="page-button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                →
              </button>
            </div>

            {showLimitMessage && (
              <p className="table-footnote">
                Showing page {currentPage} of {totalPages} — {filteredEmployees.length} results total.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
