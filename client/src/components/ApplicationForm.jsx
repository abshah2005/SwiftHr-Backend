import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CustomModal from "./CustomModal";

const ApplicationForm = () => {
  const [open, setOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleStatusClick = () => {
    console.log("View Status clicked");
    setOpen(false);
  };

  const handleVisitClick = () => {
    console.log("Visit our Site clicked");
    setOpen(false);
  };
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    phonenumber: "",
    whatsappnumber: "",
    positionId: "",
    Country: "",
    CV: null,
    CoverLetter: "",
  });

  const [positions, setPositions] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/positions/getAllPositions"
        );
        const positionsData =
          response.data.positions || response.data.data || response.data;
        if (Array.isArray(positionsData)) {
          setPositions(positionsData);
        } else {
          console.error("Positions data is not an array:", positionsData);
        }
      } catch (err) {
        console.error("Failed to fetch positions:", err);
      }
    };

    fetchPositions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData({ ...formData, CV: file }); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "CV" && formData.CV) {
        form.append(key, formData.CV, formData.CV.name); // Append file explicitly
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/applications/apply",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Application submitted successfully!");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          gender: "",
          phonenumber: "",
          whatsappnumber: "",
          positionId: "",
          Country: "",
          CV: null,
          CoverLetter: "",
        });
        setFormSubmitted(true);
        handleOpenModal();
      } else {
        setError("Failed to submit the application. Please try again.");
      }
    } catch (err) {
      setError("Error submitting the application. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen  flex-row bg-custom-teal">
      <div>
        <CustomModal
          open={open}
          onClose={handleCloseModal}
          onStatusClick={handleStatusClick}
          onVisitClick={handleVisitClick}
        />
      </div>
      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 right-0 shadow z-10  py-2 px-4  bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className=" text-black font-Poppins text-4xl font-bold tracking-custom  leading-[14px]">
            Swift<span className="text-custom-teal">HR</span>
          </div>
          <div className="flex gap-4 tracking-normal ">
            <Link to="/check">
            <button
              className="bg-white text-black rounded-lg px-4 hover:bg-custom-teal leading-normal font-medium 
               py-2 mt-2 border border-black font-archivo "
            >
              View Status
            </button>
           </Link>
            <button
              className="bg-custom-teal  text-white  hover:bg-teal-600 px-4 py-2 leading-normal mt-2 
             font-medium rounded-lg font-archivo"
            >
              Visit our Site
            </button>
          </div>
        </div>
      </div>

      <h1
        className="font-archivo hidden sm:block text-[40px]  top-[473px] left-[104px] absolute font-bold tracking-normal
             text-white"
      >
        APPLICATION FORM
      </h1>
      {/* Form Card */}
      <div className="flex flex-1 justify-end p-4 mr-8 mt-16">
        <div className="bg-white rounded-lg shadow-lg p-7  md:w-3/4 lg:w-3/6   ">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 tracking-normal   font-archivo "
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-semibold font-archivo"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full"
                  placeholder="John"
                  title="First name should contain only alphabetic characters."
                  required
                  pattern="[A-Za-z]+"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-semibold font-archivo"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  title="Last name should contain only alphabetic characters."
                  required
                  pattern="[A-Za-z]+"
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full"
                  placeholder="Gradian"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm  font-semibold font-archivo"
                >
                  E-mail Address
                </label>
                <input
                  type="email"
                  title="Please enter a valid email address."
                  required
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full"
                  placeholder="example@gmail.com"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-semibold font-archivo"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full text-gray-400"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="phonenumber"
                  className="block text-sm font-semibold font-archivo"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phonenumber"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full"
                  placeholder="+923008423442"
                  pattern="^\+92\d{10}$"
                  title="Phone number must start with +92 and contain exactly 12 digits."
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="whatsappnumber"
                  className="block text-sm font-semibold font-archivo"
                >
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  pattern="^\+92\d{10}$"
                  title="WhatsApp number must start with +92 and contain exactly 12 digits."
                  required
                  id="whatsappnumber"
                  name="whatsappnumber"
                  value={formData.whatsappnumber}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full"
                  placeholder="+923000000000"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-semibold font-archivo"
                  htmlFor="position"
                >
                  Desired Position
                  <select
                    className="mt-1 p-2  border font-normal font-archivo rounded-lg w-full text-gray-500"
                    id="position"
                    name="positionId"
                    onChange={handleInputChange}
                    value={formData.positionId}
                    required
                  >
                    <option value="" disabled>
                      Select a position
                    </option>
                    {positions.length > 0 ? (
                      positions.map((position, index) => (
                        <option key={index} value={position._id}>
                          {position.title}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No positions available
                      </option>
                    )}
                  </select>
                </label>
              </div>

              <div>
                <label
                  htmlFor="Country"
                  className="block text-sm font-semibold font-archivo"
                >
                  Country
                </label>
                <input
                  type="text"
                  name="Country"
                  id="Country"
                  value={formData.Country}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border rounded-lg w-full"
                  placeholder="Pakistan"
                  required
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label
                htmlFor="CV"
                className="block text-sm font-semibold font-archivo"
              >
                Upload your Resume
              </label>
              <div className="mt-1 p-6 border-dashed border-2 border-gray-300 rounded-lg w-full relative">
                <input
                  type="file"
                  name="CV"
                  id="CV"
                  required
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <img className=" mb-2 mx-auto" src="/images/cloud.png" alt="" />
                <p className="text-xs text-black text-center font-medium">
                  Drop your resume here or click to upload
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Acceptable File type:PDF(5MB max)
                </p>
                {formData.CV && (
                  <p className="text-xs text-custom-teal text-center mt-2">
                    Selected file: {formData.CV.name}
                  </p>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="CoverLetter"
                className="block text-sm font-semibold font-archivo"
              >
                Write a Cover Letter
              </label>
              <textarea
                id="CoverLetter"
                name="CoverLetter"
                value={formData.CoverLetter}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded-lg w-full"
                rows="4"
                placeholder="Write about yourself"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                className="w-full bg-custom-teal text-white py-2 px-4  rounded-md mt-4 hover:bg-teal-600"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Apply Now"}
              </button>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
            </div>
          </form>
        </div>
      </div>
      <p className=" text-center font-archivo text-white">
        &copy; 2024 - SwiftHR
      </p>
      <div className="">
        <img
          className="  absolute left-8 ml-12 top-0 w-1/3 md:w-1/4 lg:w-2/6 "
          src="/images/Ellipse9.png"
          alt=""
        />
        <img
          className="hidden md:block  sm:block  "
          src="/images/Ellipse8.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default ApplicationForm;
