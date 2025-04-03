import axios from "axios";

const BASE_URL = "http://localhost:3000";

const api = {
  // ###################### Аутентификация ####################
  login: (user) => {
    const res = axios.post(`${BASE_URL}/user-service/sign-in`, user)
      .catch((error) => {
        return error.response.data;
      });
    return res;
  },

  register: (user) => {
    const res = axios.post(`${BASE_URL}/user-service/sign-up`, user)
      .catch((error) => {
        return error.response.data;
      });
    return res;
  },

  signOut: (refreshToken) => {
    const res = axios.post(`${BASE_URL}/user-service/sign-out`, { refreshToken })
      .catch((error) => {
        return error.response.data;
      });
    return res;
  },

  // ###################### Пользователи ####################
  getAllUsers: () => {
    const res = axios.get(`${BASE_URL}/user-service/users`)
      .catch((error) => {
        return error.response.data;
      });
    return res;
  },

  updateUser: (id, data) => {
    const res = axios.put(`${BASE_URL}/user-service/${id}`, data)
      .catch((error) => {
        return error.response.data;
      });
    return res;
  },

  deleteUser: (id) => {
    const res = axios.delete(`${BASE_URL}/user-service/${id}`)
      .catch((error) => {
        return error.response.data;
      });
    return res;
  },

  // ###################### Чат ####################
//   getAllChats: () => {
//     const res = axios.get(`${BASE_URL}/chat-service/chats`)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return res;
//   },

//   getChatMessages: (chatId) => {
//     const res = axios.get(`${BASE_URL}/chat-service/chats/${chatId}/messages`)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return res;
//   },

//   sendMessage: (chatId, message) => {
//     const res = axios.post(`${BASE_URL}/chat-service/chats/${chatId}/messages`, message)
//       .catch((error) => {
//         return error.response.data;
//       });
//     return res;
//   }
};

export default api; 