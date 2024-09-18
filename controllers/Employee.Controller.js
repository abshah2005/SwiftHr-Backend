import { Department } from "../models/Departments.model";
import { Employee } from "../models/Employee.model";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { Role } from "../models/roles.model";

export const addEmployee = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      roleId,
      DepartmentId,
      employeeData,
    } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname: firstname + lastname,
      email,
      password: hashedPassword,
      role: role._id,
    });
    const department = await Department.findById(DepartmentId);
    if (!department) {
      return res.status(400).json({ message: "Invalid department specified." });
    }
    const newEmployee = await Employee.create({
      firstname: firstname,
      lastname: lastname,
      EmployeeId: employeeData.EmployeeId,
      Department: department._id,
      MobileNumber: employeeData.MobileNumber,
      PersonalEmail: employeeData.PersonalEmail,
      DateofBirth: employeeData.DateofBirth,
      MaritalStatus: employeeData.MaritalStatus,
      Nationality: employeeData.Nationality,
      Gender: employeeData.Gender,
      Address: employeeData.Address,
      City: employeeData.City,
      State: employeeData.State,
      ZipCode: employeeData.ZipCode,
      EmployeeType: employeeData.EmployeeType,
      ProfessionalEmail: employeeData.ProfessionalEmail,
      Designation: employeeData.Designation,
      joiningDate: employeeData.joiningDate,
      AppointmentLetter: employeeData.AppointmentLetter || null,
      SalarySlip: employeeData.SalarySlip || null,
      RelievingLetter: employeeData.RelievingLetter || null,
      ExperienceLetter: employeeData.ExperienceLetter || null,
      professionalUsername: employeeData.professionalUsername,
      Username: employeeData.Username,
      Password: hashedPassword,
      Email: employeeData.Email,
    });

    res
      .status(201)
      .json({
        message: "Employee created successfully",
        employee: newEmployee,
      });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Error creating employee", error });
  }
};

//Test data
// {
//     "email": "johndoe@example.com",
//     "password": "password123",
//      "roleId":"bcs",
//      "firstname":"Abdullah",
// "departmentId":"feibw"
//      "lastname":"Shah"
//     "employeeData": {
//       "EmployeeId": "E12345",
//       "MobileNumber": "123-456-7890",
//       
//       "PersonalEmail": "johndoe.personal@example.com",
//       "DateofBirth": "1990-01-01",
//       "MaritalStatus": "Single",
//       "Nationality": "American",
//       "Gender": "Male",
//       "Address": "123 Main St",
//       "City": "New York",
//       "State": "NY",
//       "ZipCode": "10001",
//       "EmployeeType": "Full-Time",
//       "ProfessionalEmail": "johndoe.professional@example.com",
//       "Designation": "HR Manager",
//       "joiningDate": "2023-09-01",
//       "AppointmentLetter": "url-to-appointment-letter",
//       "SalarySlip": "url-to-salary-slip",
//       "RelievingLetter": "url-to-relieving-letter",
//       "ExperienceLetter": "url-to-experience-letter",
//       "professionalUsername": "johndoe123",
//       "Username": "johndoe",
//       "Password": "password123",
//       "Email": "johndoe.professional@example.com"
//     }
//   }
