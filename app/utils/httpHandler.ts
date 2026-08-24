import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

axiosInstance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error?.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
    try {
      // Get the refresh token
      const refreshToken = sessionStorage.getItem(import.meta.env.VITE_REFRESH_KEY);

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Request a new token
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}nova_auth/customer/refresh_token`,
        { refresh_token: refreshToken }
      );

      // Save the new tokens
      sessionStorage.setItem(import.meta.env.VITE_SESSION_KEY, data.access_token);
      sessionStorage.setItem(import.meta.env.VITE_REFRESH_KEY, data.refresh_token);

      // Update the Authorization header and retry the original request
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);

      // Clear session and redirect to login
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/';
      return Promise.reject(refreshError);
    }
  }
  else {
    return Promise.reject(error)
  }
})

const removeNullData = (data: any) => {
  Object.keys(data).forEach(key => {
    if (!data[key]) {
      delete data[key]
    }
  })
  return data
}

const errorHandler = (error: any) => {
  if (error?.response) {
    if (Array.isArray(error.response.data?.error_message)) {
      return Promise.reject(error.response.data?.error_message[0])
    }
    if (error?.response.data?.msg) {
      return Promise.reject(error.response.data.msg)
    }
    return Promise.reject(error?.response.data?.error_message)
  }
  return Promise.reject(error.message)
}

const configAuthHeader = () => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem(import.meta.env.VITE_SESSION_KEY)}`
}

// get request handler
export const getRequestHandler = async (url: string, useToken: boolean = false) => {
  if (useToken) configAuthHeader()

  return await axiosInstance.get(url).then(res => res?.data).catch(errorHandler)
}

// post request handler
export const postRequestHandler = async (
  url: string,
  data: any = null,
  useToken: boolean = false
) => {
  if (useToken) configAuthHeader();

  const cleanedData = data ? removeNullData(data) : undefined;

  return await axiosInstance
    .post(url, cleanedData)
    .then(res => res.data)
    .catch(errorHandler);
};

//patch request handler
export const patchRequestHandler = async (url: string, data: any = null, useToken: boolean = false) => {

  if (useToken) configAuthHeader();
  const cleanedData = data ? removeNullData(data) : undefined;


  return await axiosInstance.patch(url, cleanedData).then(res => res?.data).catch(errorHandler);
}

// put request handler
export const putRequestHandler = async (url: string, data: any, useToken: boolean = false) => {
  if (useToken) configAuthHeader()
  data = removeNullData(data)

  return await axiosInstance.put(url, data).then(res => res?.data).catch(errorHandler)
}

// delete request handler
export const deleteRequestHandler = async (url: string, useToken: boolean = false) => {
  if (useToken) configAuthHeader()

  return await axiosInstance.delete(url).then(res => res?.data).catch(errorHandler)
}

// upload file handler
export const postFileHandler = async (url: string, Data: FormData, useToken: boolean = false) => {
  if (useToken) configAuthHeader()

  return await axiosInstance.post(url, Data, { headers: { content_type: 'multipart/form-data' }, responseType: 'blob' }).then(res => res?.data).catch(errorHandler)
}

export const putFileHandler = async (url: string, Data: FormData, useToken: boolean = false) => {
  if (useToken) configAuthHeader()

  return await axiosInstance.put(url, Data, { headers: { content_type: 'multipart/form-data' }, responseType: 'blob' }).then(res => res?.data).catch(errorHandler)
}
