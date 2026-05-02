import jwt from "jsonwebtoken";

export const generateInviteToken = (role, orgId, specialization) => {
  const payload = {
    role,
    organizationId,
  };

  if (role === "responder" && specialization) {
    payload.specialization = specialization;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};
