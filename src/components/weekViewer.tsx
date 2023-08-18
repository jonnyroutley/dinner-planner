import React, { FC } from "react";
import type { Dinner, User } from "@prisma/client";
import { api } from "~/utils/api";
import type { Session } from "next-auth";
import { Tooltip } from "react-tooltip";
import TimePicker from "./timePicker";

type weekViewerProps = { data: Dinner[]; users: User[]; session: Session };

export const WeekViewer: FC<weekViewerProps> = ({ data, users, session }) => {
  const dateToString = (date: Date) => {
    // console.log(date)
    let datestr = date.getDate() + "/" + (date.getMonth() + 1);
    return datestr;
  };

  const nameFromId = (userId: string | null, initialsOnly = true) => {
    const user = users.find((el) => el.id == userId);

    if (user) {
      if (initialsOnly) {
        return user.name
          .split(" ")
          .map((name) => name[0])
          .join("");
      }
      return user.name;
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
    <div className=" rounded-xl bg-zinc-800 px-4 py-6 shadow-lg md:p-8">
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
                  <>
                    <div
                      key={userId}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-100 shadow-md md:h-14 md:w-14 md:text-base"
                      data-tooltip-content={nameFromId(userId, false)}
                      data-tooltip-id={`attendee-name-${key}`}
                    >
                      {nameFromId(userId)}
                    </div>
                    <Tooltip id={`attendee-name-${key}`} />
                  </>
                ))}
              </div>
              <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between">
                <p className="text-center text-orange-600">
                  {dinner.userIDs.length}
                </p>
                <button
                  type="button"
                  disabled={
                    addAttendance.isLoading || removeAttendance.isLoading
                  }
                  onClick={(e) =>
                    toggleAttendance(
                      e,
                      dinner.id,
                      userAttending(dinner.userIDs)
                    )
                  }
                  className="h-5 w-5 rounded-md bg-zinc-400 text-sm hover:bg-zinc-600 md:h-6 md:w-6 md:text-base"
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
            className="m-auto flex flex-row items-center gap-2 text-sm font-semibold tracking-tighter text-zinc-100 md:text-lg"
          >
            {/* {dinner.time} */}
            <TimePicker id={dinner.id} time={dinner.time} />
          </div>
        ))}
        {data.map((dinner, key) => (
          <div className="flex flex-col items-center " key={key}>
            <div
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-zinc-100 md:h-14 md:w-14 md:text-base"
              data-tooltip-content={nameFromId(dinner.cookUserId, false)}
              data-tooltip-id={`chef-name-${key}`}
            >
              {nameFromId(dinner.cookUserId)}
            </div>
            <Tooltip id={`chef-name-${key}`} />
            <button
              type="button"
              className="-my-3 h-5 w-5 rounded-md bg-zinc-400 text-sm hover:bg-zinc-600 md:h-6 md:w-6 md:text-base"
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
