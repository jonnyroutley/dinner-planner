import React, { FC } from "react";
import type { Dinner, User } from "@prisma/client";
import { api } from "~/utils/api";
import type { Session } from "next-auth";

type weekViewerProps = { data: Dinner[], users: User[], session: Session};

export const WeekViewer: FC<weekViewerProps> = ({ data, users, session }) => {
  const dateToString = (date: Date) => {
    // console.log(date)
    let datestr = date.getDate() + "/" + (date.getMonth() + 1);
    return datestr;
  };

  const nameFromId = (userId: string | null) => {
    const user = users.find((el) => el.id == userId);

    if (user) {
      return user.name!.split(" ")[0];
    }
    return "";
  };

  const toggleAttendance = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dinnerId: string,
    attending: boolean
  ) => {
    e.preventDefault();
    // alert("clicked");
    if (attending) {
      removeAttendance.mutate({ dinnerId });
      // data![key]!.users = data![key]!.users.filter((user) => user.name != username);
    } else {
      addAttendance.mutate({ dinnerId });
    }
  };

  const toggleCooking = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dinnerId: string,
    cooking: boolean
  ) => {
    e.preventDefault();
    if (cooking) {
      removeCooking.mutate({ dinnerId });
    } else {
      setCooking.mutate({ dinnerId });
    }
  };

  const utils = api.useContext();
  const removeAttendance = api.dinner.removeAttendance.useMutation({
    onSettled() {
      // sync with server
      utils.dinner.getFortnight.invalidate();
    },
  });
  const addAttendance = api.dinner.addAttendance.useMutation({
    onSettled() {
      utils.dinner.getFortnight.invalidate();
    },
  });
  // const { users, isLoading } = api.user.getAll.useQuery();

  const setCooking = api.dinner.setCooking.useMutation({
    onSettled() {
      utils.dinner.getFortnight.invalidate();
    },
  });

  const removeCooking = api.dinner.removeCooking.useMutation({
    onSettled() {
      utils.dinner.getFortnight.invalidate();
    },
  });

  const userAttending = (arr: Array<string>) => {
    return arr.some(function (el: string) {
      return el === session!.user.id;
    });
  };

  const userCooking = (cookUserId: string | null) => {
    return cookUserId === session!.user.id;
  };

  return (
    <div className="grow rounded-xl bg-zinc-800 p-4 shadow-lg md:p-8">
      <div className="grid grid-cols-7 gap-[2px] md:gap-4">
        {data.map((dinner, key) => (
          <div key={key} className="rounded-sm bg-zinc-100 p-2 md:rounded-lg">
            <h1 className="text-center text-4xl font-bold text-orange-600 ">
              {dinner.name.slice(0, 1)}
            </h1>
            <p className="text-center text-xs text-zinc-600">
              {dateToString(dinner.date)}
            </p>
            <div className="flex h-72 flex-col justify-between gap-2">
              <div className="no-scrollbar mt-2 flex max-h-full flex-row flex-wrap items-center justify-center gap-2 overflow-y-scroll py-2 shadow-inner">
                {dinner.userIDs.map((userId) => (
                  <div
                    key={userId}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-100 shadow-md md:h-14 md:w-14"
                  >
                    {nameFromId(userId)}
                  </div>
                ))}
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-center text-orange-600">
                  {dinner.userIDs.length}
                </p>
                <button
                  type="button"
                  disabled={
                    addAttendance.isLoading || removeAttendance.isLoading
                  }
                  onClick={(e) =>
                    toggleAttendance(e, dinner.id, userAttending(dinner.userIDs))
                  }
                  className="h-6 w-6 rounded-md bg-zinc-400 hover:bg-zinc-600"
                >
                  {userAttending(dinner.userIDs) ? "-" : "+"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {data.map((dinner) => (
          <div
            key={dinner.id}
            className="m-auto flex flex-row items-center gap-2 text-lg font-semibold text-zinc-100"
          >
            {dinner.time}
            {/* <TimePicker/> */}
          </div>
        ))}
        {data.map((dinner, key) => (
          <div className="flex flex-col items-center " key={key}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-zinc-100">
              {nameFromId(dinner.cookUserId)}
            </div>
            <button
              type="button"
              className="-my-4 h-6 w-6 rounded-md bg-zinc-400 hover:bg-zinc-600"
              onClick={(e) =>
                toggleCooking(e, dinner.id, userCooking(dinner.cookUserId))
              }
            >
              {userCooking(dinner.cookUserId) ? "-" : "+"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
