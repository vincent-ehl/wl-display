import { DeparturesView } from "@/components/departures/departures";
import { VEHICLE_TYPES } from "@/singletons/monitor.singleton";

export default function Home() {
  return (
    <main className="p-5 grid grid-cols-2 gap-2">
      <div className="border-4 border-u1-red col-span-2">
        <DeparturesView
          diva="60201891"
          types={[VEHICLE_TYPES.Enum.ptMetro, VEHICLE_TYPES.Enum.ptTram]}
        />
      </div>
      <div className="border-4 border-u2-purple">
        <DeparturesView
          diva="60200916"
          types={[VEHICLE_TYPES.Enum.ptMetro, VEHICLE_TYPES.Enum.ptTram]}
        />
      </div>
      <div className="border-4 border-u4-green">
        <DeparturesView
          diva="60201182"
          types={[VEHICLE_TYPES.Enum.ptMetro]}
          lineNames={["U4"]}
        />
      </div>
    </main>
  );
}
