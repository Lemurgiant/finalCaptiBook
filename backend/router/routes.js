import express from "express";
import {
  getAllProductivityData,
  recordProductivityData,
} from "../controllers/productivityDataController.js";
import {
  addOneBookCollectionData,
  deleteOneBookCollectionData,
  getAllBookCollectionData,
} from "../controllers/bookCollectionController.js";
import { isAuthed } from "../middleware.js";
import {
  deleteAllBookCollectionData,
  deleteAllProductivityData,
  getAllBookCollectionDataTest,
} from "../controllers/test.js";
import {
  addOneSummaryCollectionData,
  deleteOneSummaryCollectionData,
  updateOneSummaryCollectionData,
} from "../controllers/Insights/summaryCollectionController.js";
import {
  addOneQuoteCollectionData,
  deleteOneQuoteCollectionData,
  updateOneQuoteCollectionData,
} from "../controllers/Insights/quoteCollectionController.js";
import {
  addOneTermCollectionData,
  deleteOneTermCollectionData,
  updateOneTermCollectionData,
} from "../controllers/Insights/termCollectionController.js";
import User from "../models/userModel.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import passport from "../auth/auth.js";
import { isValidEmail, isValidPassword } from "../utils/helpers/helpers.js";
import os from "os";
import {
  updateUserDisplayName,
  updateUserImage,
  updateUserTheme,
} from "../controllers/userController.js";
const router = express.Router();

// router.get("/get-productivity-data", fetchProductivityData);
// router.post("/productivity-data", mutateNewProductivityData);
// router.post("/bookcollection-data", mutateNewBookCollectionData);
// router.get("/get-bookcollection-data", fetchBookCollectionData);
// router.delete("/delete-bookcollection-data/:id", deleteBookCollectionData);
// router.post("/record-productivity-data", recordReadingSession);

router.get("/get-all-productivity-data", isAuthed, getAllProductivityData);
router.get("/get-all-bookcollection-data", isAuthed, getAllBookCollectionData);
router.post("/record-productivity-data", isAuthed, recordProductivityData);
router.delete(
  "/delete-one-bookcollection-data/:id",
  isAuthed,
  deleteOneBookCollectionData
);
router.post("/add-one-bookcollection-data", isAuthed, addOneBookCollectionData);

router.post("/add-one-summary-data", isAuthed, addOneSummaryCollectionData);
router.post("/add-one-quote-data", isAuthed, addOneQuoteCollectionData);
router.post("/add-one-term-data", isAuthed, addOneTermCollectionData);
router.patch(
  "/update-one-term-data/:id",
  isAuthed,
  updateOneTermCollectionData
);
router.patch(
  "/update-one-summary-data/:id",
  isAuthed,
  updateOneSummaryCollectionData
);
router.patch(
  "/update-one-quote-data/:id",
  isAuthed,
  updateOneQuoteCollectionData
);

router.post("/delete-one-summary-data", isAuthed, addOneSummaryCollectionData);
router.post("/delete-one-quote-data", isAuthed, addOneQuoteCollectionData);
router.delete(
  "/delete-one-term-data/:id",
  isAuthed,
  deleteOneTermCollectionData
);
router.delete(
  "/delete-one-summary-data/:id",
  isAuthed,
  deleteOneSummaryCollectionData
);
router.delete(
  "/delete-one-quote-data/:id",
  isAuthed,
  deleteOneQuoteCollectionData
);

router.post("/test/delete-all-productivity-data", deleteAllProductivityData);
router.post(
  "/test/delete-all-bookcollection-data",
  deleteAllBookCollectionData
);

router.post("/update-user-image", isAuthed, updateUserImage);
router.post("/update-user-display-name", isAuthed, updateUserDisplayName);
router.post("/update-user-theme", isAuthed, updateUserTheme);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ message: passwordCheck.message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      displayName: firstName + " " + lastName,
      firstName,
      lastName,
      verificationToken: crypto.randomBytes(20).toString("hex"),
      verificationTokenExpires: Date.now() + 3600000, // 1 hour
      theme: 0,
    });

    // Save user
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    });

    const mailOptions = {
      from: "valoresaiyajin@example.com",
      to: user.email,
      subject: "Email Verification",
      text: `Verify your email by clicking on the following link: 
             http://localhost:5000/api/verify-email?token=${user.verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message:
        "User registered. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
