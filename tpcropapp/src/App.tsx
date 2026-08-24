import { Slide, ToastContainer } from "react-toastify"
import { CookiesProvider } from "react-cookie"
import { RouterProvider } from "react-router-dom"
import { router } from "@/routes/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
        <RouterProvider router={router} />
      </CookiesProvider>
    </QueryClientProvider>
  )
}

export default App
