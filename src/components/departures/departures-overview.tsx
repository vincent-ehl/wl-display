"use client";

import {
  Departures,
  MonitorResponse,
  MonitorResponseSchema,
  VEHICLE_TYPES,
  transformMonitorToDepartures,
} from "@/helpers/monitor.helpers";
import { DeparturesView } from "./departures";
import { useEffect, useState } from "react";

const fetchData = async (): Promise<MonitorResponse | undefined> => {
  const ids = [60201891, 60200916, 60201182].join(",");

  try {
    const apiResponse = await (
      await fetch(`api/wl-realtime-monitor/${ids}`)
    ).json();

    console.log(apiResponse);

    return MonitorResponseSchema.parse(apiResponse);
  } catch (error) {
    console.error(error);
  }

  return;
};

export const DeparturesOverviewView = (): JSX.Element => {
  const [departures, setDepartures] = useState<Departures | undefined>(
    undefined
  );

  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const refreshData = async () => {
      console.log("fetching new data");

      const data = await fetchData();
      try {
        const monitorResponse = MonitorResponseSchema.parse(data);

        const departures = await transformMonitorToDepartures(monitorResponse);

        setDepartures(departures);
      } catch (error) {
        console.error(error);
      }
    };

    const updateDisplay = () => {
      console.log("updating display");

      setNow(Date.now());
    };

    refreshData();

    const apiFetchInterval = setInterval(refreshData, 1000 * 60 * 5);
    const uiRefreshInterval = setInterval(updateDisplay, 1000 * 5);

    return () => {
      clearInterval(apiFetchInterval);
      clearInterval(uiRefreshInterval);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-4">
      <div className="border-0 rounded shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white p-2 border-u1-red col-span-2">
        <DeparturesView
          now={now}
          departures={departures}
          diva="60201891"
          types={[VEHICLE_TYPES.Enum.ptMetro, VEHICLE_TYPES.Enum.ptTram]}
        />
      </div>
      <div className="border-0 rounded shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white p-2 border-u2-purple">
        <DeparturesView
          now={now}
          departures={departures}
          diva="60200916"
          types={[VEHICLE_TYPES.Enum.ptMetro, VEHICLE_TYPES.Enum.ptTram]}
        />
      </div>
      <div className="row-span-2">
        <div className="relative overflow-hidden h-64">
          <img
            className="absolute left-0 right-0 mx-auto w-64 -top-[15%]"
            src="/assets/img/sleeping-cat.gif"
          />
        </div>
        <div className="flex justify-end">
          <img src="/assets/img/wl-logo.png" />
        </div>
      </div>
      <div className="border-0 rounded shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white p-2 border-u4-green">
        <DeparturesView
          now={now}
          departures={departures}
          diva="60201182"
          types={[VEHICLE_TYPES.Enum.ptMetro]}
          lineNames={["U4"]}
        />
      </div>
    </div>
  );
};
