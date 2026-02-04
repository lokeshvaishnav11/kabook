import React from "react";

const AssignAgent = () => {
  return (
    <div>
      <div style={{ padding: "10px 15px 70px" }}>
        {/* Assign Agent List */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Assign Agent List</h4>
              <div className="page-title-right"></div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="cardd">
              <div className="card-body p-4">
                <div className="mb-3">
                  <div className="row row5"></div>
                </div>

                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="dataTables_length">
                      <label className="d-inline-flex align-items-center">
                        Show&nbsp;
                        <select className="custom-select custom-select-sm">
                          <option value="50">50</option>
                          <option value="75">75</option>
                          <option value="100">100</option>
                          <option value="125">125</option>
                          <option value="150">150</option>
                        </select>
                        &nbsp;entries
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-12 col-md-6 text-md-right">
                    <label className="d-inline-flex align-items-center">
                      Search:
                      <input
                        type="search"
                        placeholder="Search..."
                        className="form-control form-control-sm ml-2"
                      />
                    </label>
                  </div>
                </div>

                <div className="table-responsive mb-0">
                  <table className="table table-bordered table-responsive-sm">
                    <thead>
                      <tr>
                        <th style={{ fontSize: "14px" }}>S.No.</th>
                        <th style={{ fontSize: "14px" }}>User Name</th>
                        <th style={{ fontSize: "14px" }}>
                          Assign Agent Settings
                        </th>
                        <th style={{ fontSize: "14px" }}>Mobile Number</th>
                        <th style={{ fontSize: "14px" }}>Depo Mobile Number</th>
                        <th style={{ fontSize: "14px" }}>First Bonus Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center my-2">
                          There are no records to show
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Creation */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">User Creation</h4>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="cardd">
              <div className="card-body p-4">
                <form className="ajaxFormSubmit">
                  <div className="row row5">
                    <div className="col-md-2">
                      <label>From Date:</label>
                      <input type="date" className="form-control" />
                    </div>

                    <div className="col-md-2">
                      <label>To Date:</label>
                      <input type="date" className="form-control" />
                    </div>

                    <div className="col-md-2 mt-4">
                      <button type="submit" className="btn btn-primary">
                        Download CSV
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAgent;
