import React from "react";
import {Checkbox, Form, Input, InputNumber, Radio, Select, Skeleton,} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import ReactSelect from "react-select";

//Elements Type => text, dropdown, date, autocomplete
const RenderElement = ({
                         type,
                         label,
                         name,
                         rules,
                         placeholder,
                         searchForm,
                         id = "year",
                         options = [{value: null, title: "خالی"}],
                         checkOptions = [{value: "خالی", label: "خالی"}],
                         defaultValue,
                         initialValues,
                         data,
                         divideBy,
                         autoCompleteValue,
                         autoCompleteTitle,
                         autoCompleteJsonValue,
                         callBack,
                         value,
                         disabled = false,
                         rows = 5,
                         mode,
                         onChange,
                         directOnChange,
                         onDateChange,
                         dateFormat = "YYYY/MM/DD",
                         picker = "day",
                         mapHandler,
                         className = "",
                       }) => {
  const {Option} = Select;
  const ELEMENT_TYPE = type.toLowerCase();

  const onKeyPress = (e) => {
    const specialCharRegex = new RegExp("[^0-9.0-9]");
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!specialCharRegex.test(pressedKey)) {
      onChange && onChange(pressedKey, e);
    } else {
      e.preventDefault();
      return false;
    }
  };

  if (ELEMENT_TYPE === "text") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Input
          disabled={disabled}
          defaultValue={defaultValue}
          initialValues={initialValues}
          onChange={onChange}
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "password") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Input.Password
          iconRender={(visible) =>
            visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>
          }
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "textarea") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Input.TextArea rows={rows}/>
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "button") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <button className={className} type="button" onClick={callBack}>
          {value}
        </button>
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "dropdown" || ELEMENT_TYPE === "select") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Select
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={defaultValue}
          mode={mode ? mode : "single"}
        >
          {options &&
            options.map((option) => (
              <Option
                value={
                  autoCompleteJsonValue
                    ? JSON.stringify({
                      id: option[autoCompleteJsonValue[0]],
                      name: option[autoCompleteJsonValue[1]],
                    })
                    : option[autoCompleteValue]
                      ? option[autoCompleteValue]
                      : option.value
                }
                key={
                  option[autoCompleteValue]
                    ? option[autoCompleteValue]
                    : option.value
                }
                className={option.className}
              >
                {option[autoCompleteTitle]
                  ? option[autoCompleteTitle]
                  : option.title}
              </Option>
            ))}
        </Select>
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "autocomplete") {
    return (
      <>
        {data && data.length > 0 && JSON.stringify(data) ? (
          <>
            <ReactSelect
              onChange={onChange}
              options={data?.map((item) => ({
                label: item[autoCompleteTitle],
                value: item[autoCompleteValue],
              }))}
              isDisabled={disabled}
            />
          </>
        ) : (
          <Skeleton.Button
            active={true}
            style={{
              marginTop: "30px",
              width: "200px",
              borderRadius: "6px",
            }}
          />
        )}
      </>
    );
  } else if (ELEMENT_TYPE === "number") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <InputNumber
          // defaultValue={defaultValue}
          // initialValues={initialValues}
          onKeyPress={(e) => onKeyPress(e)}
          onChange={(e) => directOnChange && directOnChange(e)}
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "checkbox") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Checkbox.Group
          className="d-flex checkbox-inline"
          defaultValue={defaultValue}
          options={checkOptions}
          onChange={(e) => onChange && onChange(e)}
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "radio") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Radio.Group
          className="d-flex checkbox-inline"
          defaultValue={defaultValue}
          options={checkOptions}
          value={defaultValue}
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "label") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <span>{value ? value : "ناموجود"}</span>
      </Form.Item>
    );
  } else return <></>;
};

export default RenderElement;
