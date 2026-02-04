import React from "react";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DashboardDrawer: React.FC<Props> = ({ open, onClose }) => {
          const userState = useAppSelector(selectUserData);
    
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="drawer-overlay"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <div>
            {/* <strong>B2 PANEL</strong> */}
            {/* <div className="text-muted small">WIN0048</div> */}
          </div>
          <button className="btn btn-sm btn-outline-dark" onClick={onClose}>
            ✕
          </button>
        </div>

        <ul className="drawer-menu">
          <DrawerItem label="Dashboard" to="/" />
          <DrawerItem label="Global search" to={`/list-clients/${userState?.user?.username}`} />
          <DrawerItem label="Clients" to={`/list-clients/${userState?.user?.username}`} />
          <DrawerItem label="Accounts" to="/payment-method" />
          <DrawerItem label="Deposit" to="/depositstatement" />
          <DrawerItem label="Withdraw" to="/withdrawstatement" />
          {/* <DrawerItem label="Extra Users" to="/extra-users" /> */}
          <DrawerItem label="A/C Statement" to="/accountstatement" />
          {/* <DrawerItem label="Site user stats" to="/site-user-stats" /> */}
          {/* <DrawerItem label="Change Password" to="/change-password" /> */}
        </ul>

        <div className="p-3">
          <button className="btn btn-info w-100 text-white fw-semibold">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const DrawerItem = ({
  label,
  to,
}: {
  label: string;
  to: string;
}) => (
  <li>
    <CustomLink to={to} className="drawer-link">
      {label}
    </CustomLink>
  </li>
);

export default DashboardDrawer;
