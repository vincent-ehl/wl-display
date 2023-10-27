import { DeparturesOverviewView } from "@/components/departures/departures-overview";

const Home = (): JSX.Element => {
  return (
    <main>
      <div className="flex flex-col gap-5 p-5">
        <DeparturesOverviewView />
      </div>
    </main>
  );
};

export default Home;
