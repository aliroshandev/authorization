import { Button } from "antd";
import { IoAddCircleOutline } from "react-icons/io5";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";

import "./CrudBtn.scss";

const CrudBtn = ({ onDelete, onEdit, onNew }) => {
  return (
    <div className="crud-button-section">
      {onNew && (
        <Button type="primary" onClick={onNew}>
          جدید
          <IoAddCircleOutline />
        </Button>
      )}
      {onEdit && (
        <Button type="secondary" onClick={onEdit}>
          ویرایش
          <MdEdit />
        </Button>
      )}
      {onDelete && (
        <Button type="danger" onClick={onDelete}>
          حذف
          <RiDeleteBin3Fill />
        </Button>
      )}
    </div>
  );
};

export default CrudBtn;
