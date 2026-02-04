import React from "react";
import './assign-agent.css';

const MultiLogin = () => {
  return (
    <div>
      <div>
        <div style={{ padding: "10px 15px 70px" }}>
          {/* Title */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0 font-size-18">Multi Login Account</h4>
                <div className="page-title-right"></div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="row">
            <div className="col-12">
              <div className="ca p-4">
                <div className="card-body create-account-container">
                  <form>
                    <div className="create-account-form">
                      {/* Personal Info */}
                      <h5 className="mb-2" style={{ fontSize: "14px"}}>Personal Information</h5>
                      <div className="row">
                        <div className="col-md-3 form-group">
                          <label style={{ fontSize: "14px"}}>Client ID</label>
                          <input type="text" className="form-control" />
                        </div>

                        <div className="col-md-3 form-group">
                          <label style={{ fontSize: "14px"}}>Full Name</label>
                          <input type="text" className="form-control" />
                        </div>

                        <div className="col-md-3 form-group">
                          <label style={{ fontSize: "14px"}}>Password</label>
                          <input type="password" className="form-control" />
                        </div>

                        <div className="col-md-3 form-group">
                          <label style={{ fontSize: "14px"}}>Confirm Password</label>
                          <input type="password" className="form-control" />
                        </div>
                      </div>

                      {/* Privileges */}
                      <div className="mt-3 previlages">
                        <h5 className="mb-2" style={{ fontSize: "14px"}}>Privileges</h5>

                        <div className="previlage-box">
                          {[
                            { id: 1, label: "DashBoard" },
                            { id: 2, label: "Market Analysis" },
                            { id: 4, label: "User List" },
                            { id: 5, label: "Insert User" },
                            { id: 8, label: "Account Statement" },
                            { id: 9, label: "Party Win Loss" },
                            { id: 10, label: "Current Bets" },
                            { id: 12, label: "General Lock" },
                            { id: 13, label: "Casino Result" },
                            { id: 14, label: "Live Casino Result" },
                            { id: 15, label: "Our Casino" },
                            { id: 16, label: "Events" },
                            { id: 17, label: "Market Search Analysis" },
                            { id: 19, label: "Login User creation" },
                            { id: 54, label: "Withdraw" },
                            { id: 55, label: "Deposit" },
                            { id: 56, label: "Credit Reference" },
                            { id: 57, label: "User Info" },
                            { id: 58, label: "User Password Change" },
                            { id: 59, label: "User Lock" },
                            { id: 60, label: "Bet Lock" },
                            { id: 91, label: "Active User" },
                            { id: 104, label: "Agent Assign" },
                            { id: 111, label: "User Register Report" },
                            { id: 112, label: "Total Profitloss" },
                            { id: 113, label: "User Winloss" },
                          ].map((item) => (
                            <div className="previlage-item" key={item.id}>
                              <div className="custom-control custom-checkbox" >
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`priv-${item.id}`}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor={`priv-${item.id}`}
                                >
                                  {item.label}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Transaction Code */}
                        <div className="previlage-master mt-3">
                          <div className="form-group d-flex gap-2">
                            <input
                              type="password"
                              placeholder="Transaction Code"
                              className="form-control mpass-text mr-1"
                            />
                            <button type="submit" className="btn btn-success mr-1">
                              Submit
                            </button>
                            <button type="button" className="btn btn-light">
                              Reset
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Table */}
                  <div className="outer mt-4">
                    <div className="inner">
                      <table className="table table-bordered">
                        <thead>
                            <tbody>
                          <tr>
                            <th className="fixed-col-1">Action</th>
                            <th className="fixed-col-2">Username</th>
                            <th className="fixed-col-3">Full Name</th>
                            <th>DashBoard</th>
                            <th>Market Analysis</th>
                            <th>User List</th>
                            <th>Insert User</th>
                            <th>Account Statement</th>
                            <th>Party Win Loss</th>
                            <th>Current Bets</th>
                            <th>General Lock</th>
                            <th>Casino Result</th>
                            <th>Live Casino Result</th>
                            <th>Our Casino</th>
                            <th>Events</th>
                            <th>Market Search Analysis</th>
                            <th>Login User creation</th>
                            <th>Withdraw</th>
                            <th>Deposit</th>
                            <th>Credit Reference</th>
                            <th>User Info</th>
                            <th>User Password Change</th>
                            <th>User Lock</th>
                            <th>Bet Lock</th>
                            <th>Active User</th>
                            <th>Agent Assign</th>
                            <th>User Register Report</th>
                            <th>Total Profitloss</th>
                            <th>User Winloss</th>
                          </tr>
                          </tbody>
                        </thead>
                     
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLogin;
