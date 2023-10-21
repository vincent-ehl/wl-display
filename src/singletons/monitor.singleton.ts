// import { AbstractSingleton } from "./abstract.singleton";
import { z } from "zod";
import { dummyResponse } from "@/global";

const DIRECTIONS = z.enum(["H", "R"]);

export const VEHICLE_TYPES = z.enum(["ptTram", "ptBusCity", "ptMetro"]);

export type VEHICLE_TYPES = z.infer<typeof VEHICLE_TYPES>;

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
            departures: z.object({
              departure: z
                .object({
                  departureTime: z.object({
                    countdown: z.number(),
                  }),
                  vehicle: z
                    .object({
                      towards: z.string(),
                      barrierFree: z.boolean(),
                    })
                    .optional(),
                })
                .array(),
            }),
            direction: DIRECTIONS,
            type: VEHICLE_TYPES,
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

export type MonitorResponse = z.infer<typeof MonitorResponseSchema>;

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
      type: VEHICLE_TYPES,
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
  const departures: Map<string, any> = new Map();

  monitors?.data.monitors.forEach((monitor) => {
    const stopName = monitor.locationStop.properties.name;

    monitor.lines.forEach((line) => {
      line.departures.departure.forEach((departure) => {
        if (!departures.has(stopName)) {
          departures.set(stopName, {
            title: monitor.locationStop.properties.title,
            lines: new Map(),
          });
        }

        const lines = departures.get(stopName)?.lines;

        if (!lines?.has(line.name)) {
          lines.set(line.name, {
            directions: new Map([
              [DIRECTIONS.Enum.H, []],
              [DIRECTIONS.Enum.R, []],
            ]),
            type: line.type,
          });
        }

        const directions = lines.get(line.name)?.directions;

        directions?.get(line.direction)?.push({
          towards: unifyTowardsSpelling(
            departure.vehicle?.towards ?? line.towards
          ),
          countdown: departure.departureTime.countdown,
          barrierFree: departure.vehicle?.barrierFree ?? line.barrierFree,
        });
      });
    });
  });

  try {
    return DeparturesSchema.parse(departures);
  } catch (error) {
    console.log(error);
    return;
  }
};

const unifyTowardsSpelling = (towards: string): string => {
  const replacements = new Map([
    ["ASPERNSTRASSE", "Aspernstraße"],
    ["SEESTADT", "Seestadt"],
    ["SCHOTTENTOR", "Schottentor"],
    ["ALAUDAGASSE", "Alaudagasse"],
    ["LEOPOLDAU", "Leopoldau"],
    ["HEILIGENSTADT", "Heiligenstadt"],
    ["HÜTTELDORF", "Hütteldorf S U"],
    ["OBERLAA", "Oberlaa"],
  ]);

  const regex = new RegExp(Array.from(replacements.keys()).join("|"), "gi");

  return towards.replace(
    regex,
    (matched) => replacements.get(matched) ?? matched
  );
};

// class MonitorSingleton extends AbstractSingleton {}

// export const monitorSingleton = new MonitorSingleton();
