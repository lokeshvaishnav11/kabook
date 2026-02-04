import React, { useState } from "react";

const TvSettings = () => {
  const [tvOptions, setTvOptions] = useState({
    casinoTv: false,
    sportTv: false,
  });

  const handleChange = (e:any) => {
    const { name, checked } = e.target;
    setTvOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>TV Settings</h2>

      <label style={styles.option}>
        <input
          type="checkbox"
          name="casinoTv"
          checked={tvOptions.casinoTv}
          onChange={handleChange}
        />
        <span style={styles.label}>Casino TV</span>
      </label>

      <label style={styles.option}>
        <input
          type="checkbox"
          name="sportTv"
          checked={tvOptions.sportTv}
          onChange={handleChange}
        />
        <span style={styles.label}>Sport TV</span>
      </label>

      <div style={styles.result}>
        <strong>Selected:</strong>
        <pre>{JSON.stringify(tvOptions, null, 2)}</pre>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  heading: {
    marginBottom: "20px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    fontSize: "16px",
    cursor: "pointer",
  },
  label: {
    marginLeft: "10px",
  },
  result: {
    marginTop: "20px",
    fontSize: "14px",
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "6px",
  },
};

export default TvSettings;
