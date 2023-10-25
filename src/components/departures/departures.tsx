import { departureTimeToMinutes } from "@/helpers/departures.helpers";
import { Departures, VEHICLE_TYPES } from "@/helpers/monitor.helpers";

interface DeparturesProps {
  departures: Departures | undefined;
  diva: string;
  types: VEHICLE_TYPES[];
  lineNames?: string[];
  now: number;
}

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
      <div className="overflow-hidden">
        <p>
          {departure.title} (DIVA: {props.diva})
        </p>
        <div className={"grid grid-cols-" + lines.length + " gap-2"}>
          {lines.map((line, index) => {
            return (
              <div key={index}>
                <p>
                  {line[0]} ({line[1].type})
                </p>
                <div className={"grid grid-cols-2 gap-2"}>
                  {Array.from(line[1].directions).map((direction, index) => {
                    // const availableDirections: string = Array.from(
                    //   direction[1].reduce(
                    //     (towards, current) => towards.add(current.towards),
                    //     new Set<string>()
                    //   )
                    // ).join(", ");

                    const displayCount = 3;

                    const limitedDepartures = direction[1].slice(
                      0,
                      displayCount
                    );

                    return (
                      <div key={index}>
                        {/* <p>{"->" + availableDirections}</p> */}
                        <div className="bg-black text-white">
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
                                  className="col-span-9 hyphens-auto"
                                  lang="de"
                                >
                                  {departure.towards}
                                </div>
                                <div className="col-span-2">
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
