import { useState, useCallback, useEffect, useContext } from 'react';
import { useApi } from './useApi';
import { Notification } from '../model/notification';
import { NotificationService } from '../api/services/NotificationService';
import { NotificationContext } from '../context/notification-context';

interface PaginationParams {
    page: number;
    limit: number;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export function useNotifications() {
    const { state, dispatch } = useContext(NotificationContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        limit: 10
    });
    const [totalCount, setTotalCount] = useState(0);

    // Get paginated tickets
    const {
        data: notificationsData,
        loading: notificationsLoading,
        error: notificationsError,
        refetch: refetchNotifications
    } = useApi(
        () => NotificationService.getNotifications(pagination.page, pagination.limit),
        {
            immediate: true,
            //   deps: [pagination.page, pagination.limit] // Re-fetch when pagination changes
        }
    );

    useEffect(() => {
        if (notificationsData) {
            setNotifications(notificationsData.data || notificationsData);
            setTotalCount(notificationsData.totalElements || notificationsData?.data?.length || 0);
        }
    }, [notificationsData]);

    // Update pagination
    const updatePagination = useCallback((newPagination: Partial<PaginationParams>) => {
        setPagination(prev => ({ ...prev, ...newPagination }));
    }, []);

    // Go to specific page
    const goToPage = useCallback((page: number) => {
        updatePagination({ page });
    }, [updatePagination]);

    // Change page size
    const changePageSize = useCallback((limit: number) => {
        updatePagination({ page: 1, limit }); // Reset to first page when changing page size
    }, [updatePagination]);

    // Get single ticket
    const getNotification = useCallback(async (id: number) => {
        try {
            const notification = await NotificationService.getNotificationById(id);
            setSelectedNotification(notification);
            return notification;
        } catch (error) {
            console.error('Error fetching notification:', error);
            throw error;
        }
    }, []);

    // Refresh current page
    const refreshNotifications = useCallback(() => {
        refetchNotifications();
    }, [refetchNotifications]);

    return {
        // Data
        notifications,
        selectedNotification,
        totalCount,

        // Pagination info
        currentPage: pagination.page,
        pageSize: pagination.limit,
        totalPages: Math.ceil(totalCount / pagination.limit),

        // Loading states
        loading: notificationsLoading,
        error: notificationsError,

        // CRUD operations
        getNotification,

        // Pagination controls
        goToPage,
        changePageSize,
        updatePagination,

        // Utilities
        refreshNotifications,
        refetchNotifications,
    };
}