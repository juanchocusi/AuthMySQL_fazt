import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  const token = req.cookies.token
   if (!token) {
    return res.status(401).json({ message: "NO estas autorizado" });
  }

  jwt.verify(token, "abc123", (err, decoded) => {
    if (err) return res.status(401).json({ message: "NO autorizado" });

    req.userId = decoded.id;
    /* console.log(decoded); */
    next();
  });
  
};
