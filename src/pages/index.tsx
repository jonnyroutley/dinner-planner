import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import Loading from "./loading";
import { WeekViewer } from "~/components/weekViewer";

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();

  const [isFirstWeek, setIsFirstWeek] = useState(true);
  const toggleIsFirstWeek = () => {
    setIsFirstWeek(!isFirstWeek);
  };

  const utils = api.useContext();

  const createDinner = api.dinner.createDinner.useMutation({
    onError: (error) => console.log(error),
    onSettled: () => {
      utils.dinner.getFortnight.invalidate();
    }
  });

  const { data: users } = api.user.getAll.useQuery();
  // console.log(users)
  const { data, isLoading } = api.dinner.getFortnight.useQuery();

  useEffect(() => {
    // if there are fewer than fourteen days
    if (data && data.length < 14) {
      // check which dates are missing then create them before refetching
      let expectedDates = [];
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      let time = today.getTime();
      for (let i = 0; i < 14; i++) {
        expectedDates.push(new Date(time));
        time += 86400000;
      }

      const existingDates = data.map((e) => e.date.getTime());
      const missingDates = expectedDates.filter(
        (e) => !existingDates.includes(e.getTime())
      );

      for (let missingDate of missingDates) {
        createDinner.mutate({ date: missingDate });
      }

    } else if (data && data.length > 14) {
      alert("Duplicate data - tell Jonny!");
    }
  }, [data]);

  if (sessionStatus == "loading") return <Loading />;

  if (!session) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <button
          onClick={() => signIn()}
          className="text-2xl hover:text-zinc-600"
          // disabled={addAttendance.isLoading || removeAttendance.isLoading}
        >
          Sign In
        </button>
      </div>
    );
  }
  if (isLoading) return <Loading />;

  if (!data || !users) {
    return <div>Something went wrong...</div>;
  }

  return (
    <>
      <Head>
        <title>In For Din?</title>
        <meta name="description" content="Did you eat?" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="flex min-h-screen flex-col gap-4 bg-zinc-100 p-2 font-mono md:px-8 md:py-4">
        <div className="flex flex-row items-end justify-between">
          <h1 className="text-5xl font-bold text-zinc-800 ">In For Din?</h1>
          <div className="flex flex-row items-center gap-4">
            <div>
              {isFirstWeek ? (
                <button
                  className="rounded-lg bg-zinc-200 p-2 shadow-md hover:bg-zinc-400 md:p-4"
                  onClick={toggleIsFirstWeek}
                >
                  Week 1
                </button>
              ) : (
                <button
                  className="rounded-lg bg-zinc-400 p-2 shadow-md hover:bg-zinc-200 md:p-4 "
                  onClick={toggleIsFirstWeek}
                >
                  Week 2
                </button>
              )}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xl font-bold shadow-md md:h-14 md:w-14">
              {session.user.name!.slice(0, 1)}
            </div>
          </div>
        </div>
        {isFirstWeek ? (
          <WeekViewer data={data.slice(0, 7)} users={users} session={session} />
        ) : (
          <WeekViewer
            data={data.slice(7, 14)}
            users={users}
            session={session}
          />
        )}
      </main>
    </>
  );
}
