import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Quadro } from './pages/Quadro';
import { EntityDetail, EntityList, MediaDetail, MediaList, RecordDetail, RecordList, SourceDetail, SourceList } from './pages/Segreta';
import { ConcordanceGraph, Concordanze, Matches, Timeline } from './pages/Concordanze';
import { ManualChapter, ManualIndex } from './pages/Manuale';
import { GapDetail, GapList } from './pages/Lacune';
import { Deposito } from './pages/Deposito';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Quadro />,
      },
      {
        path: 'segreta',
        children: [
          { index: true, element: <EntityList /> },
          { path: 'entita/:id', element: <EntityDetail /> },
          { path: 'record', element: <RecordList /> },
          { path: 'record/:id', element: <RecordDetail /> },
          { path: 'fonti', element: <SourceList /> },
          { path: 'fonti/:id', element: <SourceDetail /> },
          { path: 'media', element: <MediaList /> },
          { path: 'media/:id', element: <MediaDetail /> },
          { path: 'lacune', element: <GapList /> },
          { path: 'lacune/:id', element: <GapDetail /> },
          { path: ':tipo', element: <EntityList /> },
        ],
      },
      {
        path: 'concordanze',
        children: [
          { index: true, element: <Concordanze /> },
          { path: 'grafo', element: <ConcordanceGraph /> },
          { path: 'corrispondenze', element: <Matches /> },
          { path: 'cronologia', element: <Timeline /> },
        ],
      },
      {
        path: 'deposito',
        element: <Deposito />,
      },
      {
        path: 'manuale',
        children: [
          { index: true, element: <ManualIndex /> },
          { path: ':slug', element: <ManualChapter /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
