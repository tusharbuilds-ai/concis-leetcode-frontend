import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {

  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function sendOtp() {

  try {

    const response = await api.post("/api/auth/otp-login",
        {
            "email":email
        }
    );

    console.log(response.data);

    localStorage.setItem(
      "email",
      email
    );

    navigate("/otp");

  } catch (error) {

    console.error(error);

    alert(
      "Failed to send OTP"
    );
  }
}

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">

      <motion.div

        initial={{
          opacity: 0,
          y: 30
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-950
          p-8
        "
      >

        <div className="flex justify-center">

          <div
            className="
            h-16
            w-16
            rounded-2xl
            bg-indigo-600
            flex
            items-center
            justify-center
          "
          >

            <BrainCircuit size={28} />

          </div>

        </div>

        <h1
          className="
          text-center
          text-4xl
          font-bold
          mt-6
        "
        >
          Concis AI Tutor
        </h1>

        <p
          className="
          text-center
          text-zinc-400
          mt-3
        "
        >
          Learn how to think,
          not what to type.
        </p>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          className="
            mt-8
            w-full
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            px-4
            py-3
          "
        />

        <button

          onClick={sendOtp}

          className="
            mt-5
            w-full
            rounded-xl
            bg-indigo-600
            py-3
            font-semibold
          "
        >
          Continue
        </button>

      </motion.div>

    </div>
  );
}