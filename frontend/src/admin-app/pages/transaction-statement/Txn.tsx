import React from "react";
import userService from "../../../services/user.service";
import depositWithdrawService from "../../../services/deposit-withdraw.service";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import DashboardSidebar from "./DashboardSidebar";
import DashboardDrawer from "./DashboardSidebar";
interface StatCardProps {
    color: any;
    value: any ;
    label: any;
    link : any;
  }

  type TxnStatus = "approved" | "rejected" | "pending";

interface TxnItem {
  amount: number;
  status: TxnStatus;
  type: "deposit" | "withdraw";
  createdAt: string;
}

interface Stats {
  totalAmount: number;
  totalCount: number;
  approvedAmount: number;
  approvedCount: number;
  rejectedAmount: number;
  rejectedCount: number;
  pendingAmount: number;
  pendingCount: number;
}


const Txn = () => {


    const [drawerOpen, setDrawerOpen] = React.useState(false);

   
      
      const userState = useAppSelector(selectUserData);

  const [depositStats, setDepositStats] = React.useState<Stats | null>(null);
  const [withdrawStats, setWithdrawStats] = React.useState<Stats | null>(null);
  const [newClients, setNewClients] = React.useState<number>(0);

  const calculateStats = (data: TxnItem[]): Stats => {
    return data.reduce(
      (acc, item) => {
        acc.totalAmount += item.amount;
        acc.totalCount += 1;
  
        if (item.status === "approved") {
          acc.approvedAmount += item.amount;
          acc.approvedCount += 1;
        }
        if (item.status === "rejected") {
          acc.rejectedAmount += item.amount;
          acc.rejectedCount += 1;
        }
        if (item.status === "pending") {
          acc.pendingAmount += item.amount;
          acc.pendingCount += 1;
        }
        return acc;
      },
      {
        totalAmount: 0,
        totalCount: 0,
        approvedAmount: 0,
        approvedCount: 0,
        rejectedAmount: 0,
        rejectedCount: 0,
        pendingAmount: 0,
        pendingCount: 0,
      }
    );

    
  };

  /* ---------------- Deposit ---------------- */
  const getDepositStmt = () => {
    depositWithdrawService
      .getDepositWithdrawLists({ type: "deposit" })
      .then((res) => {
        const data: TxnItem[] = res?.data?.data ?? [];
        setDepositStats(calculateStats(data));
      });
  };

  /* ---------------- Withdraw ---------------- */
  const getWithdrawStmt = () => {
    depositWithdrawService
      .getDepositWithdrawLists({ type: "withdraw" })
      .then((res) => {
        const data: TxnItem[] = res?.data?.data ?? [];
        setWithdrawStats(calculateStats(data));
      });
  };

  /* ---------------- New Clients (last 2 days) ---------------- */
  const getNewClients = () => {
    userService
      .getUserList({
        username: userState?.user?.username,
        type: "",
        search: "",
        status: "",
        page: 1,
      })
      .then((res: any) => {
        const users = res?.data?.data?.items ?? [];
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const recentUsers = users?.filter(
          (u: any) => new Date(u.createdAt) >= twoDaysAgo
        );

        setNewClients(recentUsers.length);
      });
  };

  React.useEffect(() => {
    getDepositStmt();
    getWithdrawStmt();
    getNewClients();
  }, [userState]);



  return (
    <div className="container-fluid p-4 bg-light">

        
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
  <div className="d-flex align-items-center gap-3">
    <button
      className="btn btn-outline-secondary"
      onClick={() => setDrawerOpen(true)}
    >
      ☰
    </button>
    <h4 className="fw-bold mb-0">WELCOME</h4>
  </div>
  <small className="text-muted">Home / Dashboard</small>
</div>

<DashboardDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
/>





      {/* Top Action Cards */}
      <div className="row g-3 mb-4">
        {[
          { title: "New Clients", color: "warning", icon: "👤" , link:`/list-clients/${userState?.user?.username}` },
          { title: "Deposit list", color: "primary", icon: "💰" , link:"/depositstatement" },
          { title: "UTR Entry", color: "danger", icon: "🏦" , link:"/payment-method" },
          { title: "Withdraw", color: "success", icon: "💵" ,link:"/withdrawstatement" },
          { title: "Add Account", color: "danger", icon: "🏛️" ,link:`/payment-method`   },
          { title: "Account list", color: "danger", icon: "🏦" , link:`/payment-method` },
          { title: "Global search", color: "secondary", icon: "🔍" , link:`/list-clients/${userState?.user?.username}` },
        ].map((item, i) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
            <div className="card shadow-sm p-2 mb-2">
              <div className="card-body d-flex align-items-center gap-3 ">
                <div
                  className={`rounded text-white d-flex align-items-center justify-content-center bg-${item.color}`}
                  style={{ width: 50, height: 50, fontSize: 22 }}
                >
                  {item.icon}
                </div>
                <div className="ml-3">
                  <div className="fw-semibold">{item.title}</div>
                  <CustomLink to={item?.link}>
                  <button className={`btn btn-sm bg-${item.color} mt-1 text-white`}>
                    CLICK HERE
                  </button>
                  </CustomLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="row g-3">
        <StatCard
          color="warning"
          value={newClients}
          label="New Clients"
          link={`/list-clients/${userState?.user?.username}`}
        />

        <StatCard
          color="primary"
          value={depositStats?.totalAmount ?? 0}
          label={`Total Deposits : ${depositStats?.totalCount ?? 0}`}
          link="/depositstatement"
        />

        <StatCard
          color="success"
          value={depositStats?.approvedAmount ?? 0}
          label={`Approved Deposits : ${depositStats?.approvedCount ?? 0}`}
           link="/depositstatement"
        />

        <StatCard
          color="danger"
          value={depositStats?.rejectedAmount ?? 0}
          label={`Rejected Deposits : ${depositStats?.rejectedCount ?? 0}`}
           link="/depositstatement"
        />

        <StatCard
          color="info"
          value={withdrawStats?.totalAmount ?? 0}
          label={`Total Withdrawals : ${withdrawStats?.totalCount ?? 0}`}
           link="/withdrawstatement"
        />

        <StatCard
          color="warning"
          value={withdrawStats?.pendingAmount ?? 0}
          label={`Pending Withdrawals : ${withdrawStats?.pendingCount ?? 0}`}
           link="/withdrawstatement"
        />

        <StatCard
          color="success"
          value={withdrawStats?.approvedAmount ?? 0}
          label={`Approved Withdrawals : ${withdrawStats?.approvedCount ?? 0}`}
           link="/withdrawstatement"
        />

        <StatCard
          color="danger"
          value={withdrawStats?.rejectedAmount ?? 0}
          label={`Rejected Withdrawals : ${withdrawStats?.rejectedCount ?? 0}`}
           link="/withdrawstatement"
        />
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ color, value, label , link }) => {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
      <div className={`card text-white bg-${color} shadow-sm h-100`}>
        <div className="card-body p-2">
          <h3 className="fw-bold">{value}</h3>
          <p className="mb-2">{label}</p>
          <div className=" text-center ">
          <CustomLink to={link} className="text-white text-center text-decoration-none fw-semibold">
            More info →
          </CustomLink></div>
        </div>
      </div>
    </div>
  );
};

export default Txn;
