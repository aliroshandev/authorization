import React from "react";
import { Button } from "antd";
import { IoReloadOutline } from "react-icons/io5";
import "./ErrorSectionStyle.scss";
const ErrorSection = ({
  message = "خطا در دریافت اطلاعات",
  handleRefresh,
  refreshButtonText = "تلاش مجدد",
}) => {
  return (
    <div className="errorSection">
      <h3>{message}</h3>
      {handleRefresh && (
        <Button
          type="primary"
          icon={<IoReloadOutline />}
          className="refreshBtn"
          onClick={handleRefresh}
        >
          {refreshButtonText}
        </Button>
      )}
    </div>
  );
};

export default ErrorSection;
