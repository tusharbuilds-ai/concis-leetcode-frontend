import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { api } from "../services/api";

export default function Otp() {

    const navigate = useNavigate();

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function verifyOtp() {

        try {

            setLoading(true);

            const email =
                localStorage.getItem(
                    "email"
                );

            const response =
                await api.post(
                    "/api/auth/otp-auth",
                    {
                        email,
                        otp
                    }
                );

            console.log(
                "OTP Response:",
                response.data
            );
            
            const sessionId =
                response.data.result
                  .session_detail
                  .response
                  .session_id;

              console.log(sessionId);

            if (!sessionId) {

                throw new Error(
                    "Session ID not found"
                );
            }

            localStorage.setItem(
                "session_id",
                sessionId
            );

            console.log(
                "Session Stored:",
                sessionId
            );

            navigate(
                "/dashboard"
            );

        } catch (error) {

            console.error(
                "OTP Verification Failed:",
                error
            );

            alert(
                "OTP Verification Failed"
            );

        } finally {

            setLoading(false);
        }
    }

    return (

        <div className="
            min-h-screen
            bg-[#0A0A0A]
            flex
            items-center
            justify-center
            px-6
        ">

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20
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

                <div className="
                    flex
                    justify-center
                ">

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

                        <ShieldCheck
                            size={28}
                        />

                    </div>

                </div>

                <h1
                    className="
                        text-center
                        text-3xl
                        font-bold
                        mt-6
                        text-white
                    "
                >
                    Verify OTP
                </h1>

                <p
                    className="
                        text-center
                        text-zinc-400
                        mt-3
                    "
                >
                    Enter the OTP sent to
                    your email.
                </p>

                <input

                    type="text"

                    maxLength={6}

                    value={otp}

                    onChange={(e)=>
                        setOtp(
                            e.target.value
                                .toUpperCase()
                        )
                    }

                    placeholder="A1B2C3"

                    className="
                        mt-8
                        w-full
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-zinc-900
                        py-4
                        text-center
                        text-2xl
                        font-bold
                        tracking-[0.5em]
                        uppercase
                        text-white
                        outline-none
                        focus:border-indigo-500
                    "
                />

                <button

                    onClick={
                        verifyOtp
                    }

                    disabled={
                        otp.length !== 6 ||
                        loading
                    }

                    className="
                        mt-6
                        w-full
                        rounded-2xl
                        bg-indigo-600
                        py-4
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-indigo-500
                        disabled:opacity-50
                    "
                >

                    {
                        loading
                            ? "Verifying..."
                            : "Verify OTP"
                    }

                </button>

                <button

                    className="
                        mt-4
                        w-full
                        text-sm
                        text-zinc-400
                        hover:text-white
                    "
                >
                    Resend OTP
                </button>

            </motion.div>

        </div>
    );
}