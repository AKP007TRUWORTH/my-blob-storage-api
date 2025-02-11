import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

export default () => {
  const navigate = useNavigate()
  const location = useLocation()

  const makeRequest = async ({ url, body, tokenKey, method, onSuccess, onError }) => {
    try {
      method = method.toUpperCase()
      const token = tokenKey ?? localStorage.getItem("accessKey")

      const request = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        },
        data: body
      }

      const response = await axios(request)

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data

    } catch (err) {
      console.log(err)

      if (onError) {
        onError(err)
      }

      if (err.response) {
        if (err.response.status == 401 && err.response.data.errors[0].name == "TokenExpiredError") {
          localStorage.clear()
          return navigate({ pathname: "/", state: { from: location } })
        }
      }
    }
  }

  return { makeRequest }
}