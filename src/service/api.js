import axios from "axios";
import config from "./config";
// import router from '../router'

const buildErrorLog = (error) => {
  const response = error?.response || {}
  const request = error?.request || {}
  const configRequest = error?.config || {}

  return {
    event: 'api_error',
    timestamp: new Date().toISOString(),
    url: `${configRequest.baseURL || config.BASEURL}${configRequest.url || ''}`,
    method: configRequest.method || 'UNKNOWN',
    httpStatus: response.status || request.status || null,
    message: response?.data?.message || error?.message || 'Sin detalle',
    requestHeaders: configRequest.headers || {},
    requestData: configRequest.data || null,
    responseData: response?.data || null,
    stack: error?.stack || null,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    user: (() => {
      try {
        return JSON.parse(sessionStorage.getItem('data'))
      } catch (e) {
        return null
      }
    })()
  }
}

const sendErrorToBackend = async (error) => {
  const payload = buildErrorLog(error)

  try {
    await fetch(`${config.BASEURL}/errorLogs/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (reportError) {
    console.error('No se pudo enviar el error al backend:', reportError)
    console.error('Detalle original:', payload)
  }
}

let token = sessionStorage.getItem("token") === "undefined"? null: sessionStorage.getItem("token")
let api = axios.create({
  baseURL: config.BASEURL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      // console.log("todo bien...");
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          console.log(error)
          sendErrorToBackend(error)
          break;
        case 401:
          sendErrorToBackend(error)
          window.location.href = "/";
          break;

        case 403:
          console.log(error)
          sendErrorToBackend(error)
          break;
        case 404:
          console.log(error)
          sendErrorToBackend(error)
          break;
        case 500:
          console.log(error)
          sendErrorToBackend(error)
          break;

        case 502:
          console.log(error)
          sendErrorToBackend(error)
          break;
        default:
          sendErrorToBackend(error)
      }
      return Promise.reject(error.response);
    }

    sendErrorToBackend(error)
    return Promise.reject(error)
  }
);

export default api;
