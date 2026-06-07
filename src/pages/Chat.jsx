import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown"

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

function cleanHtml(html = "") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
        html,
        "text/html"
    );

    return doc.body.textContent || "";
}

export default function Chat() {

    const location = useLocation();

    const problemSlug =
        location.state?.problemSlug;

    const [email,setEmail] = 
    useState(null)
    const [problem, setProblem] =
        useState(null);

    const [query, setQuery] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadProblem() {

            try {

                const response =
                    await axios.get(
                        `${API_URL}select?titleSlug=${problemSlug}`
                    );

                console.log(
                    "Problem Data:",
                    response.data
                );

                setProblem(
                    response.data
                );

            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setLoading(false);
            }
        }

        loadProblem();

    }, [problemSlug]);



    useEffect(() => {

    const sessionId =
        localStorage.getItem(
            "session_id"
        );

    if (!sessionId) {

        console.error(
            "No session id found"
        );

        return;
    }

    const ws =
        new WebSocket(
            `${WS_URL}${sessionId}`
        );

    ws.onopen = () => {

        console.log(
            "WebSocket Connected"
        );
    };

    ws.onmessage = (event) => {

        console.log(
            "Received:",
            event.data
        );

        setMessages(
            prev => [

                ...prev.filter(
                    msg =>
                        msg.text !==
                        "AI is thinking..."
                ),

                {
                    sender: "ai",
                    text: event.data
                }
            ]
        );
    };

    ws.onerror = (error) => {

        console.error(
            "WebSocket Error:",
            error
        );
    };

    ws.onclose = () => {

        console.log(
            "WebSocket Closed"
        );
    };

    return () => {

        ws.close();
    };

}, []);

    async function sendMessage() {

        if (!query.trim()) return;

        if (!problem) return;

        const currentQuery =
            query;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: currentQuery
            }
        ]);

        setQuery("");

        const context =
            cleanHtml(
                problem.question
            );

        const payload = {
            email:
                localStorage.getItem("email"),
            session_id:
                localStorage.getItem("session_id"),

            question:
                problem.titleSlug,

            query:
                currentQuery,

            context
        };

        console.log(
            "Sending Payload:",
            payload
        );

        try {

            await axios.post(
                "https://backend.concis.in/api/chat",
                payload
            );

            setMessages(prev => [
                ...prev,
                {
                    sender: "system",
                    text:
                        "AI is thinking..."
                }
            ]);

        } catch (error) {

            console.error(
                error
            );

            setMessages(prev => [
                ...prev,
                {
                    sender: "system",
                    text:
                        "Failed to queue request."
                }
            ]);
        }
    }

    if (loading) {

        return (
            <div className="
                h-screen
                bg-zinc-950
                text-white
                flex
                items-center
                justify-center
                whitespace-pre-wrap
            ">
                Loading Problem...
            </div>
        );
    }

    return (

        <div className="
            h-screen
            bg-zinc-950
            text-white
            flex
        ">

            {/* Problem Panel */}

            <div className="
                w-1/2
                border-r
                border-zinc-800
                overflow-y-auto
                p-6
            ">

                <h1 className="
                    text-5xl
                    font-bold
                    font-mono
                ">
                    {problem?.questionTitle}
                </h1>

                <p className="
                    mt-2
                    text-zinc-400
                ">
                    {problem?.difficulty}
                </p>

                <div
                    className="
                        mt-6
                        text-zinc-300
                        text-2xl
                        font-mono
                    "
                    dangerouslySetInnerHTML={{
                        __html:
                            problem?.question
                    }}
                />

            </div>

            {/* Chat Panel */}

            <div className="
                w-1/2
                flex
                flex-col
            ">
                <div className="
                mx-4
                mt-4
                p-3
                rounded-xl
                border
                border-orange-500
                bg-yellow-500
                text-sm
                font-bold" 
                >
                    ⚠️Session Notice: This conversation is temporary and is not stored permanently.
                    If you close the session,refresh the page or log out, your chaat history may be lost.
                    SAVE IMPORTANT NOTES BEFORE LEAVING.
                </div>

                <div className="
                    flex-1
                    overflow-y-auto
                    p-6
                ">

                  {
    messages.map(
        (
            message,
            index
        ) => (

            <div
                key={index}
                className={`
                    mb-4
                    flex
                    ${
                        message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                    }
                `}
            >

                <div>

                    <div
                        className="
                            text-xs
                            text-zinc-500
                            mb-1
                        "
                    >
                        {
                            message.sender === "user"
                                ? "You"
                                : message.sender === "system"
                                ? "System"
                                : "ConcisAI Tutor"
                        }
                    </div>

                    <div
                        className={`
                            inline-block
                            rounded-2xl
                            px-5
                            py-4
                            max-w-[800px]
                            whitespace-pre-wrap

                            ${
                                message.sender === "user"
                                    ? "bg-indigo-600 text-white"
                                    : message.sender === "system"
                                    ? "bg-yellow-500/20 text-yellow-200"
                                    : "bg-zinc-800 text-zinc-100"
                            }
                        `}
                    >
                        <ReactMarkdown>
                        {message.text}
                        </ReactMarkdown>
                    </div>

                </div>

            </div>
        )
    )
}

                </div>

                <div className="
                    border-t
                    border-zinc-800
                    p-4
                ">

                    <div className="
                        flex
                        gap-3
                    ">

                        <input
                            value={query}
                            onChange={(e)=>
                                setQuery(
                                    e.target.value
                                )
                            }
                            placeholder="Ask for a hint..."
                            className="
                                flex-1
                                rounded-xl
                                bg-zinc-900
                                font-xl
                                px-4
                                py-3
                                outline-none
                            "
                        />

                        <button
                            onClick={
                                sendMessage
                            }
                            className="
                                rounded-xl
                                bg-indigo-600
                                px-5
                                py-3
                            "
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}