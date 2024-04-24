import { createBrowserRouter } from 'react-router-dom';
import ChannelPanel from '../components/ChannelPanel';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ChannelPanel />
      },
    ],
  },
]);