import { Department } from "../models/Departments.model.js";
import { Employee } from "../models/Employee.model.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Roles } from "../models/roles.model.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";

//******************************************************************************************* */


const addEmployeeAndUser = async (req, res) => {
  try {
    const { firstname, lastname, roleId, DepartmentId, employeeData } =
      req.body;
    const files=req.files;
    if(!files){
      return res.status(400).json({ message: 'No files were uploaded.' });
    }
    const appointmentLetter=files.AppointmentLetter?files.AppointmentLetter[0]:null;
    const salarySlip=files.SalarySlip?files.SalarySlip[0]:null;
    const relievingLetter=files.RelievingLetter?files.RelievingLetter[0]:null;
    const experienceLetter=files.ExperienceLetter?files.ExperienceLetter[0]:null;

    const appointmentLetterUrl = appointmentLetter ? await uploadonCloudinary(appointmentLetter.path) : "not uploaded yet";
    const salarySlipUrl = salarySlip ? await uploadonCloudinary(salarySlip.path) : "not uploaded yet";
    const relievingLetterUrl = relievingLetter ? await uploadonCloudinary(relievingLetter.path) : "not uploaded yet";
    const experienceLetterUrl = experienceLetter ? await uploadonCloudinary(experienceLetter.path) : "not uploaded yet";

    const role = await Roles.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const department = await Department.findById(DepartmentId);
    if (!department) {
      return res.status(400).json({ message: "Invalid department specified." });
    }

    const newEmployee = await Employee.create({
      firstname,
      lastname,
      role: role._id,
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
      AppointmentLetter: appointmentLetterUrl?.url || "not uploaded yet",
      SalarySlip: salarySlipUrl?.url || "not uploaded yet",
      RelievingLetter: relievingLetterUrl?.url || "not uploaded yet",
      ExperienceLetter: experienceLetterUrl?.url || "not uploaded yet",
      professionalUsername: employeeData.professionalUsername,
      Username: employeeData.Username,
      Password: await bcrypt.hash(employeeData.Password, 10),
      Email: employeeData.Email,
    });

    if (!newEmployee) {
      res
        .status(400)
        .json({ message: "Something went wrong while creating Employee" });
    }
    const newUser = await User.create({
      fullname: `${firstname} ${lastname}`,
      email: newEmployee.Email,
      password: newEmployee.Password,
      EmployeeId: newEmployee._id,
    });

    res.status(201).json({
      message: "Employee and User created successfully",
      employee: newEmployee,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating employee and user:", error);
    res
      .status(500)
      .json({ message: "Error creating employee and user", error });
  }
};

// const addEmployeeAndUser = async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       roleId,
//       DepartmentId,
//       EmployeeId,
//       MobileNumber,
//       PersonalEmail,
//       DateofBirth,
//       MaritalStatus,
//       Nationality,
//       Gender,
//       Address,
//       City,
//       State,
//       ZipCode,
//       EmployeeType,
//       ProfessionalEmail,
//       Designation,
//       joiningDate,
//       professionalUsername,
//       Username,
//       Password,
//       Email,
//     } = req.body;

//     const files = req.files;
//     if (!files) {
//       return res.status(400).json({ message: "No files were uploaded." });
//     }

//     const appointmentLetter = files.AppointmentLetter
//       ? files.AppointmentLetter[0]
//       : null;
//     const salarySlip = files.SalarySlip ? files.SalarySlip[0] : null;
//     const relievingLetter = files.RelievingLetter
//       ? files.RelievingLetter[0]
//       : null;
//     const experienceLetter = files.ExperienceLetter
//       ? files.ExperienceLetter[0]
//       : null;

//     const appointmentLetterUrl = appointmentLetter
//       ? await uploadonCloudinary(appointmentLetter.path)
//       : null;
//     const salarySlipUrl = salarySlip
//       ? await uploadonCloudinary(salarySlip.path)
//       : null;
//     const relievingLetterUrl = relievingLetter
//       ? await uploadonCloudinary(relievingLetter.path)
//       : null;
//     const experienceLetterUrl = experienceLetter
//       ? await uploadonCloudinary(experienceLetter.path)
//       : null;

//     // Validate role and department
//     const role = await Roles.findById(roleId);
//     if (!role) {
//       return res.status(400).json({ message: "Invalid role specified." });
//     }

//     const department = await Department.findById(DepartmentId);
//     if (!department) {
//       return res.status(400).json({ message: "Invalid department specified." });
//     }

//     // Create the Employee
//     const newEmployee = await Employee.create({
//       firstname,
//       lastname,
//       role: role._id,
//       EmployeeId,
//       Department: department._id,
//       MobileNumber,
//       PersonalEmail,
//       DateofBirth,
//       MaritalStatus,
//       Nationality,
//       Gender,
//       Address,
//       City,
//       State,
//       ZipCode,
//       EmployeeType,
//       ProfessionalEmail,
//       Designation,
//       joiningDate,
//       AppointmentLetter: appointmentLetterUrl || "not uploaded yet",
//       SalarySlip: salarySlipUrl || "not uploaded yet",
//       RelievingLetter: relievingLetterUrl || "not uploaded yet",
//       ExperienceLetter: experienceLetterUrl || "not uploaded yet",
//       professionalUsername,
//       Username,
//       Password: await bcrypt.hash(Password, 10),
//       Email,
//     });

//     if (!newEmployee) {
//       return res
//         .status(400)
//         .json({ message: "Something went wrong while creating Employee" });
//     }

//     // Create the User
//     const newUser = await User.create({
//       fullname: `${firstname} ${lastname}`,
//       email: newEmployee.Email,
//       password: newEmployee.Password,
//       EmployeeId: newEmployee._id,
//     });

//     res.status(201).json({
//       message: "Employee and User created successfully",
//       employee: newEmployee,
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Error creating employee and user:", error);
//     res
//       .status(500)
//       .json({ message: "Error creating employee and user", error });
//   }
// };

//******************************************************************************************* */


const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("Department")
      .populate("role");

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found." });
    }

    res
      .status(200)
      .json({ message: "Employees retrieved successfully.", employees });
  } catch (error) {
    console.error("Error retrieving employees:", error);
    res.status(500).json({ message: "Error retrieving employees", error });
  }
};

const removeEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const user = await User.findOne({ EmployeeId: employeeId });
    if (user) {
      await User.findByIdAndDelete(user._id);
    }

    await Employee.findByIdAndDelete(employeeId);

    res
      .status(200)
      .json({ message: "Employee and associated user deleted successfully." });
  } catch (error) {
    console.error("Error removing employee:", error);
    res.status(500).json({ message: "Error removing employee", error });
  }
};


//******************************************************************************************* */

//ye pehli approach ha yar
const updateEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstname,
      lastname,
      roleId,
      DepartmentId,
      employeeData,
    } = req.body;
    const files = req.files;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update employee fields only if provided
    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;
    if (roleId) {
      const role = await Roles.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role specified." });
      }
      employee.role = role._id;
    }

    if (DepartmentId) {
      const department = await Department.findById(DepartmentId);
      if (!department) {
        return res
          .status(400)
          .json({ message: "Invalid department specified." });
      }
      employee.Department = department._id;
    }

    // Update employeeData fields if provided
    if (employeeData) {
      Object.keys(employeeData).forEach((key) => {
        if (employeeData[key]) employee[key] = employeeData[key];
      });
    }

    const appointmentLetter = files?.AppointmentLetter
      ? files.AppointmentLetter[0]
      : null;
    const salarySlip = files?.SalarySlip ? files.SalarySlip[0] : null;
    const relievingLetter = files?.RelievingLetter
      ? files.RelievingLetter[0]
      : null;
    const experienceLetter = files?.ExperienceLetter
      ? files.ExperienceLetter[0]
      : null;

    if (appointmentLetter) {
      const appointmentLetterUrl = await uploadonCloudinary(
        appointmentLetter.path
      );
      employee.AppointmentLetter =
        appointmentLetterUrl?.url || employee.AppointmentLetter;
    }
    if (salarySlip) {
      const salarySlipUrl = await uploadonCloudinary(salarySlip.path);
      employee.SalarySlip = salarySlipUrl?.url || employee.SalarySlip;
    }
    if (relievingLetter) {
      const relievingLetterUrl = await uploadonCloudinary(relievingLetter.path);
      employee.RelievingLetter =
        relievingLetterUrl?.url || employee.RelievingLetter;
    }
    if (experienceLetter) {
      const experienceLetterUrl = await uploadonCloudinary(
        experienceLetter.path
      );
      employee.ExperienceLetter =
        experienceLetterUrl?.url || employee.ExperienceLetter;
    }

    const updatedEmployee = await employee.save();

    // Update the associated user if necessary
    const user = await User.findOne({ EmployeeId: employeeId });
    if (user) {
      user.fullname = `${firstname || employee.firstname} ${
        lastname || employee.lastname
      }`;
      user.email = employee.ProfessionalEmail || user.email;
      if (employeeData && employeeData.Password) {
        user.password = await bcrypt.hash(employeeData.Password, 10);
      }
      await user.save();
    }

    res.status(200).json({
      message: "Employee and User updated successfully",
      employee: updatedEmployee,
      user,
    });
  } catch (error) {
    console.error("Error updating employee and user:", error);
    res
      .status(500)
      .json({ message: "Error updating employee and user", error });
  }
};

//or ye dosri approach ha

// const updateEmployee = async (req, res) => {
//   try {
//     const {
//       employeeId,
//       firstname,
//       lastname,
//       roleId,
//       DepartmentId,
//       EmployeeId,
//       MobileNumber,
//       PersonalEmail,
//       DateofBirth,
//       MaritalStatus,
//       Nationality,
//       Gender,
//       Address,
//       City,
//       State,
//       ZipCode,
//       EmployeeType,
//       ProfessionalEmail,
//       Designation,
//       joiningDate,
//       professionalUsername,
//       Username,
//       Password,
//     } = req.body;
//     const files = req.files;

//     // Find the employee
//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Update employee fields only if provided
//     if (firstname) employee.firstname = firstname;
//     if (lastname) employee.lastname = lastname;
//     if (roleId) {
//       const role = await Roles.findById(roleId);
//       if (!role) {
//         return res.status(400).json({ message: "Invalid role specified." });
//       }
//       employee.role = role._id;
//     }

//     if (DepartmentId) {
//       const department = await Department.findById(DepartmentId);
//       if (!department) {
//         return res.status(400).json({ message: "Invalid department specified." });
//       }
//       employee.Department = department._id;
//     }

//     // Update other fields if provided
//     employee.EmployeeId = EmployeeId || employee.EmployeeId;
//     employee.MobileNumber = MobileNumber || employee.MobileNumber;
//     employee.PersonalEmail = PersonalEmail || employee.PersonalEmail;
//     employee.DateofBirth = DateofBirth || employee.DateofBirth;
//     employee.MaritalStatus = MaritalStatus || employee.MaritalStatus;
//     employee.Nationality = Nationality || employee.Nationality;
//     employee.Gender = Gender || employee.Gender;
//     employee.Address = Address || employee.Address;
//     employee.City = City || employee.City;
//     employee.State = State || employee.State;
//     employee.ZipCode = ZipCode || employee.ZipCode;
//     employee.EmployeeType = EmployeeType || employee.EmployeeType;
//     employee.ProfessionalEmail = ProfessionalEmail || employee.ProfessionalEmail;
//     employee.Designation = Designation || employee.Designation;
//     employee.joiningDate = joiningDate || employee.joiningDate;
//     employee.professionalUsername = professionalUsername || employee.professionalUsername;
//     employee.Username = Username || employee.Username;

//     if (files) {
//       const appointmentLetter = files.AppointmentLetter ? files.AppointmentLetter[0] : null;
//       const salarySlip = files.SalarySlip ? files.SalarySlip[0] : null;
//       const relievingLetter = files.RelievingLetter ? files.RelievingLetter[0] : null;
//       const experienceLetter = files.ExperienceLetter ? files.ExperienceLetter[0] : null;

//       if (appointmentLetter) {
//         const appointmentLetterUrl = await uploadonCloudinary(appointmentLetter.path);
//         employee.AppointmentLetter = appointmentLetterUrl || employee.AppointmentLetter;
//       }
//       if (salarySlip) {
//         const salarySlipUrl = await uploadonCloudinary(salarySlip.path);
//         employee.SalarySlip = salarySlipUrl || employee.SalarySlip;
//       }
//       if (relievingLetter) {
//         const relievingLetterUrl = await uploadonCloudinary(relievingLetter.path);
//         employee.RelievingLetter = relievingLetterUrl || employee.RelievingLetter;
//       }
//       if (experienceLetter) {
//         const experienceLetterUrl = await uploadonCloudinary(experienceLetter.path);
//         employee.ExperienceLetter = experienceLetterUrl || employee.ExperienceLetter;
//       }
//     }

//     // Save the updated employee
//     const updatedEmployee = await employee.save();

//     // Update the associated user if necessary
//     const user = await User.findOne({ EmployeeId: employeeId });
//     if (user) {
//       user.fullname = `${firstname || employee.firstname} ${lastname || employee.lastname}`;
//       user.email = ProfessionalEmail || user.email;
//       if (Password) {
//         user.password = await bcrypt.hash(Password, 10);
//       }
//       await user.save();
//     }

//     res.status(200).json({
//       message: "Employee and User updated successfully",
//       employee: updatedEmployee,
//       user,
//     });
//   } catch (error) {
//     console.error("Error updating employee and user:", error);
//     res.status(500).json({ message: "Error updating employee and user", error });
//   }
// };

//******************************************************************************************* */


const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const employee = await Employee.findById(employeeId).populate([
      "Department",
      "role",
    ]);


    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res
      .status(200)
      .json({ message: "Employee retrieved successfully.", employee });
  } catch (error) {
    console.error("Error retrieving employee:", error);
    res.status(500).json({ message: "Error retrieving employee", error });
  }
};

export {
  addEmployeeAndUser,
  removeEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
};

//Test data
// {
//   "firstname": "Zahid",
//   "lastname": "Shah",
//   "roleId": "66e5dac7e14ed571ed8e82d9",
//   "DepartmentId": "66e5dc16e14ed571ed8e82e6",
//   "employeeData": {
//     "EmployeeId": "EMP56789",
//     "MobileNumber": "03350904415",
//     "PersonalEmail": "abdullah03350904415@gmail.com",
//     "DateofBirth": "1985-05-15T00:00:00.000Z",
//     "MaritalStatus": "Single",
//     "Nationality": "Pakistani",
//     "Gender": "Female",
//     "Address": "Walton Road lahore",
//     "City": "Lahore",
//     "State": "Pakistan",
//     "ZipCode": "K1A 0B1",
//     "EmployeeType": "Onsite",
//     "ProfessionalEmail": "2023f-mulbscs-026@mul.edu.pk",
//     "Designation": "Senior Developer",
//     "joiningDate": "2024-01-10T00:00:00.000Z",
//     "AppointmentLetter": "path/to/appointment_letter.pdf",
//     "SalarySlip": "path/to/salary_slip.pdf",
//     "RelievingLetter": "path/to/releasing_letter.pdf",
//     "ExperienceLetter": "path/to/experience_letter.pdf",
//     "professionalUsername": "Zahid_shah123",
//     "Username": "ZahidShah",
//     "Password": "Spring2024",
//     "Email": "2023f-mulbscs-026@mul.edu.pk"
//   }
// }
