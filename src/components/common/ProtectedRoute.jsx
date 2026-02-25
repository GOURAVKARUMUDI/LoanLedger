import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../../store/useStore';

function ProtectedRoute({ children, role }) {
    const { currentUser } = useStore();


    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (role && currentUser.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
