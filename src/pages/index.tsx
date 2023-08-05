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
  const addMissingDates = api.dinner.addMissingDates.useMutation({
    onSettled() {
      utils.dinner.getFortnight.invalidate();
    },
  });

  const { data: users } = api.user.getAll.useQuery();
  // console.log(users)
  const { data, isLoading } = api.dinner.getFortnight.useQuery();

  useEffect(() => {
    // console.log(data)
    if (data && data.length < 14) {
      // console.log(data);
      // console.log(data.length);
      const numMissing = 14 - data.length;
      // if (data.length > 0) {
      // console.log(data[data.length-1])
      // }
      const finalDate = data.length > 0 ? data[data.length - 1]!.date : new Date(Date.now() - 86400000);
      addMissingDates.mutate({finalDate, numMissing})
    } else if (data && data.length > 14) {
      alert('Duplicate data - tell Jonny!')
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
      </Head>
      <main className="flex min-h-screen flex-col gap-4 bg-zinc-100 p-2 font-mono md:px-8 md:py-4">
        <div className="flex flex-row items-end justify-between">
          <h1 className="text-5xl font-bold text-zinc-800">In For Din?</h1>
          <div className="flex flex-row items-center gap-4">
            <div>
              {isFirstWeek ? (
                <button
                  className="rounded-lg bg-zinc-200 p-4 shadow-md hover:bg-zinc-400"
                  onClick={toggleIsFirstWeek}
                >
                  Week 1
                </button>
              ) : (
                <button
                  className="rounded-lg bg-orange-200 p-4 shadow-md hover:bg-orange-400 "
                  onClick={toggleIsFirstWeek}
                >
                  Week 2
                </button>
              )}
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-xl font-bold shadow-md">
              {session.user.name!.slice(0,1)}
            </div>
          </div>
        </div>
        {isFirstWeek ? 
        <WeekViewer data={data.slice(0,7)} users={users} session={session}/> 
        : <WeekViewer data={data.slice(7,14)} users={users} session={session}/> }
        

        
      </main>
    </>
  );
}
