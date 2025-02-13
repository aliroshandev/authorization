import React, {useState} from "react";
import {AutoComplete, ConfigProvider, Form, Input, InputNumber, Select, Skeleton,} from "antd";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {DatePicker, JalaliLocaleListener} from "antd-jalali";
import fa_IR from "antd/lib/locale/fa_IR";
import moment from "jalali-moment";
import "./RenderElement.scss";

//Elements Type => text, dropdown, date, autocomplete
const RenderElement = ({
                         type,
                         label,
                         name,
                         rules,
                         placeholder,
                         searchForm,
                         id = "year",
                         options = [{ value: null, title: "خالی" }],
                         defaultValue,
                         initialvalues,
                         data,
                         picker = "day",
                         dateFormat = "YYYY/MM/DD",
                         directOnChange,
                         onChange,
                         onDateChange,
                         autoCompleteValue = "value",
                         autoCompleteTitle = "title",
                         style,
                         isDisabled = false,
                         handleChange,
                         ...rest
                       }) => {
  const { Option } = Select;
  const ELEMENT_TYPE = type.toLowerCase();
  const [selectedAutocomplete, setSelectedAutocomplete] = useState({});

  // const onKeyPress = (e) => {
  //     const specialCharRegex = new RegExp("[^0-9.0-9]");
  //     const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  //     if (!specialCharRegex.test(pressedKey)) {
  //         onChange && onChange(pressedKey, e);
  //     } else {
  //         e.preventDefault();
  //         return false;
  //     }
  // };

  if (ELEMENT_TYPE === "text") {
    return (
      <Form.Item label={label} name={name} rules={rules} {...rest}>
        <Input
          defaultValue={defaultValue}
          initialvalues={initialvalues}
          placeholder={placeholder}
          disabled={isDisabled}
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "number") {
    console.log(defaultValue, initialvalues, "render element");
    return (
      <Form.Item label={label} name={name} rules={rules} {...rest}>
        <InputNumber
          defaultValue={defaultValue}
          initialvalues={initialvalues}
          placeholder={placeholder}
          disabled={isDisabled}
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "password") {
    return (
      <Form.Item label={label} name={name} rules={rules}>
        <Input.Password
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "dropdown") {
    return (
      <Form.Item label={label} name={name} rules={rules || false} style={style}>
        <Select
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...rest}
        >
          {options.map((option) => (
            <Option
              value={option[autoCompleteValue]}
              key={option[autoCompleteValue]}
              className={option.className}
            >
              {option[autoCompleteTitle]}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  } else if (ELEMENT_TYPE === "date") {
    let tempFromDate = Array.isArray(name) ? name[0] : "fromDate";
    let tempToDate = Array.isArray(name) ? name[1] : "toDate";

    return (
      <>
        <Form.Item name={tempFromDate} hidden />
        <Form.Item name={tempToDate} hidden />
        <Form.Item
          label={label}
          // name={name}
        >
          <ConfigProvider
            locale={fa_IR}
            className="date"
            direction="rtl"
            id={id}
          >
            <JalaliLocaleListener />
            <DatePicker.RangePicker
              onChange={(dates, str) => {
                if (dates && dates.length) {
                  let fromDate = str[0];
                  let toDate = str[1];
                  if (onDateChange) {
                    onDateChange(tempFromDate, tempToDate);
                  } else {
                    searchForm.setFieldsValue({
                      [tempFromDate]: fromDate,
                    });
                    searchForm.setFieldsValue({
                      [tempToDate]: toDate,
                    });
                  }
                } else {
                  searchForm.setFieldsValue({ [tempFromDate]: null });
                  searchForm.setFieldsValue({ [tempToDate]: null });
                }
              }}
              format={dateFormat}
              picker={picker}
            />
          </ConfigProvider>
        </Form.Item>
      </>
    );
  } else if (ELEMENT_TYPE === "datepicker") {
    return (
      <>
        <Form.Item hidden />
        <Form.Item label={label} rules={rules} name={name}>
          <ConfigProvider
            locale={fa_IR}
            className="date"
            direction="rtl"
            id={id}
          >
            <JalaliLocaleListener />
            <DatePicker
              onChange={(date, dateString) => {
                searchForm.setFieldsValue({
                  [name]: dateString,
                });
              }}
              disabledDate={(current) => {
                return current > moment();
              }}
              format={dateFormat}
            />
          </ConfigProvider>
        </Form.Item>
      </>
    );
  } else if (ELEMENT_TYPE === "autocomplete") {
    return (
      <>
        {data && data.length > 0 ? (
          <Form.Item label={label} name={name}>
            <AutoComplete
              onSelect={(value, item) => {
                searchForm.setFieldsValue({ [name]: item.children });
                setSelectedAutocomplete(item);
                handleChange && handleChange(value, item);
              }}
              filterOption={(inputValue, option) =>
                option.children.includes(inputValue)
              }
              placeholder={placeholder}
              style={{ width: "100%" }}
              value={selectedAutocomplete.children}
              {...rest}
            >
              {data.map((item) => {
                return (
                  <AutoComplete.Option
                    key={item[autoCompleteValue]}
                    value={item[autoCompleteTitle]}
                  >
                    {`${item[autoCompleteTitle]}`}
                  </AutoComplete.Option>
                );
              })}
            </AutoComplete>
          </Form.Item>
        ) : data.length === 0 ? (
          <Form.Item label={label}>
            <Input placeholder={"داده ای وجود ندارد"} disabled={true} />
          </Form.Item>
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
  } else return <p>مدلی برای نمایش این داده وجود ندارد</p>;
};

export default RenderElement;
