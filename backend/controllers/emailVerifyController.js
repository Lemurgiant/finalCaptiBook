const sendVerificationEmail = (user, req) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
  user.save();

  const url = `http://${req.headers.host}/verify-email?token=${token}`;

  transporter.sendMail({
    to: user.email,
    subject: "Verify your email",
    html: `<a href="${url}">Click here to verify your email</a>`,
  });
};
