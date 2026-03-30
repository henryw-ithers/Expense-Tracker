import DashboardChart from "../components/DashboardChart";

export function DashboardPage() {
  return (
    <div className="container py-4">
      <h1>Dashboard</h1>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Recent Activity</h5>
          <DashboardChart />
        </div>
      </div>
    </div>
  );
}