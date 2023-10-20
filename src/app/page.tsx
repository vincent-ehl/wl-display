import { DeparturesView } from "@/components/departures/departures";

export default function Home() {
  return (
    <main className="p-5 grid grid-rows-2 grid-flow-col gap-2">
      <div className="border-4 border-u1-red">
        <div>Taborstraße U</div>
        <DeparturesView diva="60201891" />
      </div>
      <div className="border-4 border-u2-purple">
        <div>Nestroyplatz</div>
        <div>
          <div>U2</div>
        </div>
      </div>
      <div className="border-4 border-u4-green">
        <div>Schottenring</div>
        <div>
          <div>U4</div>
        </div>
      </div>
    </main>
  );
}
