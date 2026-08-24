import { Slide, ToastContainer } from "react-toastify"
import { CookiesProvider } from "react-cookie"
import { RouterProvider } from "react-router-dom"
import { router } from "@/routes/router"

function App() {

  return (
    <>
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
    </>
  )
}

export default App
