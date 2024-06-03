import React from "react";
import { Button, Spin } from "antd";
import "./Buttons.scss";
import { AiFillCheckCircle } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

export const BackBtn = ({ onBack, buttonText = "بازگشت" }) => {
  return (
    <Button type="primary" onClick={onBack} className="back-btn">
      {buttonText}
      <BiArrowBack className="custom-btn" />{" "}
    </Button>
  );
};

export const SubmitBtn = ({
  submitText = " ثبت",
  isUpdating = false,
  disabled = false,
  onSubmit,
}) => {
  return (
    <Button
      type="primary"
      htmlType="submit"
      className="submit-btn"
      disabled={disabled || isUpdating}
      {...(onSubmit && { onClick: onSubmit })}
    >
      {submitText}
      {isUpdating ? (
        <Spin className="button-spin" />
      ) : (
        <AiFillCheckCircle className="custom-btn" />
      )}
    </Button>
  );
};

export const FormButtons = ({
  onBack,
  buttonText,
  submitText,
  isUpdating,
  disableSubmit,
}) => {
  return (
    <div className="form-buttons-section">
      <SubmitBtn
        submitText={submitText}
        isUpdating={isUpdating}
        disabled={disableSubmit}
      />
      <BackBtn onBack={onBack} buttonText={buttonText} />
    </div>
  );
};

// const
