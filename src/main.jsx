import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './components/HomePage.jsx';
import Search from './components/Search.jsx';
import Movie from './components/Movie.jsx'
import Error from './components/Error.jsx'

const appRouter=createBrowserRouter([
  {
    path:"/",
  element: <App/>,
  children :[
    {
      path:"/",
      element:<HomePage></HomePage>,
    },
    {
      path:"/search",
      element:<Search></Search>,
    },
    {
      path:"/movie/:movieId",
      element:<Movie></Movie>,
    },
  ],
  errorElement:<Error></Error>
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter}/>,
)
