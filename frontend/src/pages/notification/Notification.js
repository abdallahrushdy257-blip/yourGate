import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faTriangleExclamation,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import "./Notification.css";
import React , { useState , useEffect } from "react";
import API from "../../api/axiosConfig";
import { useParams } from "react-router";

const priorityMap = {
  0: { label: "منخفض", color: "#6c757d", icon: faBell },
  1: { label: "عادي", color: "#0d6efd", icon: faCircleInfo },
  2: { label: "هام", color: "#dc3545", icon: faTriangleExclamation },
};

const NotificationItem = ({ notification }) => {
    const [notificationData, setNotificationData] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
          const res = await API.get(`/notify/${id}`);
          const data = await res;
          if (res.status === 200) {
              setNotificationData(data.data);
            }
        } catch (error) {
            console.error("Error fetching notification:", error);
        }
    };
    fetchNotifications();
}, []);
const priority = priorityMap[notificationData.priority] || priorityMap[1];
   
   

  return (
    <div
      className={`notification-card ${
        notificationData.is_read ? "" : "unread"
      }`}
      style={{ borderRightColor: priority.color }}
    >
      <div className="notification-header">
        <FontAwesomeIcon
          icon={priority.icon}
          style={{ color: priority.color }}
        />
        <span className="notification-title">
          {notificationData.title}
        </span>
      </div>

      <div className="notification-body">
        {notificationData.subject}
      </div>

      <div className="notification-footer">
        <span
          className="priority-badge"
          style={{ backgroundColor: priority.color }}
        >
          {priority.label}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
