import React, { useState } from "react";
import { api } from "~/utils/api";
import EditIcon from "@mui/icons-material/Edit";

export default function TimePicker({ id, time }: { id: string; time: string }) {
  const [showModal, setShowModal] = useState(false);
  const [newTime, setNewTime] = useState(time);

  const utils = api.useContext();
  const updateTime = api.dinner.updateTime.useMutation({
    onSettled() {
      // sync with server
      utils.dinner.getFortnight.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);

    if (newTime != time) updateTime.mutate({ dinnerId: id, newTime });
  };

  return (
    <>
      <div className="flex gap-1 md:flex-row flex-col items-center mb-2 md:mb-0 md:items-start justify-between bg-zinc-800 text-zinc-100">
        <div className="md:w-5 md:h-5"></div>
        <div
          key={id}
          className="flex text-sm font-semibold tracking-tighter md:text-lg"
        >
          {time}
        </div>
        <button
          className="flex"
          onClick={() => setShowModal(true)}
        >
          <EditIcon fontSize="small" className="text-zinc-400 hover:text-zinc-600" />
        </button>
      </div>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex  items-center justify-center overflow-y-auto overflow-x-hidden bg-zinc-400 bg-opacity-30 outline-none focus:outline-none">
            <div className="rounded-sm bg-zinc-800 p-4">
              <form
                className="flex flex-col items-center gap-2 "
                onSubmit={(e) => handleSubmit(e)}
              >
                <label htmlFor="dinnerTime">New Dinner Time: </label>
                <input
                  type="time"
                  id="dinnerTime"
                  name="dinnerTime"
                  onChange={(e) => setNewTime(e.target.value)}
                  className="rounded-md p-2 text-lg text-zinc-900 md:text-xl"
                  defaultValue={time}
                  step={300}
                  min={"17:00"}
                  max={"22:00"}
                />
                <input
                  className="block rounded-sm text-orange-300 hover:cursor-pointer hover:text-orange-600"
                  type="submit"
                  value="Save"
                />
              </form>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
