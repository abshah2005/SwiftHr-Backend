import React, { useState } from "react";
import Svgmain from "../Illustrations/Svgmain.svg";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Ring } from "@uiball/loaders";
import CryptoJS from "crypto-js"

const ApplicationId = () => {
  const { Tid } = useParams();

  // const fetchApplicationByTid = async () => {
  //   const response = await axios.get(
  //     `http://localhost:8000/api/applications/getApplicationbyTid/${Tid}`,
  //   );
  //   return response.data.application;
  // };

  const secretKey = "your_secret_key"; // Use the same key
  const decryptedTid = CryptoJS.AES.decrypt(decodeURIComponent(Tid), secretKey).toString(CryptoJS.enc.Utf8);

  const fetchApplicationByTid = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/applications/getApplicationbyTid/${decryptedTid}`
    );
    return response.data.application;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["applicationByTid", Tid],
    queryFn: fetchApplicationByTid,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-teal-500">
        <Ring size={40} color="#ffffff" />
      </div>
    );
  }

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-teal-500">
        <div className="text-white text-xl">Error fetching data: {error.message}</div>
      </div>
    );

  const {
    ApplicantId: { firstname, lastname },
    status,
    userAction,
  } = data;

  const renderActionRequired = () => {
    switch (status) {
      case "Interviewed":
        return (
          <>
            {userAction?.interviewDate && (
              <p>
                Interview Date:{" "}
                {new Date(userAction.interviewDate).toLocaleString()}
              </p>
            )}
            {userAction?.googleMeetLink && (
              <a
                href={userAction.googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                Join your interview via Google Meet
              </a>
            )}
          </>
        );
      case "Assessment Required":
        return userAction?.assessmentLink ? (
          <a
            href={userAction.assessmentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white"
          >
            Complete your assessment here
          </a>
        ) : (
          <p>Assessment details will be provided soon.</p>
        );

      case "Offered":
        return userAction?.offerLetterLink ? (
          <a
            href={userAction.offerLetterLink}
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            Offer letter link here
            {userAction.offerLetterLink.slice(0, 45)}...
          </a>
        ) : (
          <p>Your offer letter will be provided soon.</p>
        );

      case "Rejected":
        return (
          <p>
            We regret to inform you that your application was not successful.
          </p>
        );

      case "Applied":
        return (
          <p>Your application has been received. We will contact you soon.</p>
        );

      default:
        return <p>No specific action required at this time.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-teal-500 relative">
      <header className="w-full flex justify-between items-center p-4 bg-white shadow-md z-50">
        <h1 className="text-2xl font-bold text-black">
          Swift<span className="text-teal-500">HR</span>
        </h1>
        <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">
          Visit our Site
        </button>
      </header>
      <div className='w-[60%] h-[60%] absolute top-[-40%] left-[10%] z-0 rounded-full  border-white border-[30px] md:w-[30%] md:h-[60%] md:left-[18%] md:top-[-30%]' />

      <main className="flex-grow flex flex-col items-center justify-center p-4 ">
        <div className="text-center mb-8 z-50">
          <h2 className="text-3xl text-white font-bold mb-8 z-50 ">
            Welcome {firstname} {lastname}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-teal-500 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Application Status</h3>
            <button className="bg-white px-4 py-2 rounded-md text-teal-500 font-bold">
              {status === "Interviewed" ? <p>Called for interview</p> : status}
            </button>
          </div>

          <div className="bg-teal-500 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Action Required</h3>
            <div className="bg-white px-4 py-2 rounded-md text-teal-500 font-bold">
              {renderActionRequired()}
            </div>
          </div>
        </div>
        <div className="illustration">
          <img src={Svgmain} alt="My Icon" />
        </div>

        <div className="w-[45%] h-[20%] absolute -left-[30%] -bottom-[0%] z-0 rounded-full  border-white border-[30px] rotate-5 md:w-[35%] md:h-[25%] md:-left-[25%] rotate-5" />
      </main>

      <footer className="text-white p-4 bg-teal-500">
        <p className="text-center">&copy; 2024 - SwiftHR</p>
      </footer>
    </div>
  );
};

export default ApplicationId;
