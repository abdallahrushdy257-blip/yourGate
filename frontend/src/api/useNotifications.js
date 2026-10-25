import { useEffect, useState } from "react";

export default function useNotifications(organizationId) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!organizationId) return;

        const channel = window.Echo.private(`organization.${organizationId}`);
        
        channel.listen('.notification.created', (data) => {
            setNotifications(prev => [data.notification, ...prev]);
            console.log("RECEIVED => ", data);
        });

        return () => {
            window.Echo.leave(`organization.${organizationId}`);
        };
    }, [organizationId]);

    return notifications;
}
