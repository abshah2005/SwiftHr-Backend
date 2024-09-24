import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "mail.devlogix.com.pk",
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "test@devlogix.com.pk",
    pass: process.env.EMAIL_PASS || "$AX6w^HW)7Q{",
  },
});

const signin = async (req, res) => {
  const userData = req.body;
  console.log(userData);

  try {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const generateNumericOtp = (length) => {
      let otp = "";
      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      return otp;
    };

    const otp = generateNumericOtp(4);
    console.log(otp);

    user.otp = otp;
    user.otpExpiry = Date.now() + 2 * 60 * 1000; // OTP valid for 2 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER || "test@devlogix.com.pk",
      to: user.email,
      subject: "Your OTP for Sign-In",
      text: `Your OTP code is ${otp}. It is valid for 2 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });
    const generateNumericOtp = (length) => {
      let otp = "";
      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      return otp;
    };

    const otp = generateNumericOtp(4);
    console.log(otp);

    user.otp = otp;
    user.otpExpiry = Date.now() + 2 * 60 * 1000; // OTP valid for 2 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER || "test@devlogix.com.pk",
      to: user.email,
      subject: "Your OTP for Sign-In",
      text: `Your OTP code is ${otp}. It is valid for 2 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Email sent again: " + info.response);
    });

    res.status(200).json({ message: "OTP sent to Your Email Again." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifySignInOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(401).json({ message: "Invalid OTP" });

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Sign In successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || "test@devlogix.com.pk",
      to: user.email,
      subject: "Password Reset Request",
      text: `Click on the link to reset your password: ${resetLink}. This link is valid for 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: "Check Your Email for Password Reset Link" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPass } = req.body;
  console.log(resetToken);

  try {
    // Find user by reset token and check token expiry
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(newPass, salt);
    console.log(newPassword);
    user.password = newPassword;
    // Clear reset token and expiry
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // Save user
    await user.save();
    console.log("User saved successfully");

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers=async(req,res)=>{
  try {
    const Users = await User.find().populate("EmployeeId")
    if(!Users){
      return res.status(404).json({ message: "No Users found." });
    }
    return res.status(200).json({message:"Users fetched successfully",data:Users})
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Users", error });
  }
}
export { signin, verifySignInOtp, forgotPassword, resetPassword, resendOtp,getAllUsers };
