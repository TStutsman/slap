import { createBrowserRouter } from 'react-router-dom';
import Landing from '../components/Landing';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing/>
  },
  {
    element: <Layout />,
    children: [
    ],
  },
]);