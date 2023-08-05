import React, { useState } from "react";

export default function TimePicker() {
  const [style, setStyle] = useState({ display: "none" });

  return (
    <div className="text-zinc-800">
        <form className="flex flex-row gap-2">
            <div>
                <input type="time" className="rounded-sm" defaultValue={"19:00"}/>
            </div>
            <div>
                <input className="text-zinc-50 rounded-sm" type="submit" value="✔" />
            </div>
        </form>
    </div>
  );
}
