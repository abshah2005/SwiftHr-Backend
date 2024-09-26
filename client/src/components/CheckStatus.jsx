import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CryptoJS from "crypto-js"
const CheckStatus = () => {
    const [Tid, setTid] = useState('');
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setTid(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        // navigate(`/application-status/${Tid}`);
        // Encrypt the Tid before navigating
    const secretKey = "your_secret_key"; // Use a secure key
    const encryptedTid = CryptoJS.AES.encrypt(Tid, secretKey).toString();
    navigate(`/application-status/${encodeURIComponent(encryptedTid)}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-teal-500">
        
        <div className="w-full fixed top-0 left-0 right-0 shadow z-10  py-2 px-4  bg-white">
          <div className='container mx-auto flex justify-between items-center'>
        
          <div className=" text-black font-Poppins text-4xl font-bold tracking-custom  leading-[14px]"> Swift<span className="text-custom-teal">HR</span></div>
          <div className="flex gap-4 tracking-normal ">
    
          <button className="bg-custom-teal  text-white  hover:bg-teal-600 px-4 py-2 leading-normal mt-2 
             font-medium rounded-lg font-archivo">Visit our Site</button>
          </div>
        </div>
        </div>
        
        <main className="flex flex-grow items-center justify-center p-4 z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mt-20 ml-6 text-center">
            <h2 className="text-2xl font-archivo tracking-wider font-semibold text-custom-teal mb-4">Check Application Status</h2>
            <p className="mb-4 font-archivo font-semibold">Enter your Unique Application No</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="123567"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                onChange={handleChange}
                value={Tid}
                required
              />
              <button
                type="submit"
                className="bg-teal-500 text-white w-full font-archivo font-semibold py-2 rounded-md hover:bg-teal-600 transition"
              >
                View Status
              </button>
            </form>
          </div>
        </main>
      
        
        <footer className="text-white p-2 bg-teal-500">
          <p className="text-center">&copy; 2024 - SwiftHR</p>
        </footer>
        <div className="">
        <img className="  absolute left-8 ml-12 top-0 w-1/3 md:w-1/4 lg:w-2/6 " src="/images/Ellipse9.png" alt="" />
        <img className="hidden md:block  sm:block  " src="/images/Ellipse8.png" alt="" />
      </div>
      </div>
      
    );
};

export default CheckStatus;