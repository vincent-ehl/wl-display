import {
  Departures,
  getMonitors,
  transformMonitorToDepartures,
} from "@/singletons/monitor.singleton";

interface DeparturesProps {
  diva: string;
}

export const DeparturesView = async (
  props: DeparturesProps
): Promise<JSX.Element> => {
  const monitors = await getMonitors();

  let departures: Departures | undefined;

  if (monitors) {
    const departures = (await transformMonitorToDepartures(monitors))?.get(
      props.diva
    );
  }

  if (departures) {
    return (
      <div>
        {Array.from(departures).map((departure) => {
          const lines = Array.from(departure[1].lines);

          return (
            <div>
              <p>{departure[0]}</p>
              <p>{departure[1].title}</p>
              <div>
                {lines.map((line) => {
                  return (
                    <div>
                      {Array.from(line[1].directions).map((direction) => {
                        return (
                          <div>
                            <p>{direction[0]}</p>
                            <div>
                              {direction[1].map((departure) => {
                                return (
                                  <div>
                                    <p>BarrierFree: {departure.barrierFree}</p>
                                    <p>Towards: {departure.towards}</p>
                                    <p>Countdown: {departure.countdown}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div>NO DEPARTURES</div>;
  }
};
