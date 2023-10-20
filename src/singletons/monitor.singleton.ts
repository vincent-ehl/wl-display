// import { AbstractSingleton } from "./abstract.singleton";
import { z } from "zod";
import { dummyResponse } from "@/global";

const DIRECTIONS = z.enum(["H", "R"]);

const MonitorResponseSchema = z.object({
  data: z.object({
    monitors: z.array(
      z.object({
        locationStop: z.object({
          properties: z.object({
            name: z.string(),
            title: z.string(),
          }),
        }),
        lines: z.array(
          z.object({
            name: z.string(),
            towards: z.string(),
            barrierFree: z.boolean(),
            departureTime: z.object({
              countdown: z.number(),
            }),
            direction: DIRECTIONS,
          })
        ),
      })
    ),
  }),
  message: z.object({
    value: z.string(),
    messageCode: z.number(),
  }),
});

type MonitorResponse = z.infer<typeof MonitorResponseSchema>;

/**
 * Get Monitor data as returned by the Wiener Linien API
 *
 * @returns Promise<MonitorResponse | undefined>
 */
export const getMonitors = (): Promise<MonitorResponse | undefined> => {
  return new Promise<MonitorResponse>((resolve, reject) => {
    setTimeout(() => {
      try {
        const response = MonitorResponseSchema.parse(dummyResponse);

        resolve(response);
      } catch (error) {
        console.error(error);

        reject(error);
      }
    }, 300);
  });
};

const DepartureSchema = z.object({
  towards: z.string(),
  countdown: z.number(),
  barrierFree: z.boolean(),
});

const DirectionsSchema = z.map(DIRECTIONS, z.array(DepartureSchema));

const StopSchema = z.object({
  title: z.string(),
  lines: z.map(
    z.string(),
    z.object({
      directions: DirectionsSchema,
    })
  ),
});
const DeparturesSchema = z.map(z.string(), StopSchema);

export type Departures = z.infer<typeof DeparturesSchema>;

/**
 * Transforms Monitor data from Wiener Linien API to our "Departures" Type
 */
export const transformMonitorToDepartures = async (
  monitors: MonitorResponse
): Promise<Departures | undefined> => {
  const departures: Departures = new Map();

  monitors?.data.monitors.forEach((monitor) => {
    const locationName = monitor.locationStop.properties.name;
    if (departures.has(locationName)) {
      monitor.lines.forEach((line) => {
        const lines = departures.get(locationName)?.lines;
        if (lines?.has(line.name)) {
          const directions = lines.get(line.name)?.directions;
          if (directions?.has(line.direction)) {
            directions.get(line.direction)?.push({
              towards: line.towards,
              countdown: line.departureTime.countdown,
              barrierFree: line.barrierFree,
            });
          }
        }
      });
    }
  });

  return departures;
};

// class MonitorSingleton extends AbstractSingleton {}

// export const monitorSingleton = new MonitorSingleton();
