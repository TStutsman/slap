import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
    ],
  },
]);