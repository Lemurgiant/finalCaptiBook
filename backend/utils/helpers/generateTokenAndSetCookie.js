import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  res.cookie("jwt", token, {
    httpOnly: true, //more secure
    maxAge: 60 * 60 * 1000,
    sameSite: true, //CSRF
  });

  return token;
};

export default generateTokenAndSetCookie;
