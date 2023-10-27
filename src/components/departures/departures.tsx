import { departureTimeToMinutes } from "@/helpers/departures.helpers";
import { Departures, VEHICLE_TYPES } from "@/helpers/monitor.helpers";

interface DeparturesProps {
  departures: Departures | undefined;
  diva: string;
  types: VEHICLE_TYPES[];
  lineNames?: string[];
  now: number;
}

const getColorByLine = (line: string): string => {
  switch (line) {
    case "U1":
      return "bg-u1-red";
    case "U2":
      return "bg-u2-purple";
    case "U4":
      return "bg-u4-green";
    case "U1":
      return "bg-u1-red";
    default:
      return "bg-tram-red";
  }
};

export const DeparturesView = (props: DeparturesProps): JSX.Element => {
  const departure = props.departures?.get(props.diva);

  if (departure) {
    let lines = Array.from(departure.lines);

    lines = lines.filter((line) => props.types.includes(line[1].type));

    if (props.lineNames?.length) {
      lines = lines.filter((line) => props.lineNames?.includes(line[0]));
    }

    departure.lines.forEach((line) => {
      line.directions.forEach((directions) => {
        directions = directions.filter((direction) => {
          const keepDate =
            new Date(direction?.timeReal || direction?.timePlanned).getTime() >
            props.now;

          return keepDate;
        });
      });
    });

    return (
      <div className="overflow-hidden text-black-font">
        <div className={"grid grid-cols-" + lines.length + " gap-2"}>
          {lines.map((line, index) => {
            const color = getColorByLine(line[0]);

            return (
              <div key={index} className="flex gap-2 flex-col">
                <div className="flex justify-between items-center">
                  <div
                    className={
                      "w-8 h-8 rounded-sm flex justify-center items-center " +
                      color
                    }
                  >
                    <span className="text-white font-bold">{line[0]}</span>
                  </div>
                  <p className="font-semibold text-xs text-right">
                    {departure.title}
                  </p>
                </div>
                <div className={"grid grid-cols-2 gap-2"}>
                  {Array.from(line[1].directions).map((direction, index) => {
                    const displayCount = 3;

                    const limitedDepartures = direction[1].slice(
                      0,
                      displayCount
                    );

                    return (
                      <div key={index}>
                        <div className="bg-black text-white p-1">
                          {limitedDepartures.map((departure, index) => {
                            const countdown = departureTimeToMinutes(
                              departure.timeReal ?? departure.timePlanned
                            );

                            return (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-1"
                              >
                                <div className="col-span-1">
                                  {departure.barrierFree && "_"}
                                </div>
                                <div
                                  className="col-span-9 whitespace-nowrap overflow-hidden text-ellipsis"
                                  lang="de"
                                >
                                  {departure.towards}
                                </div>
                                <div className="col-span-1">
                                  {countdown ?? departure.countdown + "Fake"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <div>NO DEPARTURES</div>;
  }
};
