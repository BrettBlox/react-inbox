import React from "react";

const Toolbar = ({
  messages,
  toggleSelectAll,
  markAsRead,
  markAsUnread,
  applyLabel,
  removeLabel,
  deleteMessages,
  toggleCompose
}) => {
  const unreadCount = messages.filter(message => !message.read).length;
  const selectedCount = messages.filter(message => message.selected).length;
  let selectAllClass;

  switch (selectedCount) {
    case 0:
      selectAllClass = "fa-square-o";
      break;
    case messages.length:
      selectAllClass = "fa-check-square-o";
      break;
    default:
      selectAllClass = "fa-minus-square-o";
  }

  return (
    <div className="row toolbar">
      <div className="col-xs-12">
        <p className="pull-right">
          <span className="badge badge">{unreadCount}</span>
          unread {unreadCount === 1 ? "message" : "messages"}
        </p>

        <button className="btn btn-danger" onClick={toggleCompose}>
          <i className={`fa fa-plus`} />
        </button>

        <button className="btn btn-default" onClick={toggleSelectAll}>
          <i className={`fa ${selectAllClass}`} />
        </button>

        <button
          className="btn btn-default"
          onClick={markAsRead}
          disabled={selectedCount === 0}
        >
          Mark As Read
        </button>

        <button
          className="btn btn-default"
          onClick={markAsUnread}
          disabled={selectedCount === 0}
        >
          Mark As Unread
        </button>

        <select
          className="form-control label-select"
          disabled={selectedCount === 0}
          onChange={e => {
            applyLabel(e.target.value);
            e.target.selectedIndex = 0;
          }}
        >
          <option>Apply label</option>
          <option value="dev">dev</option>
          <option value="personal">personal</option>
          <option value="gschool">gschool</option>
        </select>

        <select
          className="form-control label-select"
          disabled={selectedCount === 0}
          onChange={e => {
            removeLabel(e.target.value);
            e.target.selectedIndex = 0;
          }}
        >
          <option>Remove label</option>
          <option value="dev">dev</option>
          <option value="personal">personal</option>
          <option value="gschool">gschool</option>
        </select>

        <button
          className="btn btn-default"
          onClick={deleteMessages}
          disabled={selectedCount === 0}
        >
          <i className="fa fa-trash-o" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
