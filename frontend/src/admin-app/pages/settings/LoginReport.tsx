import React from "react";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import UserService from "../../../services/user.service";
import { useNavigate, useParams } from "react-router-dom";

interface LoginReportItem {
  _id: string;
  country: string;
  region: string;
  org: string; // ISP
  ip: string;
  createdAt: string;
}

const LoginReport = () => {
  const [tableData, setTableData] = React.useState<LoginReportItem[]>([]);
 const userState = useAppSelector(selectUserData);
//   const { id } = useParams();
  const  id  = userState?.user?._id
  console.log(id, "myledgererrid");
  React.useEffect(() => {
    if (id) {
      UserService.loginReports({ _id: id }).then((res: AxiosResponse<any>) => {
        const logs = res.data?.data || [];

        const formatted = logs.map((item: any) => ({
          _id: item._id,
          country: item.logs.country,
          region: item.logs.region,
          org: item.logs.org,
          ip: item.logs.ip,
          createdAt: item.createdAt,
        }));

        setTableData(formatted);
      });
    }
  }, [id]);

  const navigate = useNavigate();

  return (
    <div style={{ padding: "0" }} className="container-fluid p-md-4 mt-3">
      <div
        style={{ background: "#0f2327" }}
        className="bg-grey  flex item-center justify-between px-5 py-3 gx-bg-flex"
      >
        <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
          Login Report
        </span>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="btn bg-primary text-white"
        >
          <span>Back</span>
        </button>
      </div>

      <div className="mb-20 ">
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered w-100"
        
          >
            <thead className="navbar-bet99 text-dark ">
              <tr role="row">
                <th
                  className="p-1 pl-2 small sorting_disabled pr-0"
                  style={{
                    minWidth: 170,
                    width: 170,
                    backgroundColor: "#0f2327",
                    color: "white",
                  }}
                >
                  COUNTRY
                </th>
                {/* <th
                  className="p-1 small text-center no-sort sorting_disabled"
                  style={{
                    width: 81,
                    backgroundColor: "#0f2327",
                    color: "white",
                  }}
                >
                  REGION
                </th> */}
                <th
                  className="p-1 small text-center no-sort sorting_disabled"
                  style={{
                    width: 81,
                    backgroundColor: "#0f2327",
                    color: "white",
                  }}
                >
                  ISP
                </th>
                <th
                  className="p-1 small text-center no-sort sorting_disabled"
                  style={{
                    width: 60,
                    backgroundColor: "#0f2327",
                    color: "white",
                  }}
                >
                  IP-ADDRESS
                </th>
                <th
                  className="p-1 small text-center  no-sort sorting_disabled"
                  style={{
                    width: 97,
                    backgroundColor: "#0f2327",
                    color: "white",
                  }}
                >
                  LOGIN DATE
                </th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((row, index) => (
                <tr
                  key={row._id}
                  role="row"
                  className={index % 2 === 0 ? "even" : "odd"}
                >
                  <td className="small pl-2 pr-0">{row.country}</td>
                  {/* <td>
                    <span className="">{row.region}</span>
                  </td> */}
                  <td>
                    <span className="t">{row.org}</span>
                  </td>
                  <td>{row.ip}</td>
                  
                  <td>
                    {new Date(row.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginReport;
