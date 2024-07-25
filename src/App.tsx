import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LizSwap from './pages/liz-swap';
import { DefaultLayout } from './layout/DefaultLayout';
import { JocPage } from './pages/joc';
import { Deposit } from './pages/deposit';
import { Withdraw } from './pages/withdraw';
import { Transfer } from './pages/transfer';
import { RecurringOrderPage } from './pages/recurring-order';
import { paths } from './routes/paths';
import { DataProvider } from './contexts/DataContext';

function App() {
  const router = createBrowserRouter([
    {
      id: 'root',
      path: '/',
      Component: DefaultLayout,
      children: [
        {
          id: 'liz-swap',
          path: paths.lizSwap.url,
          Component: LizSwap,
          element: <DefaultLayout />,
        },
        {
          id: 'joc-page',
          path: paths.joc.url,
          Component: JocPage,
          element: <DefaultLayout />,
        },
        {
          id: 'deposit',
          path: paths.deposit.url,
          Component: Deposit,
          element: <DefaultLayout />,
        },
        {
          id: 'withdraw',
          path: paths.withdraw.url,
          Component: Withdraw,
          element: <DefaultLayout />,
        },
        {
          id: 'transfer',
          path: paths.transfer.url,
          Component: Transfer,
          element: <DefaultLayout />,
        },
        {
          id: 'recurring-order',
          path: paths.recurringOrder.url,
          Component: RecurringOrderPage,
          element: <DefaultLayout />,
        },
      ],
    },
  ]);

  return (
    <DataProvider>
      <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      />
    </DataProvider>
  );
}

export default App;
