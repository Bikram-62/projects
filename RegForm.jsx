import { useState, useEffect } from "react";
import axios from "axios";

function RegForm() {
  const [employeeList, setEmployeeList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    country: "",
    state: "",
    qualification: "",
    religion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//post data by frontend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.address ||
      !form.state ||
      !form.country ||
      !form.qualification ||
      !form.religion
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      let response;
      if (editingId) {
        // Update existing employee
        response = await axios.patch(
          `http://localhost:8000/RegForm/${editingId}`,
          form
        );
      } else {
        // Add new employee
        response = await axios.post("http://localhost:8000/RegForm", form);
      }

      if (response) {
        window.alert(
          //using ternary operator
          editingId
            ? "Data updated successfully"
            : "Data submitted successfully"
        );
        getData(); // Fetch the updated list
      }
    } catch (error) {
      window.alert("Error occurre");
    }
  };
//add emplyee krne ke bd ye sre field ko initial state me laa dega
  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      country: "",
      state: "",
      qualification: "",
      religion: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const getById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/RegForm/${id}`);
      if (response.data) {
        setForm(response.data);
        setIsEditing(true);
        setEditingId(id);
      } else {
        alert("Failed to fetch employee data");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/RegForm");
      if (response.data) {
        setEmployeeList(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/RegForm/${id}`);
      alert("Employee deleted successfully");
     // after deleting data dispalying the data
      getData();
    } catch (error) {
      alert("Failed to delete employee");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-4">
          <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={form.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                className="form-control"
                value={form.country}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <select
                name="qualification"
                className="form-control"
                value={form.qualification}
                onChange={handleChange}
              >
                <option value="">Select Qualification</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>
            <div className="form-group">
              <label>Religion</label>
              <select
                name="religion"
                className="form-control"
                value={form.religion}
                onChange={handleChange}
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Sikh">Sikh</option>
                <option value="Christian">Christian</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              onClick={handleSubmit}
            >
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary mt-3 ml-2"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
        <div className="col-8">
          <h2>Employee List</h2>
          <table className="table mt-5 table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Country</th>
                <th>State</th>
                <th>Qualification</th>
                <th>Religion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.address}</td>
                  <td>{employee.country}</td>
                  <td>{employee.state}</td>
                  <td>{employee.qualification}</td>
                  <td>{employee.religion}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => getById(employee._id)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-blue ml-2">view</button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={() => deleteData(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default RegForm;
