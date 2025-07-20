import { useEffect, useState } from "react";
import { Box, Typography, Button, GlobalStyles } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const randomMoveKeyframes = `
@keyframes randomMove {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50vw, 10vh);
  }
  50% {
    transform: translate(-10vw, 50vh);
  }
  75% {
    transform: translate(40vw, 10vh);
  }
  100% {
    transform: translate(0, 0);
  }
}
`;

const Verified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkUserIsVerifiedStatus} = useAuth()!;

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const params = new URLSearchParams(location.search);;
  const token = params.get("token");
  useEffect(() => {
    const verify = async () => {
  
      if (!token) {
        setStatus("error");
        setMessage("Missing token.");
        return;
      }

      try {
        const result = await checkUserIsVerifiedStatus(token); 
        console.log(" Email verified:", result);
         
             
        setStatus("success");
        setMessage("Email verified. You can now log in.");
      } catch (err: any) {
        console.error("❌ Verification failed", err);
        setStatus("error");
        setMessage(
          err?.response?.data || "Invalid or expired verification link."
        );
      }
    };

    verify();
  }, [location.search]);

  return (
    <>
      <GlobalStyles styles={randomMoveKeyframes} />

      {Array.from({ length: 70 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: "7px",
            height: "7px",
            bgcolor: "white",
            borderRadius: "20px",
            boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
            opacity: 0.5,
            zIndex: 0,
            position: "absolute",
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animation: `randomMove ${30 + Math.random() * 60}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}

      <Box
        sx={{
          height: "100dvh",
          width: "100dvw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 3,
          bgcolor: "black",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={700} zIndex={1}>
          {status === "success" && "✅ " + message}
          {status === "error" && "❌ " + message}
          {status === "idle" && "Verifying..."}
        </Typography>

        {status === "success" && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate(`/login`)}
          >
            Go to Login
          </Button>
        )}
      </Box>
    </>
  );
};

export default Verified;