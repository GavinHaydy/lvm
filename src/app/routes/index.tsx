import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PythonManagePage } from '@/features/version-manager/pages/PythonManagePage';
import { ErrorPage } from '@/pages/error';
import { BasicLayout } from '@/layouts/BasicLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BasicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/python" />,
      },
      {
        path: 'python',
        element: <PythonManagePage />,
      },
    ],
  },
]);
