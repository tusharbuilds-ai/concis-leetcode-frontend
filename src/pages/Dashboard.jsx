import {
  BrainCircuit,
  Mail,
  BookOpen,
  Search,
} from "lucide-react";

import axios from "axios";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import { api } from "../services/api";




const handleLogout = async () => {

  try {

    await api.post(
      "/api/logout",
      {
        email:
          localStorage.getItem("email"),

        session_id:
          localStorage.getItem("session_id")
      }
    );

  } catch (error) {

    console.error(
      "Logout Error:",
      error
    );

  } finally {

    localStorage.removeItem(
      "email"
    );

    localStorage.removeItem(
      "session_id"
    );

    navigate("/");
  }
};



export default function Dashboard() {

  const navigate = useNavigate();

  const email =
    localStorage.getItem("email");

  const sessionId =
    localStorage.getItem("session_id");

  const [search, setSearch] =
    useState("");

  const [problems, setProblems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchProblems =
      async () => {

        try {

          const response =
            await api.get(
              "api/leetcode/problems"
            );

          setProblems(
            response.data
              .problemsetQuestionList
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }
      };

    fetchProblems();

  }, []);

  const filteredProblems =
    problems.filter(
      (problem) =>
        problem.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <div className="
      min-h-screen
      bg-[#0A0A0A]
      text-white
      px-6
      py-8
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">

      <div className="
        flex
        items-center
        justify-between
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          <div className="
            h-14
            w-14
            rounded-2xl
            bg-indigo-600
            flex
            items-center
            justify-center
          ">
            <BrainCircuit />
          </div>

          <div>

            <h1 className="
              text-3xl
              font-bold
            ">
              Concis AI Tutor
            </h1>

            <p className="
              text-zinc-400
            ">
              Learn how to think.
            </p>

          </div>

        </div>

        <button

          onClick={handleLogout}

          className="
            px-5
            py-3
            rounded-xl
            bg-red-600
            hover:bg-red-700
            transition-all
            font-semibold
          "
        >

          Logout

        </button>

      </div>
      

        </div>

        <div className="
          mt-8
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        ">

          <div className="
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-950
            p-6
          ">

            <Mail
              className="
              text-indigo-500
            "
            />

            <p className="
              mt-4
              text-zinc-400
            ">
              Logged In Email
            </p>

            <h3 className="
              mt-2
              font-semibold
            ">
              {email}
            </h3>

          </div>

          <div className="
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-950
            p-6
          ">

            <BookOpen
              className="
              text-indigo-500
            "
            />

            <p className="
              mt-4
              text-zinc-400
            ">
              Classes Attended
            </p>

            <h3 className="
              mt-2
              text-3xl
              font-bold
            ">
              0
            </h3>

          </div>

          <div className="
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-950
            p-6
          ">

            <BrainCircuit
              className="
              text-indigo-500
            "
            />

            <p className="
              mt-4
              text-zinc-400
            ">
              Active Session
            </p>

            <h3 className="
              mt-2
              text-sm
              break-all
            ">
              {sessionId}
            </h3>

          </div>

        </div>

        <div className="
          mt-10
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-950
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
          ">
            Start Learning
          </h2>

          <div className="
            mt-5
            relative
          ">

            <Search
              className="
                absolute
                left-4
                top-4
                text-zinc-500
              "
            />

            <input

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              placeholder="
                Search LeetCode Problem
              "

              className="
                w-full
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900
                py-4
                pl-12
                pr-4
                outline-none
              "
            />

          </div>

        </div>

        <div className="
          mt-10
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">
            Problems
          </h2>

          {
            loading ? (

              <div>
                Loading Problems...
              </div>

            ) : (

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-8
              ">

                {
                  filteredProblems.map(
                    (problem) => (

                      <div

                        key={
                          problem.titleSlug
                        }

                        onClick={() =>
                          navigate(
                            "/chat",
                            {
                              state:{
                                problemSlug:
                                  problem.titleSlug
                              }
                            }
                          )
                        }

                        className="
                          rounded-3xl
                          border
                          border-zinc-800
                          bg-stone-950
                          p-12
                          cursor-pointer
                          transition-all
                          hover:border-mauve-400
                          hover:-translate-y-1
                        "
                      >

                        <div className="
                          flex
                          justify-between
                          items-start
                        ">

                          <h3 className="
                            text-2xl
                            font-bold
                            font-mono
                          ">
                            {problem.title}
                          </h3>

                          <span

                            className={`
                              px-3
                              py-1
                              rounded-lg
                              text-lg

                              ${
                                problem.difficulty === "Easy"
                                  ? "bg-green-500/20 text-green-400"
                                  : problem.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }
                            `}
                          >

                            {
                              problem.difficulty
                            }

                          </span>

                        </div>

                        <p className="
                          mt-3
                          text-zinc-500
                        ">
                          Acceptance
                          {" "}
                          {
                            problem.acRate.toFixed(1)
                          }
                          %
                        </p>

                        <div className="
                          mt-4
                          flex
                          flex-wrap
                          gap-2
                        ">

                          {
                            problem.topicTags
                              ?.slice(0, 3)
                              .map(
                                (tag) => (

                                  <span

                                    key={
                                      tag.slug
                                    }

                                    className="
                                      rounded-lg
                                      bg-zinc-800
                                      px-2
                                      py-1
                                      text-lg
                                      text-zinc-300
                                    "
                                  >

                                    {tag.name}

                                  </span>

                                )
                              )
                          }

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            )
          }

        </div>

      </div>
  );
}