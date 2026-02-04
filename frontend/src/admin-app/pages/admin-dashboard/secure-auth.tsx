import React, { useEffect, useState } from "react";
import "./assign-agent.css";

const SecureAuth = () => {
  const [activeTab, setActiveTab] = useState("telegram"); // default telegram
  const [showTelegramSteps, setShowTelegramSteps] = useState(false);
  const [authCode, setAuthCode] = useState("");

  // Generate random 6-digit code for Mobile App
  useEffect(() => {
    if (activeTab === "mobile") {
      const randomCode:any = Math.floor(100000 + Math.random() * 900000);
      setAuthCode(randomCode);
    }
  }, [activeTab]);

  return (
    <div style={{ padding: "10px 15px 70px" }}>
      <div className="security-auth">
        {/* Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">
                Secure Auth Verification
              </h4>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Status */}
          <div className="text-center">
            <b>Secure Auth Verification Status:</b>{" "}
            <span className="badge badge-danger">Disabled</span>
          </div>

          <div className="mt-2 text-center">
            Please select below option to enable secure auth verification
          </div>

          {/* Tabs */}
          <div className="casino-report-tabs mt-3">
            <ul className="nav nav-tabs">
              <li className="nav-item pointer">
                <a
                  className={`nav-link ${
                    activeTab === "mobile" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("mobile");
                    setShowTelegramSteps(false);
                  }}
                >
                  Enable Using Mobile App
                </a>
              </li>

              <li className="nav-item pointer">
                <a
                  className={`nav-link ${
                    activeTab === "telegram" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("telegram");
                    setShowTelegramSteps(false);
                  }}
                >
                  Enable Using Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content mt-4">

            {/* ================= MOBILE APP TAB ================= */}
            {activeTab === "mobile" && (
              <div className="tab-pane active">
                <div className="text-center">
                  <div className="mt-3">
                    Please enter below auth code in your
                    <br />
                    <b>Secure Auth Verification App</b>
                  </div>

                  <div className="mt-3">
                  <div
  className="verify-code"
  style={{
    display: "inline-block",
    padding: "10px",
    borderRadius: "8px",
    letterSpacing: "40px",
    backgroundColor: "#3c444b",
    color:"#aaafb5"
  }}
>
  {authCode}
</div>

                  </div>

                  <div className="mt-3">
                    <b>
                      If you haven't downloaded,
                      <br />
                      please download Secure Auth Verification App
                    </b>
                  </div>

                  <div className="mt-3">
                    Using this app you will receive auth code during login
                    authentication
                  </div>

                  <div className="mt-3">
                    <a
                      href="https://dataobj.ecoassetsservice.com/secure-auth-apk/SecureAuthApp-2.0.apk"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="btn btn-primary">
                        <i className="fab fa-android"></i>{" "}
                        Download on Android
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TELEGRAM TAB ================= */}
            {activeTab === "telegram" && (
              <div className="tab-pane active">
                <div className="text-center">
                  <b>Please enter your login password to continue</b>

                  <div className="form-group mt-3 secure-password d-flex justify-content-center">
                    <input
                      type="password"
                      placeholder="Enter your login password"
                      className="form-control"
                      style={{ maxWidth: "300px" }}
                    />
                    <button
                      className="btn btn-primary ml-2 vt"
                      onClick={() => setShowTelegramSteps(true)}
                      type="button"
                    >
                      Get Connection ID
                    </button>
                  </div>

                  {/* TELEGRAM STEPS (SHOW AFTER CLICK) */}
                  {showTelegramSteps && (
                    <div className="mt-3">
                      <b>
                        Please follow below instructions for the telegram
                        2-step verification
                      </b>

                      <p>
                        Find{" "}
                        <a
                          href="https://t.me/two_factor_gauth_bot?start"
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary"
                        >
                          @two_factor_gauth_bot
                        </a>{" "}
                        in your telegram and type <kbd>/start</kbd>.
                      </p>

                      <p className="text-dark pt-4 pb-4">
                        After this type <kbd>/connect D2004395</kbd> and send
                        it to BOT.
                      </p>

                      <p>
                        Now your telegram account will be linked with your
                        website account and 2-Step verification will be
                        enabled.
                      </p>

                      <hr />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAuth;
