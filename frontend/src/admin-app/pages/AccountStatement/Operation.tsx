import moment from "moment";
import React, { MouseEvent } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import accountService from "../../../services/account.service";
import { dateFormat } from "../../../utils/helper";
import { isMobile } from "react-device-detect";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import userService from "../../../services/user.service";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { AccoutStatement } from "../../../models/AccountStatement";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import ReactModal from "react-modal";
import BetListComponent from "../UnsetteleBetHistory/bet-list.component";
import { useAppSelector } from "../../../redux/hooks";
import { selectLoader } from "../../../redux/actions/common/commonSlice";

import "./CommissionTable.css";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserData } from "../../../redux/actions/login/loginSlice";

const OperationAdmin = () => {
  const [operations, setOperations] = React.useState([]);
  const navigate = useNavigate();
  const [userList, setUserList] = React.useState<any[]>([]);
  const [selectedUsername, setSelectedUsername] = React.useState<string>("");
  const userState = useAppSelector(selectUserData);
  const [loadingUsers, setLoadingUsers] = React.useState(false);
const [loadingOperations, setLoadingOperations] = React.useState(false);


  const data = useParams().uname;

  React.useEffect(() => {
    getList({ username: userState.user?.username!, search: "", type: "" });
  }, [userState]);

  const getList = (obj: {
    username: string;
    type: string;
    search: string;
    status?: string;
    page?: number;
  }) => {
    if (!obj.page) obj.page = 1;

    setLoadingUsers(true);

    userService.getUserList(obj).then((res: AxiosResponse<any>) => {
      const items = res.data.data.items || [];
      setUserList(items);
    }).finally(() => {
        setLoadingUsers(false);
      });
  };

  //console.log(data,"dddd")

  React.useEffect(() => {
    if (!selectedUsername) {
      setOperations([]);
      return;
    }
    setLoadingOperations(true);

    betService
      .postsettelement2({ username: selectedUsername })
      .then((res: AxiosResponse<any>) => {
        setOperations(res.data.data.operations || []);
        console.log(res, "ffff");
        if (!res?.data?.data?.operations) {
          toast.error(res?.data?.data?.msg);
        }
      })
      .catch(() => {
        setOperations([]);
      })
      .finally(() => {
        setLoadingOperations(false);
      });
  }, [selectedUsername]);

  return (
    <>
      <div className="container-fluid">
      <h6 style={{ width: "100%;", fontSize:"18px" }} className="py-2">
              Account Operation
            </h6>
        <div className="modal-contentff  form-elegant">
        <div className="modal-headevr text-center pb-0">
  {loadingUsers ? (
    <div className="text-center py-2">
      <span className="spinner-border spinner-border-sm text-primary" />
      <span className="ml-2">Loading users...</span>
    </div>
  ) : (
    <select
      className="form-control"
      value={selectedUsername}
      onChange={(e) => setSelectedUsername(e.target.value)}
    >
      <option value="">Select Username</option>

      {userList.length > 0 ? (
        userList.map((user: any) => (
          <option key={user._id} value={user.username}>
            {user.username}
          </option>
        ))
      ) : (
        <option disabled>No User found</option>
      )}
    </select>
  )}
</div>

          <div className="modal-body overflow-auto small">
            <table className="table table-striped table-bordered">
              <thead className=" navbar-bet99 text-dark">
                <tr>
                  <th className="p-1 pl-2 small">Date</th>
                  <th className="p-1 small text-center no-sort">Operation</th>
                  <th className="p-1 small text-center no-sort">Done By</th>
                  <th className="p-1 small text-center no-sort">Description</th>
                </tr>
              </thead>
              <tbody>
  {loadingOperations ? (
    <tr>
      <td colSpan={4} className="text-center py-3">
        <span className="spinner-border text-primary" />
        <div className="mt-1">Loading operations...</div>
      </td>
    </tr>
  ) : operations.length > 0 ? (
    operations.map((item: any, index) => (
      <tr key={index} style={{ fontSize: "11px" }}>
        <td>{new Date(item?.date).toLocaleString()}</td>
        <td>{item?.operation}</td>
        <td>{item?.doneBy}</td>
        <td>{item?.description}</td>
      </tr>
    ))
  ) : selectedUsername ? (
    <tr>
      <td colSpan={4} className="text-center">
        No Operation found
      </td>
    </tr>
  ) : (
    <tr>
      <td colSpan={4} className="text-center">
        Please select a username
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        
        </div>
      </div>
    </>
  );
};
export default OperationAdmin;
